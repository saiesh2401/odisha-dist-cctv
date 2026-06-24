"""
AI CCTV Surveillance POC — Phase 1 Demo Server
================================================
Upload images/videos → Get real AI detection results
Video plays on screen with real-time AI bounding boxes
"""

import os
import uuid
import json
import time
import cv2
import base64
import numpy as np
from pathlib import Path
from datetime import datetime
from threading import Thread, Event

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from engine import SurveillanceEngine, RESULTS_DIR, UPLOADS_DIR, WANTED_PERSONS_DIR

app = FastAPI(title="AI CCTV Surveillance POC - Phase 1", version="1.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
app.mount("/results", StaticFiles(directory=str(RESULTS_DIR)), name="results")
app.mount("/uploads", StaticFiles(directory=str(UPLOADS_DIR)), name="uploads")

engine = SurveillanceEngine()

# Global state for video streaming
video_state = {
    "processing": False,
    "current_file": None,
    "alerts": [],
    "stats": {"vehicles": 0, "plates": 0, "alerts": 0, "frames": 0},
}


def generate_annotated_frames(video_path: str):
    """Generator: yields MJPEG frames with AI annotations"""
    engine.anpr._ensure_models()

    cap = cv2.VideoCapture(video_path)
    if not cap.isOpened():
        return

    fps = cap.get(cv2.CAP_PROP_FPS) or 25
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    if total_frames <= 0:
        total_frames = 1
    frame_count = 0
    all_plates = set()

    video_state["processing"] = True
    video_state["alerts"] = []
    video_state["all_plates"] = set()
    video_state["stats"] = {"vehicles": 0, "plates": 0, "alerts": 0, "frames": 0, "total_frames": total_frames}

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        frame_count += 1

        # Resize for faster streaming
        h, w = frame.shape[:2]
        if w > 960:
            scale = 960 / w
            frame = cv2.resize(frame, (960, int(h * scale)))

        annotated = frame.copy()
        is_single_frame = (total_frames <= 5)
        process_this = is_single_frame or (frame_count % 5 == 0)

        if process_this:
            # Detect vehicles
            vehicles = engine.anpr.detect_vehicles(frame)
            for v in vehicles:
                x1, y1, x2, y2 = v["bbox"]
                cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 220, 0), 2)
                cv2.putText(annotated, f'{v["type"]}', (x1, y1 - 6),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 220, 0), 1)

            # Detect plates
            plates = engine.anpr.detect_plates_in_frame(frame)
            for p in plates:
                px1, py1, px2, py2 = p["bbox"]
                plate_text = engine.anpr.read_plate_text(frame, p["bbox"])

                color = (0, 255, 0)
                label = plate_text or "Reading..."

                if plate_text and plate_text not in all_plates:
                    all_plates.add(plate_text)
                    video_state["all_plates"] = all_plates
                    match = engine.anpr.match_plate(plate_text)
                    video_state["stats"]["plates"] = len(all_plates)

                    if match["matches"]:
                        sev = match["matches"][0]["severity"]
                        typ = match["matches"][0]["type"]
                        color = (0, 0, 255) if sev == "CRITICAL" else (0, 140, 255) if sev == "HIGH" else (0, 220, 220)
                        label = f"ALERT: {plate_text}"

                        alert_entry = {
                            "plate": plate_text,
                            "type": typ,
                            "severity": sev,
                            "frame": frame_count,
                            "time": round(frame_count / fps, 1),
                            "details": match["matches"][0].get("details", {}),
                        }
                        video_state["alerts"].append(alert_entry)
                        video_state["stats"]["alerts"] = len(video_state["alerts"])

                # Draw plate box
                cv2.rectangle(annotated, (px1, py1), (px2, py2), color, 2)
                # Label background
                (tw, th), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.45, 1)
                cv2.rectangle(annotated, (px1, py1 - th - 8), (px1 + tw + 4, py1), color, -1)
                cv2.putText(annotated, label, (px1 + 2, py1 - 5),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1)

            video_state["stats"]["vehicles"] += len(vehicles)
            video_state["stats"]["frames"] = frame_count

        # HUD overlay
        cv2.rectangle(annotated, (0, 0), (320, 80), (20, 20, 20), -1)
        cv2.putText(annotated, "AI SURVEILLANCE - LIVE", (10, 20),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 200, 200), 1)
        cv2.putText(annotated, f"Frame: {frame_count}/{total_frames}", (10, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (180, 180, 180), 1)
        cv2.putText(annotated, f"Plates: {len(all_plates)}  Alerts: {len(video_state['alerts'])}", (10, 58),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.4, (180, 180, 180), 1)

        # REC indicator
        if frame_count % 30 < 20:
            cv2.circle(annotated, (300, 15), 6, (0, 0, 255), -1)
            cv2.putText(annotated, "REC", (284, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (0, 0, 255), 1)

        # Alert banner — show for 30 frames after detection, then fade
        if video_state["alerts"]:
            last = video_state["alerts"][-1]
            frames_since = frame_count - last["frame"]
            if frames_since < 30:
                alpha = max(0.3, 1.0 - (frames_since / 30.0))
                banner_color = (0, 0, int(200 * alpha)) if last["severity"] == "CRITICAL" else (0, int(140 * alpha), int(220 * alpha))
                bh = annotated.shape[0]
                overlay = annotated.copy()
                cv2.rectangle(overlay, (0, bh - 40), (annotated.shape[1], bh), banner_color, -1)
                cv2.addWeighted(overlay, alpha, annotated, 1 - alpha, 0, annotated)
                cv2.putText(annotated, f'ALERT: {last["severity"]} | {last["type"]} | Plate: {last["plate"]}',
                            (10, bh - 14), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1)

        # Encode as JPEG
        _, buf = cv2.imencode('.jpg', annotated, [cv2.IMWRITE_JPEG_QUALITY, 75])
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + buf.tobytes() + b'\r\n')

        # Control playback speed (~15 fps for smooth viewing)
        if not process_this:
            time.sleep(0.03)
        else:
            time.sleep(0.01)

    cap.release()
    video_state["processing"] = False


@app.get("/", response_class=HTMLResponse)
async def demo_page():
    return """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>AI CCTV Surveillance POC - Phase 1</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: system-ui, -apple-system, sans-serif; background: #0a0e1a; color: #e2e8f0; }

  .header { background: linear-gradient(135deg, #1e3a5f, #0f172a); padding: 16px 32px; border-bottom: 2px solid #0891b2; }
  .header h1 { font-size: 20px; font-weight: 700; color: white; }
  .header p { font-size: 11px; color: #64748b; margin-top: 2px; }

  .main { display: grid; grid-template-columns: 1fr 380px; gap: 0; height: calc(100vh - 60px); }

  .video-panel { background: #000; display: flex; flex-direction: column; }
  .video-container { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; overflow: hidden; }
  .video-container img { max-width: 100%; max-height: 100%; }
  .video-container video { max-width: 100%; max-height: 100%; }
  .video-placeholder { text-align: center; color: #475569; }
  .video-placeholder .icon { font-size: 48px; margin-bottom: 12px; }

  .upload-bar { padding: 12px 16px; background: #111827; display: flex; gap: 10px; align-items: center; border-top: 1px solid #1e293b; }
  .upload-bar input[type=file] { display: none; }
  .btn { padding: 8px 16px; border-radius: 8px; font-size: 12px; font-weight: 600; border: none; cursor: pointer; transition: all 0.2s; }
  .btn-cyan { background: #0891b2; color: white; }
  .btn-cyan:hover { background: #0e7490; }
  .btn-red { background: #dc2626; color: white; }
  .btn-purple { background: #7c3aed; color: white; }
  .btn-sm { padding: 6px 12px; font-size: 11px; }
  .upload-label { color: #94a3b8; font-size: 11px; flex: 1; }

  .sidebar { background: #0f172a; border-left: 1px solid #1e293b; display: flex; flex-direction: column; overflow: hidden; }

  .sidebar-header { padding: 12px 16px; border-bottom: 1px solid #1e293b; }
  .sidebar-header h2 { font-size: 13px; font-weight: 700; color: #e2e8f0; }

  .stats-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; padding: 12px 16px; border-bottom: 1px solid #1e293b; }
  .stat-box { background: #1e293b; border-radius: 10px; padding: 10px; text-align: center; }
  .stat-val { font-size: 22px; font-weight: 800; color: #0891b2; }
  .stat-label { font-size: 9px; color: #64748b; text-transform: uppercase; font-weight: 600; margin-top: 2px; }
  .stat-val.red { color: #ef4444; }
  .stat-val.green { color: #22c55e; }
  .stat-val.amber { color: #f59e0b; }

  .alerts-panel { flex: 1; overflow-y: auto; padding: 8px; }
  .alert-card { padding: 10px 12px; border-radius: 10px; margin-bottom: 6px; border-left: 3px solid; animation: slideIn 0.3s ease; }
  @keyframes slideIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .alert-critical { background: rgba(220,38,38,0.1); border-color: #dc2626; }
  .alert-high { background: rgba(217,119,6,0.08); border-color: #d97706; }
  .alert-medium { background: rgba(234,179,8,0.06); border-color: #eab308; }
  .alert-title { font-size: 11px; font-weight: 700; color: #f1f5f9; }
  .alert-sub { font-size: 10px; color: #64748b; margin-top: 3px; }
  .alert-plate { font-family: monospace; font-weight: 700; font-size: 13px; color: #0891b2; }

  .plates-panel { border-top: 1px solid #1e293b; max-height: 200px; overflow-y: auto; padding: 8px 16px; }
  .plates-panel h3 { font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 6px; text-transform: uppercase; }
  .plate-tag { display: inline-block; padding: 3px 8px; border-radius: 6px; font-family: monospace; font-size: 10px; font-weight: 700; margin: 2px; background: #1e293b; color: #94a3b8; border: 1px solid #334155; }
  .plate-tag.flagged { background: rgba(220,38,38,0.15); color: #ef4444; border-color: rgba(220,38,38,0.3); }

  .face-section { border-top: 1px solid #1e293b; padding: 12px 16px; }
  .face-section h3 { font-size: 11px; color: #64748b; font-weight: 600; margin-bottom: 8px; text-transform: uppercase; }
</style>
</head>
<body>

<div class="header">
  <h1>AI CCTV Surveillance — Phase 1 Working POC</h1>
  <p>Starlight Data Solutions | Kandhamal District Police | Real-Time AI Processing</p>
</div>

<div class="main">
  <!-- Left: Video -->
  <div class="video-panel">
    <div class="video-container" id="video-container">
      <div class="video-placeholder" id="placeholder">
        <div class="icon">📹</div>
        <p style="font-size:14px;color:#94a3b8;">Upload CCTV footage to begin AI analysis</p>
        <p style="font-size:11px;margin-top:4px;">Video will play with real-time bounding boxes and alerts</p>
      </div>
      <img id="stream-img" style="display:none;" />
    </div>
    <div class="upload-bar">
      <input type="file" id="video-input" accept="video/*,image/*" onchange="startProcessing(this)">
      <button class="btn btn-cyan" onclick="document.getElementById('video-input').click()">
        Upload Video / Image
      </button>
      <span class="upload-label" id="file-label">No file selected</span>
      <button class="btn btn-purple btn-sm" onclick="document.getElementById('face-input').click()">
        Face Search
      </button>
      <input type="file" id="face-input" accept="image/*" onchange="processFace(this)" style="display:none">
      <button class="btn btn-sm" style="background:#334155;color:#94a3b8;" onclick="document.getElementById('enroll-input').click()">
        + Enroll Face
      </button>
      <input type="file" id="enroll-input" accept="image/*" onchange="enrollFace(this)" style="display:none">
    </div>
  </div>

  <!-- Right: Sidebar -->
  <div class="sidebar">
    <div class="sidebar-header">
      <h2>Live Detection Dashboard</h2>
    </div>

    <div class="stats-grid">
      <div class="stat-box">
        <div class="stat-val green" id="s-plates">0</div>
        <div class="stat-label">Detections</div>
      </div>
      <div class="stat-box">
        <div class="stat-val red" id="s-alerts">0</div>
        <div class="stat-label">Alerts</div>
      </div>
      <div class="stat-box">
        <div class="stat-val" id="s-frames">0</div>
        <div class="stat-label">Frames</div>
      </div>
    </div>

    <div class="sidebar-header" style="padding:8px 16px;">
      <h2 style="color:#ef4444;">Live Alerts</h2>
    </div>
    <div class="alerts-panel" id="alerts-panel">
      <div style="text-align:center;padding:30px;color:#334155;font-size:12px;">
        Waiting for video upload...
      </div>
    </div>

    <div class="plates-panel" id="plates-panel">
      <h3>All Plates Detected</h3>
      <div id="plates-list" style="color:#334155;font-size:11px;">—</div>
    </div>

    <div class="face-section">
      <h3>UC-3: Face Recognition</h3>
      <div id="face-results" style="font-size:11px;color:#64748b;">Upload a face photo to search against wanted persons DB</div>
    </div>
  </div>
</div>

<script>
let pollInterval = null;

function startProcessing(input) {
  if (!input.files[0]) return;
  const file = input.files[0];
  document.getElementById('file-label').textContent = file.name;

  const formData = new FormData();
  formData.append('file', file);

  // Upload first
  fetch('/api/upload-video', { method: 'POST', body: formData })
    .then(r => r.json())
    .then(data => {
      if (data.file_id) {
        // Show stream
        document.getElementById('placeholder').style.display = 'none';
        const img = document.getElementById('stream-img');
        img.src = '/api/video-stream/' + data.file_id + '?t=' + Date.now();
        img.style.display = 'block';

        // Clear previous
        document.getElementById('alerts-panel').innerHTML = '';
        document.getElementById('plates-list').innerHTML = '';

        // Start polling stats
        if (pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(pollStats, 500);
      }
    })
    .catch(e => alert('Upload error: ' + e.message));
}

function pollStats() {
  fetch('/api/video-state')
    .then(r => r.json())
    .then(data => {
      document.getElementById('s-plates').textContent = data.stats.plates || 0;
      document.getElementById('s-alerts').textContent = data.stats.alerts || 0;
      document.getElementById('s-frames').textContent = data.stats.frames || 0;

      // Render alerts
      if (data.alerts && data.alerts.length > 0) {
        let html = '';
        data.alerts.slice().reverse().forEach(a => {
          const cls = a.severity === 'CRITICAL' ? 'alert-critical' : a.severity === 'HIGH' ? 'alert-high' : 'alert-medium';
          const details = a.details || {};
          const info = details.fir ? `FIR: ${details.fir}` : details.reason || details.case_type || '';
          html += `<div class="alert-card ${cls}">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span class="alert-title">${a.severity}: ${a.type}</span>
              <span style="font-size:10px;color:#64748b;">${a.time}s</span>
            </div>
            <div class="alert-plate">${a.plate}</div>
            <div class="alert-sub">${info}</div>
          </div>`;
        });
        document.getElementById('alerts-panel').innerHTML = html;
      }

      // Render plates
      if (data.plates && data.plates.length > 0) {
        const flaggedPlates = data.alerts.map(a => a.plate);
        let html = data.plates.map(p => {
          const flagged = flaggedPlates.includes(p) ? ' flagged' : '';
          return `<span class="plate-tag${flagged}">${p}</span>`;
        }).join('');
        document.getElementById('plates-list').innerHTML = html;
      }

      if (!data.processing && data.stats.frames > 0) {
        clearInterval(pollInterval);
      }
    })
    .catch(() => {});
}

async function processFace(input) {
  if (!input.files[0]) return;
  const formData = new FormData();
  formData.append('file', input.files[0]);
  document.getElementById('face-results').innerHTML = '<span style="color:#0891b2;">Processing face...</span>';
  try {
    const res = await fetch('/api/face/search', { method: 'POST', body: formData });
    const data = await res.json();
    let html = `<div>Faces detected: ${data.faces_detected || 0}</div>`;
    if (data.matches && data.matches.length > 0) {
      data.matches.forEach(m => {
        const col = m.severity === 'CRITICAL' ? '#ef4444' : '#f59e0b';
        html += `<div style="margin-top:6px;padding:8px;background:rgba(220,38,38,0.1);border-radius:8px;border-left:3px solid ${col};">
          <div style="font-weight:700;color:${col};">${m.severity}: ${m.matched_person}</div>
          <div style="font-size:10px;color:#94a3b8;">Confidence: ${m.confidence}%</div>
        </div>`;
      });
    } else {
      html += '<div style="color:#22c55e;margin-top:4px;">No matches found</div>';
    }
    document.getElementById('face-results').innerHTML = html;
  } catch(e) { document.getElementById('face-results').innerHTML = 'Error: ' + e.message; }
}

async function enrollFace(input) {
  if (!input.files[0]) return;
  const name = prompt('Enter name for wanted person:');
  if (!name) return;
  const formData = new FormData();
  formData.append('file', input.files[0]);
  formData.append('name', name);
  try {
    const res = await fetch('/api/face/enroll', { method: 'POST', body: formData });
    const data = await res.json();
    alert(data.message);
  } catch(e) { alert('Error: ' + e.message); }
}
</script>
</body>
</html>"""


@app.post("/api/upload-video")
async def upload_video(file: UploadFile = File(...)):
    """Upload video and prepare for streaming"""
    ext = Path(file.filename).suffix
    file_id = uuid.uuid4().hex[:10]
    save_path = str(UPLOADS_DIR / f"{file_id}{ext}")

    with open(save_path, "wb") as f:
        content = await file.read()
        f.write(content)

    video_state["current_file"] = save_path
    return {"file_id": file_id, "path": save_path}


@app.get("/api/video-stream/{file_id}")
async def video_stream(file_id: str):
    """Stream processed video frames as MJPEG"""
    video_path = video_state.get("current_file")
    if not video_path or not os.path.exists(video_path):
        return JSONResponse({"error": "No video uploaded"}, status_code=404)

    return StreamingResponse(
        generate_annotated_frames(video_path),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )


@app.get("/api/video-state")
async def get_video_state():
    """Get current processing state for polling"""
    return {
        "processing": video_state["processing"],
        "stats": video_state["stats"],
        "alerts": video_state["alerts"],
        "plates": list(video_state.get("all_plates", set())),
    }


@app.post("/api/anpr")
async def process_anpr(file: UploadFile = File(...)):
    ext = Path(file.filename).suffix
    save_path = str(UPLOADS_DIR / f"anpr_{uuid.uuid4().hex[:8]}{ext}")
    with open(save_path, "wb") as f:
        content = await file.read()
        f.write(content)
    result = engine.process_anpr(save_path)
    return JSONResponse(result)


@app.post("/api/face/search")
async def search_face(file: UploadFile = File(...)):
    ext = Path(file.filename).suffix
    save_path = str(UPLOADS_DIR / f"face_{uuid.uuid4().hex[:8]}{ext}")
    with open(save_path, "wb") as f:
        content = await file.read()
        f.write(content)
    result = engine.process_face(save_path)
    return JSONResponse(result)


@app.post("/api/face/enroll")
async def enroll_face(file: UploadFile = File(...), name: str = Form(...)):
    safe_name = name.replace(" ", "_").replace("/", "_")
    ext = Path(file.filename).suffix
    save_path = str(WANTED_PERSONS_DIR / f"{safe_name}{ext}")
    with open(save_path, "wb") as f:
        content = await file.read()
        f.write(content)
    count = engine.face.load_wanted_persons()
    return {"message": f"Enrolled '{name}'. Total wanted persons: {count}"}


@app.get("/api/test-db")
async def test_db_matching():
    test_plates = ["OD02AK7834", "OD21F9012", "MH12AB1234", "OD21C7890", "WB02X5678", "OD21A1111", "OD05M8901"]
    return {"results": [engine.anpr.match_plate(p) for p in test_plates]}


@app.get("/api/status")
async def system_status():
    return {
        "status": "operational",
        "models": {
            "yolov8_vehicle": engine.anpr.vehicle_model is not None,
            "plate_detector": engine.anpr.plate_model is not None,
            "easyocr": engine.anpr.ocr_engine is not None,
            "deepface": engine.face.model_loaded,
        },
        "databases": {
            "stolen_vehicles": len(engine.anpr.stolen_db),
            "case_linked": len(engine.anpr.case_linked_db),
            "watchlist": len(engine.anpr.watchlist),
            "wanted_persons": len(engine.face.wanted_persons),
        },
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

# AI-Powered CCTV Surveillance System - Kandhamal District Police

Phase 1 Working POC for AI-based CCTV surveillance covering 3 use cases:
1. **Stolen Vehicle Detection** (ANPR) - YOLOv8 + Plate Detector + EasyOCR + Database Match
2. **Case-Linked Vehicle Alert** - Same ANPR pipeline, matches against FIR/Warrant/Watchlist DB
3. **Face Recognition - Wanted Persons** - dlib 128-dim embeddings (CPU) / InsightFace (GPU)

**Acceptance Test: 25/25 criteria PASSED (100%)**

---

## Quick Start (5 minutes)

### Prerequisites

- Python 3.9+
- Node.js 18+ (for dashboard only)
- pip

### 1. Clone the repo

```bash
git clone https://github.com/saiesh2401/odisha-dist-cctv.git
cd odisha-dist-cctv
```

### 2. Install Python dependencies

```bash
pip install ultralytics easyocr face_recognition deepface fastapi uvicorn python-multipart pillow opencv-python-headless
```

### 3. Run the POC server

```bash
cd poc
python server.py
```

Open **http://localhost:8000** in your browser.

First run will auto-download:
- YOLOv8n model (6.2 MB) from Ultralytics
- EasyOCR models (~93 MB) from JaidedAI
- dlib face recognition model (~29 MB)

### 4. Download the plate detector model

```bash
# Clone the Video-ANPR repo to get the fine-tuned plate detector
git clone --depth 1 https://github.com/sveyek/Video-ANPR.git /tmp/video-anpr
cp /tmp/video-anpr/models/license_plate_detector.pt poc/models/
rm -rf /tmp/video-anpr
```

### 5. Test it

1. Open **http://localhost:8000**
2. Upload any traffic image/video - AI detects vehicles, reads plates, matches against DB
3. Click "Test Database Matching" - tests 7 plates against stolen/FIR/watchlist databases
4. Click "+ Enroll Face" - upload a face photo to add a wanted person
5. Click "Face Search" - upload another photo of the same person to verify match

---

## What Each Component Does

```
odisha-dist-cctv/
|
+-- poc/                          # Phase 1 Working POC (AI Engine)
|   +-- server.py                 # FastAPI server with video streaming UI
|   +-- engine.py                 # AI engine: ANPR + Face Recognition
|   +-- stolen_vehicles_db.json   # Sample stolen/case-linked/watchlist database
|   +-- generate_acceptance_report.py  # Runs all 25 acceptance tests
|   +-- models/                   # Place license_plate_detector.pt here
|   +-- wanted_persons/           # Place wanted person photos here (one per person)
|   +-- data/                     # Test images and videos go here
|   +-- results/                  # AI-generated evidence images saved here
|   +-- uploads/                  # Uploaded files stored here
|
+-- dashboard/                    # Next.js Command Center Dashboard
|   +-- app/                      # Next.js app router pages
|   +-- components/               # React components (Map, Cameras, Alerts, etc.)
|   +-- lib/                      # Mock data for dashboard demo
|   +-- public/                   # Kandhamal GeoJSON boundary
|
+-- DPR - AI CCTV Surveillance - Kandhamal District.md    # Detailed Project Report
+-- ARCHITECTURE - State of the Art Technical Design.md   # Validated tech architecture
+-- ACCEPTANCE_TEST_REPORT.md                             # 25/25 test results
+-- ACCEPTANCE_TEST_GAPS.md                               # Gap analysis
+-- AI CCTV Surveillance - Kandhamal DPR Presentation.pptx  # 13-slide PPT
+-- create_ppt.py                                         # PPT generator script
```

---

## POC Demo Guide

### UC-1 & UC-2: ANPR (Stolen Vehicle + Case-Linked Alert)

**With a traffic video:**
1. Download any CCTV traffic video (YouTube: "traffic camera footage")
2. Place it in `poc/data/`
3. Upload on http://localhost:8000
4. Watch real-time video with AI bounding boxes + alerts in sidebar

**With test images (included):**
```bash
# These are pre-made test images with Indian plates matching our stolen DB:
poc/data/demo_OD02AK7834.jpg  -> STOLEN VEHICLE alert
poc/data/demo_OD21C7890.jpg   -> CASE-LINKED alert
poc/data/demo_WB02X5678.jpg   -> CASE-LINKED + WATCHLIST alert
poc/data/demo_OD21A1111.jpg   -> WATCHLIST alert
poc/data/demo_OD05M8901.jpg   -> STOLEN VEHICLE alert
```

**Database contents:**
- 9 stolen vehicles
- 5 case-linked vehicles (with FIR numbers and IO names)
- 4 watchlist patterns (including out-of-state vehicle monitoring)

### UC-3: Face Recognition

**Enroll a wanted person:**
1. Click "+ Enroll Face" on the web UI
2. Enter a name (e.g., "Suspect Alpha")
3. Upload a clear face photo

**Search for a match:**
1. Click "Face Search"
2. Upload a different photo of the same person
3. Result shows: matched name, confidence %, severity level

**Using Kaggle FRS dataset (optional):**
```bash
# Download from Kaggle: "Face Recognition Sample Dataset"
# Place in poc/data/frs_samples/
# Run the enrollment script:
python -c "
from engine import SurveillanceEngine
engine = SurveillanceEngine()
engine.face.load_wanted_persons()
"
```

---

## Run the Acceptance Test

```bash
cd poc
python generate_acceptance_report.py
```

This runs all 25 success criteria tests and generates:
- `results/acceptance_test_report.json` - raw test data
- `ACCEPTANCE_TEST_REPORT.md` - formatted report for SP

---

## Run the Dashboard

```bash
cd dashboard
npm install
npm run dev
```

Open **http://localhost:3000** - Command Center with:
- Real Kandhamal district map (OpenStreetMap) with 39 camera markers
- Simulated live camera feeds with scan-line effect
- Real-time alert panel with severity filtering
- ANPR vehicle tracking log
- Analytics charts
- Maximizable map view

---

## AI Models Used

| Model | File | Size | Purpose | Accuracy |
|-------|------|------|---------|----------|
| YOLOv8n | yolov8n.pt | 6.2 MB | Vehicle detection | 96.2% mAP (COCO) |
| Plate Detector | license_plate_detector.pt | 6.0 MB | License plate localization | ~95% |
| EasyOCR CRAFT | craft_mlt_25k.pth | 79 MB | Text region detection | - |
| EasyOCR CRNN | english_g2.pth | 14 MB | Character recognition | 88% (Indian plates) |
| dlib face_recognition | shape_predictor + resnet | ~29 MB | 128-dim face embeddings | 99.38% (LFW) |

All models are open source. All inference runs locally (no cloud API calls).

---

## Production Architecture (Post-POC)

```
CCTV Control Room                    Cloud / On-Premise Server
(Existing PC + Hailo-8)              (RTX 4060 Ti GPU)

Frigate NVR (76 cameras)  -------->  InsightFace (99.7% accuracy)
+ Hailo-8 (26 TOPS)      OSWAN      FastAPI + PostgreSQL
+ YOLO11n detection       8 Mbps     Next.js Dashboard
+ EasyOCR (CLAHE)                    WhatsApp Cloud API
                                     Alert Engine
```

**Key upgrades from POC to production:**
- EasyOCR -> PaddleOCR fine-tuned on HSRP plates (88% -> 99%)
- dlib -> InsightFace/ArcFace on GPU (82% -> 99.7%)
- File upload -> Frigate NVR with 76 live RTSP cameras
- Browser UI -> WhatsApp alerts to SP's group

---

## Add a New Stolen Vehicle to Database

Edit `poc/stolen_vehicles_db.json`:

```json
{
  "stolen_vehicles": [
    ...existing entries...,
    {
      "plate": "OD21X9999",
      "normalized": "OD21X9999",
      "type": "Maruti Swift",
      "color": "Red",
      "fir": "500/2026",
      "ps": "Phulbani PS",
      "date": "2026-06-20",
      "owner": "New Entry"
    }
  ]
}
```

Restart the server. The new plate will be detected and trigger alerts immediately.

---

## Project Documents

| Document | Description |
|----------|------------|
| `DPR - AI CCTV Surveillance - Kandhamal District.md` | 18-section Detailed Project Report with validated architecture |
| `ARCHITECTURE - State of the Art Technical Design.md` | Fully benchmarked tech stack (Hailo-8, YOLO11, CompreFace, Frigate) |
| `ACCEPTANCE_TEST_REPORT.md` | 25/25 success criteria test results |
| `AI CCTV Surveillance - Kandhamal DPR Presentation.pptx` | 13-slide presentation for SP |

---

## License

Confidential - Starlight Data Solutions. For authorized use only.

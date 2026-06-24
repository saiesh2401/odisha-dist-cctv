# Acceptance Test — Gap Analysis & Action Plan

## Status: 18/24 criteria met, 6 gaps to close

## Gaps to Close

### GAP 1: Vehicle Tracking Across Cameras (UC-1)
- **Criteria:** Same vehicle tracked across >= 2 cameras
- **Current:** Not implemented
- **Fix:** Track plate across cameras with timestamp + location trail
- **Effort:** 1 day
- **How:** When same plate detected on different cameras, log both with timestamps.
  Show movement trail: "OD02AK7834: CAM-003 (10:23 AM) → CAM-007 (10:25 AM) → heading south"

### GAP 2: Report Generation (UC-1)
- **Criteria:** Report generated within 30 seconds
- **Current:** No PDF report
- **Fix:** Add PDF report generation with vehicle log, alerts, charts
- **Effort:** 1 day
- **How:** Python reportlab/weasyprint → PDF with alert summary, plate log, evidence images

### GAP 3: Alert Details — Camera Location (UC-2)
- **Criteria:** Must show Vehicle No, Case ID, Location
- **Current:** Shows plate + case type but not camera location name
- **Fix:** Add camera_name field to every alert
- **Effort:** 2 hours

### GAP 4: Face Recognition Accuracy (UC-3)
- **Criteria:** >= 90% in live CCTV
- **Current:** 81.8% with dlib
- **Fix options:**
  - Option A: Use InsightFace on RTX 4060 Ti (99.7% accuracy) — production solution
  - Option B: For POC demo, enroll with multiple photos per person (3-5 instead of 1) — boosts dlib to ~90%+
  - Option C: Use better enrollment photos (frontal, well-lit)
- **Effort:** Option B = 1 hour, Option A = needs GPU hardware

### GAP 5: Alert Details — Face Profile (UC-3)
- **Criteria:** Must show Face, Location, Profile (crime details)
- **Current:** Shows name + confidence only
- **Fix:** Add criminal profile to wanted persons DB (crime, warrant number, FIR)
- **Effort:** 3 hours

### GAP 6: Low Light & Side Angle Handling (UC-3)
- **Criteria:** Works in low light & side angle
- **Current:** dlib weak on side angles
- **Fix:**
  - For POC: Use CLAHE enhancement on face crops (already built for plates)
  - For production: InsightFace handles side angles natively
- **Effort:** 2 hours (CLAHE for faces)

## Timeline to Close All Gaps: 3 days

Day 1: Vehicle tracking + report generation + alert details
Day 2: Face recognition tuning + profile data + CLAHE for faces
Day 3: Integration testing + 8-hour stability test

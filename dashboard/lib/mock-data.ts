// Kandhamal District Camera Locations — spread across all major towns/blocks
export const cameras = [
  // Phulbani Town (District HQ) — 20 cameras
  { id: "CAM-001", name: "Main Road Junction", location: "Phulbani Town Center", lat: 20.4735, lng: 84.2294, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-002", name: "Bus Stand Gate", location: "Phulbani Bus Stand", lat: 20.4712, lng: 84.2310, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-003", name: "SP Office Road", location: "Phulbani, Near SP Office", lat: 20.4680, lng: 84.2340, status: "online" as const, type: "ANPR" as const, brand: "Hikvision" },
  { id: "CAM-004", name: "Market Complex", location: "Phulbani Market", lat: 20.4750, lng: 84.2260, status: "online" as const, type: "Motorized" as const, brand: "Hikvision" },
  { id: "CAM-005", name: "District Hospital Gate", location: "Phulbani DHH", lat: 20.4695, lng: 84.2280, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-006", name: "College Square", location: "Phulbani Degree College", lat: 20.4768, lng: 84.2318, status: "online" as const, type: "Motorized" as const, brand: "Hikvision" },
  { id: "CAM-007", name: "NH-59 Entry Point", location: "Phulbani NH-59 Entry", lat: 20.4800, lng: 84.2350, status: "online" as const, type: "ANPR" as const, brand: "Hikvision" },
  { id: "CAM-008", name: "Phulbani PS Gate", location: "Phulbani Police Station", lat: 20.4720, lng: 84.2275, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-009", name: "SBI ATM - Main Rd", location: "Phulbani SBI Branch", lat: 20.4738, lng: 84.2305, status: "online" as const, type: "Motorized" as const, brand: "Hikvision" },
  { id: "CAM-010", name: "Collector Office Gate", location: "Phulbani Collectorate", lat: 20.4690, lng: 84.2310, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },

  // Baliguda (Sub-division HQ) — 12 cameras
  { id: "CAM-011", name: "Baliguda Main Chowk", location: "Baliguda Town Center", lat: 20.1827, lng: 83.8876, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-012", name: "Baliguda Bus Stand", location: "Baliguda Bus Terminal", lat: 20.1850, lng: 83.8910, status: "online" as const, type: "ANPR" as const, brand: "Hikvision" },
  { id: "CAM-013", name: "Baliguda PS Gate", location: "Baliguda Police Station", lat: 20.1800, lng: 83.8850, status: "online" as const, type: "Motorized" as const, brand: "Hikvision" },
  { id: "CAM-014", name: "Baliguda Hospital Rd", location: "Baliguda CHC", lat: 20.1870, lng: 83.8830, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-015", name: "Baliguda NH Entry", location: "Baliguda NH Junction", lat: 20.1780, lng: 83.8940, status: "online" as const, type: "ANPR" as const, brand: "Hikvision" },

  // G. Udayagiri — 8 cameras
  { id: "CAM-016", name: "G.Udayagiri Main Rd", location: "G.Udayagiri Town", lat: 20.1240, lng: 84.0130, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-017", name: "G.Udayagiri PS", location: "G.Udayagiri Police Stn", lat: 20.1215, lng: 84.0155, status: "online" as const, type: "Motorized" as const, brand: "Hikvision" },
  { id: "CAM-018", name: "G.Udayagiri Market", location: "G.Udayagiri Haat", lat: 20.1260, lng: 84.0100, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-019", name: "G.Udayagiri NH Jn", location: "G.Udayagiri Highway", lat: 20.1190, lng: 84.0180, status: "online" as const, type: "ANPR" as const, brand: "Hikvision" },

  // Raikia — 6 cameras
  { id: "CAM-020", name: "Raikia Town Center", location: "Raikia Main Road", lat: 20.2590, lng: 84.1520, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-021", name: "Raikia PS Gate", location: "Raikia Police Station", lat: 20.2570, lng: 84.1545, status: "online" as const, type: "Motorized" as const, brand: "Hikvision" },
  { id: "CAM-022", name: "Raikia Bus Stand", location: "Raikia Bus Terminal", lat: 20.2610, lng: 84.1490, status: "offline" as const, type: "AI Bullet" as const, brand: "Dahua" },

  // Tikabali — 5 cameras
  { id: "CAM-023", name: "Tikabali Chowk", location: "Tikabali Town Center", lat: 20.3530, lng: 84.1680, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-024", name: "Tikabali PS", location: "Tikabali Police Station", lat: 20.3510, lng: 84.1710, status: "online" as const, type: "ANPR" as const, brand: "Hikvision" },

  // Daringbadi — 5 cameras
  { id: "CAM-025", name: "Daringbadi Main Rd", location: "Daringbadi Town", lat: 19.8540, lng: 84.0940, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-026", name: "Daringbadi PS", location: "Daringbadi Police Stn", lat: 19.8520, lng: 84.0970, status: "online" as const, type: "Motorized" as const, brand: "Hikvision" },
  { id: "CAM-027", name: "Daringbadi Entry", location: "Daringbadi Highway", lat: 19.8580, lng: 84.0900, status: "online" as const, type: "ANPR" as const, brand: "Hikvision" },

  // Tumudibandha — 4 cameras
  { id: "CAM-028", name: "Tumudibandha Center", location: "Tumudibandha Town", lat: 19.8940, lng: 83.7850, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-029", name: "Tumudibandha PS", location: "Tumudibandha Police Stn", lat: 19.8920, lng: 83.7880, status: "online" as const, type: "Motorized" as const, brand: "Hikvision" },

  // Kotagarh — 4 cameras
  { id: "CAM-030", name: "Kotagarh Main Rd", location: "Kotagarh Town", lat: 19.8080, lng: 83.9470, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-031", name: "Kotagarh PS", location: "Kotagarh Police Station", lat: 19.8060, lng: 83.9500, status: "offline" as const, type: "PTZ" as const, brand: "Hikvision" },

  // Khajuripada — 3 cameras
  { id: "CAM-032", name: "Khajuripada Chowk", location: "Khajuripada Town", lat: 20.4100, lng: 84.2850, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-033", name: "Khajuripada PS", location: "Khajuripada Police Stn", lat: 20.4080, lng: 84.2880, status: "online" as const, type: "Motorized" as const, brand: "Hikvision" },

  // K. Nuagaon — 3 cameras
  { id: "CAM-034", name: "K.Nuagaon Main Rd", location: "K.Nuagaon Town", lat: 20.1000, lng: 84.2300, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-035", name: "K.Nuagaon PS", location: "K.Nuagaon Police Stn", lat: 20.0980, lng: 84.2330, status: "online" as const, type: "ANPR" as const, brand: "Hikvision" },

  // Chakapad — 3 cameras
  { id: "CAM-036", name: "Chakapad Junction", location: "Chakapad Town", lat: 20.3150, lng: 84.0650, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },

  // Sarangagada area
  { id: "CAM-037", name: "Sarangagada Gate", location: "Sarangagada", lat: 20.5300, lng: 84.3500, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
  { id: "CAM-038", name: "Sarangagada NH", location: "Sarangagada Highway", lat: 20.5350, lng: 84.3550, status: "online" as const, type: "ANPR" as const, brand: "Hikvision" },

  // Brahmanigaon
  { id: "CAM-039", name: "Brahmanigaon Rd", location: "Brahmanigaon", lat: 20.5800, lng: 84.2700, status: "online" as const, type: "AI Bullet" as const, brand: "Dahua" },
];

export type Alert = {
  id: string;
  type: "stolen_vehicle" | "wanted_person" | "fight" | "helmet" | "crowd" | "tampering" | "seatbelt" | "triple_ride" | "wrong_way" | "missing_person";
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  camera: string;
  cameraId: string;
  timestamp: string;
  plateNumber?: string;
  matchConfidence?: number;
  image?: string;
};

export const recentAlerts: Alert[] = [
  {
    id: "ALT-001",
    type: "stolen_vehicle",
    severity: "critical",
    title: "STOLEN VEHICLE DETECTED",
    description: "OD-02-AK-7834 matched against stolen vehicle database. Vehicle reported stolen from Bhubaneswar on 15-Jun-2026. FIR No: 234/2026",
    camera: "NH-59 Entry Point",
    cameraId: "CAM-007",
    timestamp: "2026-06-19T10:23:45",
    plateNumber: "OD-02-AK-7834",
    matchConfidence: 97.3,
  },
  {
    id: "ALT-002",
    type: "wanted_person",
    severity: "critical",
    title: "WANTED PERSON IDENTIFIED",
    description: "Face match: Suspect Rajesh Kumar Behera (Warrant #KDM/2026/089). Wanted in connection with theft case. Confidence: 94.1%",
    camera: "Market Complex",
    cameraId: "CAM-004",
    timestamp: "2026-06-19T10:18:22",
    matchConfidence: 94.1,
  },
  {
    id: "ALT-003",
    type: "fight",
    severity: "high",
    title: "PHYSICAL ASSAULT DETECTED",
    description: "Aggressive body posture and rapid limb movement detected. Multiple individuals involved. Immediate response required.",
    camera: "Bus Stand Gate",
    cameraId: "CAM-002",
    timestamp: "2026-06-19T10:12:08",
  },
  {
    id: "ALT-004",
    type: "helmet",
    severity: "medium",
    title: "HELMET VIOLATION",
    description: "Two-wheeler rider without helmet detected. Plate: OD-21-B-3456. Auto-challan generated #HC-20260619-047.",
    camera: "Main Road Junction",
    cameraId: "CAM-001",
    timestamp: "2026-06-19T10:08:55",
    plateNumber: "OD-21-B-3456",
    matchConfidence: 96.5,
  },
  {
    id: "ALT-005",
    type: "crowd",
    severity: "high",
    title: "CROWD GATHERING ALERT",
    description: "Abnormal crowd density detected. Estimated 85+ persons gathering. Threshold exceeded by 35 persons.",
    camera: "College Square",
    cameraId: "CAM-006",
    timestamp: "2026-06-19T09:58:30",
  },
  {
    id: "ALT-006",
    type: "stolen_vehicle",
    severity: "critical",
    title: "CASE-LINKED VEHICLE SPOTTED",
    description: "OD-21-F-9012 linked to FIR #145/2026 (Robbery). Last seen heading towards Balliguda Road.",
    camera: "Balliguda Road Entry",
    cameraId: "CAM-011",
    timestamp: "2026-06-19T09:45:12",
    plateNumber: "OD-21-F-9012",
    matchConfidence: 99.1,
  },
  {
    id: "ALT-007",
    type: "triple_ride",
    severity: "medium",
    title: "TRIPLE RIDING DETECTED",
    description: "3 persons detected on two-wheeler. Plate: OD-21-C-7890. Auto-challan generated #TR-20260619-012.",
    camera: "SP Office Road",
    cameraId: "CAM-003",
    timestamp: "2026-06-19T09:32:45",
    plateNumber: "OD-21-C-7890",
  },
  {
    id: "ALT-008",
    type: "seatbelt",
    severity: "medium",
    title: "SEAT BELT VIOLATION",
    description: "Driver without seat belt detected. Plate: OD-05-J-2345. Auto-challan generated #SB-20260619-023.",
    camera: "NH-59 Entry Point",
    cameraId: "CAM-007",
    timestamp: "2026-06-19T09:15:20",
    plateNumber: "OD-05-J-2345",
  },
];

export const stolenVehicles = [
  { plate: "OD-02-AK-7834", type: "Hyundai i20", color: "White", fir: "234/2026", ps: "Saheed Nagar PS, BBSR", date: "15-Jun-2026", status: "detected" as const },
  { plate: "OD-21-F-9012", type: "Maruti Swift", color: "Red", fir: "145/2026", ps: "Phulbani PS", date: "12-Jun-2026", status: "detected" as const },
  { plate: "OD-33-H-4567", type: "Honda Activa", color: "Black", fir: "198/2026", ps: "Berhampur PS", date: "10-Jun-2026", status: "monitoring" as const },
  { plate: "OD-02-BK-1234", type: "TVS Apache", color: "Blue", fir: "267/2026", ps: "Nayapalli PS, BBSR", date: "17-Jun-2026", status: "monitoring" as const },
  { plate: "OD-05-M-8901", type: "Tata Nexon", color: "Grey", fir: "301/2026", ps: "Cuttack Town PS", date: "18-Jun-2026", status: "monitoring" as const },
];

export const wantedPersons = [
  { id: "WP-001", name: "Rajesh Kumar Behera", age: 34, crime: "Theft & Burglary", warrant: "KDM/2026/089", status: "detected" as const, lastSeen: "Market Complex, 10:18 AM", confidence: 94.1 },
  { id: "WP-002", name: "Sanjay Pradhan", age: 28, crime: "Robbery", warrant: "KDM/2026/076", status: "monitoring" as const, lastSeen: "-", confidence: 0 },
  { id: "WP-003", name: "Bikram Nayak", age: 41, crime: "Drug Trafficking", warrant: "KDM/2026/045", status: "monitoring" as const, lastSeen: "-", confidence: 0 },
  { id: "WP-004", name: "Dilip Sahu", age: 31, crime: "Chain Snatching", warrant: "KDM/2026/092", status: "monitoring" as const, lastSeen: "-", confidence: 0 },
];

export const vehicleLog = [
  { time: "10:23:45", plate: "OD-02-AK-7834", camera: "CAM-007", direction: "Inbound", type: "Car", flagged: true, reason: "Stolen Vehicle" },
  { time: "10:22:30", plate: "OD-21-D-5678", camera: "CAM-003", direction: "Outbound", type: "Bike", flagged: false, reason: "" },
  { time: "10:21:15", plate: "OD-21-B-3456", camera: "CAM-001", direction: "Inbound", type: "Bike", flagged: true, reason: "Helmet Violation" },
  { time: "10:20:02", plate: "OD-05-K-9012", camera: "CAM-007", direction: "Inbound", type: "Car", flagged: false, reason: "" },
  { time: "10:18:48", plate: "OD-21-C-7890", camera: "CAM-003", direction: "Outbound", type: "Bike", flagged: true, reason: "Triple Riding" },
  { time: "10:17:30", plate: "OD-33-L-3456", camera: "CAM-011", direction: "Inbound", type: "Truck", flagged: false, reason: "" },
  { time: "10:15:22", plate: "OD-21-A-1234", camera: "CAM-001", direction: "Outbound", type: "Car", flagged: false, reason: "" },
  { time: "10:13:45", plate: "WB-02-X-5678", camera: "CAM-007", direction: "Inbound", type: "Car", flagged: true, reason: "Out-of-State" },
  { time: "10:11:10", plate: "OD-21-F-9012", camera: "CAM-011", direction: "Inbound", type: "Car", flagged: true, reason: "Case-Linked" },
  { time: "10:08:55", plate: "OD-05-J-2345", camera: "CAM-007", direction: "Outbound", type: "Car", flagged: true, reason: "Seatbelt Violation" },
];

export const hourlyStats = [
  { hour: "06:00", vehicles: 45, alerts: 2, violations: 1 },
  { hour: "07:00", vehicles: 120, alerts: 5, violations: 3 },
  { hour: "08:00", vehicles: 280, alerts: 12, violations: 8 },
  { hour: "09:00", vehicles: 350, alerts: 18, violations: 11 },
  { hour: "10:00", vehicles: 310, alerts: 15, violations: 9 },
  { hour: "11:00", vehicles: 290, alerts: 8, violations: 6 },
  { hour: "12:00", vehicles: 250, alerts: 6, violations: 4 },
  { hour: "13:00", vehicles: 200, alerts: 4, violations: 3 },
  { hour: "14:00", vehicles: 270, alerts: 7, violations: 5 },
  { hour: "15:00", vehicles: 320, alerts: 10, violations: 7 },
  { hour: "16:00", vehicles: 380, alerts: 14, violations: 9 },
  { hour: "17:00", vehicles: 420, alerts: 19, violations: 12 },
  { hour: "18:00", vehicles: 390, alerts: 16, violations: 10 },
  { hour: "19:00", vehicles: 300, alerts: 9, violations: 6 },
  { hour: "20:00", vehicles: 180, alerts: 5, violations: 3 },
  { hour: "21:00", vehicles: 90, alerts: 3, violations: 2 },
];

export const alertTypeDistribution = [
  { name: "Helmet Violation", value: 34, color: "#f59e0b" },
  { name: "Stolen Vehicle", value: 8, color: "#ef4444" },
  { name: "Seatbelt", value: 22, color: "#3b82f6" },
  { name: "Triple Riding", value: 15, color: "#8b5cf6" },
  { name: "Wanted Person", value: 5, color: "#ec4899" },
  { name: "Fight Detection", value: 3, color: "#f97316" },
  { name: "Crowd Alert", value: 7, color: "#06b6d4" },
  { name: "Wrong Way", value: 6, color: "#10b981" },
];

// Kandhamal district GeoJSON boundary (simplified)
export const kandhamalGeoJSON = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { name: "Kandhamal District", state: "Odisha" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [83.9500, 20.1000],
          [84.0000, 20.0800],
          [84.1000, 20.0500],
          [84.2000, 20.0800],
          [84.3000, 20.1200],
          [84.4000, 20.1800],
          [84.4500, 20.2500],
          [84.5000, 20.3200],
          [84.5200, 20.4000],
          [84.5000, 20.4800],
          [84.4800, 20.5500],
          [84.4500, 20.6000],
          [84.4000, 20.6500],
          [84.3500, 20.6800],
          [84.2800, 20.7000],
          [84.2000, 20.6800],
          [84.1200, 20.6500],
          [84.0500, 20.6000],
          [84.0000, 20.5500],
          [83.9500, 20.5000],
          [83.9200, 20.4500],
          [83.9000, 20.3800],
          [83.9000, 20.3000],
          [83.9100, 20.2200],
          [83.9300, 20.1500],
          [83.9500, 20.1000],
        ]],
      },
    },
  ],
};

// Crime hotspot data across the district
export const crimeHotspots = [
  // Phulbani
  { lat: 20.4735, lng: 84.2294, intensity: 0.9, label: "Phulbani Town Center" },
  { lat: 20.4750, lng: 84.2260, intensity: 0.7, label: "Phulbani Market" },
  // Baliguda
  { lat: 20.1827, lng: 83.8876, intensity: 0.8, label: "Baliguda Town" },
  // G. Udayagiri
  { lat: 20.1240, lng: 84.0130, intensity: 0.6, label: "G. Udayagiri" },
  // Raikia
  { lat: 20.2590, lng: 84.1520, intensity: 0.5, label: "Raikia" },
  // Daringbadi
  { lat: 19.8540, lng: 84.0940, intensity: 0.4, label: "Daringbadi" },
  // Tumudibandha
  { lat: 19.8940, lng: 83.7850, intensity: 0.5, label: "Tumudibandha" },
  // Kotagarh
  { lat: 19.8080, lng: 83.9470, intensity: 0.3, label: "Kotagarh" },
  // Tikabali
  { lat: 20.3530, lng: 84.1680, intensity: 0.4, label: "Tikabali" },
];

export const phulbaniTownGeoJSON = {
  type: "FeatureCollection" as const,
  features: [
    {
      type: "Feature" as const,
      properties: { name: "Phulbani Town" },
      geometry: {
        type: "Polygon" as const,
        coordinates: [[
          [84.2150, 20.4600],
          [84.2450, 20.4600],
          [84.2450, 20.4850],
          [84.2150, 20.4850],
          [84.2150, 20.4600],
        ]],
      },
    },
  ],
};

"use client";

import { useEffect, useRef, useState } from "react";
import { cameras, crimeHotspots } from "@/lib/mock-data";
import { MapPin, Maximize2, Minimize2 } from "lucide-react";

export default function MapView() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [maximized, setMaximized] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;
    const container = mapRef.current;

    import("leaflet").then(async (L) => {
      if (!container || mapInstanceRef.current) return;
      if ((container as unknown as { _leaflet_id?: number })._leaflet_id != null) return;

      // Center on district (zoom out to show full district)
      const map = L.map(container, {
        center: [20.13, 84.08],
        zoom: 10,
        zoomControl: false,
        attributionControl: false,
      });

      L.control.zoom({ position: "bottomright" }).addTo(map);

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap',
      }).addTo(map);

      // Load real Kandhamal district boundary
      try {
        const res = await fetch("/kandhamal.geojson");
        const kandhamalGeoJSON = await res.json();
        const boundaryLayer = L.geoJSON(kandhamalGeoJSON as GeoJSON.FeatureCollection, {
          style: {
            color: "#0891b2",
            weight: 2.5,
            opacity: 0.7,
            fillColor: "#0891b2",
            fillOpacity: 0.05,
            dashArray: "8, 4",
          },
        }).addTo(map);
        // Fit map to the district boundary
        map.fitBounds(boundaryLayer.getBounds(), { padding: [20, 20] });
      } catch {
        // fallback: no boundary
      }

      // Crime hotspot circles
      crimeHotspots.forEach((spot) => {
        const color = spot.intensity > 0.7 ? "#dc2626" : spot.intensity > 0.5 ? "#d97706" : "#16a34a";
        L.circle([spot.lat, spot.lng], {
          radius: 2500 * spot.intensity,
          color: "transparent",
          fillColor: color,
          fillOpacity: 0.1,
        }).addTo(map);
        L.circle([spot.lat, spot.lng], {
          radius: 1000 * spot.intensity,
          color: "transparent",
          fillColor: color,
          fillOpacity: 0.18,
        }).addTo(map);
      });

      // Camera markers
      cameras.forEach((cam) => {
        const isOnline = cam.status === "online";
        const isANPR = cam.type === "ANPR";
        const markerColor = !isOnline ? "#dc2626" : isANPR ? "#d97706" : "#0891b2";
        const glowColor = !isOnline ? "220,38,38" : isANPR ? "217,119,6" : "8,145,178";

        const icon = L.divIcon({
          className: "custom-marker",
          html: `
            <div style="position:relative;width:26px;height:26px;cursor:pointer;">
              <div style="position:absolute;inset:-3px;border-radius:50%;background:rgba(${glowColor},0.12);${isOnline ? 'animation:ping 2.5s cubic-bezier(0,0,0.2,1) infinite;' : ''}"></div>
              <div style="position:absolute;inset:0;border-radius:50%;background:${markerColor};box-shadow:0 2px 8px rgba(${glowColor},0.3);display:flex;align-items:center;justify-content:center;border:2px solid white;">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
              </div>
            </div>
          `,
          iconSize: [26, 26],
          iconAnchor: [13, 13],
        });

        const marker = L.marker([cam.lat, cam.lng], { icon }).addTo(map);
        marker.bindPopup(`
          <div style="font-family:system-ui,-apple-system,sans-serif;min-width:200px;padding:2px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
              <span style="width:7px;height:7px;border-radius:50%;background:${isOnline ? '#16a34a' : '#dc2626'};box-shadow:0 0 4px ${isOnline ? 'rgba(22,163,106,0.3)' : 'rgba(220,38,38,0.3)'};"></span>
              <strong style="font-size:12px;color:#1e293b;letter-spacing:0.3px;">${cam.id}</strong>
              <span style="font-size:9px;padding:1px 6px;border-radius:6px;background:${isANPR ? '#fef3c7' : '#ecfeff'};color:${isANPR ? '#92400e' : '#155e75'};font-weight:700;border:1px solid ${isANPR ? '#fde68a' : '#a5f3fc'};">${cam.type}</span>
            </div>
            <p style="font-size:12px;margin:0;color:#334155;font-weight:600;">${cam.name}</p>
            <p style="font-size:10px;margin:3px 0 0;color:#94a3b8;">${cam.location}</p>
            <div style="margin-top:6px;padding-top:6px;border-top:1px solid #e2e8f0;display:flex;gap:12px;">
              <span style="font-size:9px;color:#94a3b8;">${cam.brand}</span>
              <span style="font-size:9px;color:${isOnline ? '#16a34a' : '#dc2626'};font-weight:600;">${cam.status.toUpperCase()}</span>
            </div>
          </div>
        `, { className: "custom-popup" });
      });

      const style = document.createElement("style");
      style.textContent = `
        @keyframes ping { 75%, 100% { transform: scale(2.2); opacity: 0; } }
        .custom-marker { background: none !important; border: none !important; }
        .custom-popup .leaflet-popup-content-wrapper {
          background: #ffffff;
          color: #1e293b;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 8px 30px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04);
        }
        .custom-popup .leaflet-popup-tip { background: #ffffff; }
        .custom-popup .leaflet-popup-close-button { color: #94a3b8; font-size: 16px; }
        .custom-popup .leaflet-popup-close-button:hover { color: #475569; }
        .leaflet-control-zoom a {
          background: #ffffff !important;
          color: #475569 !important;
          border-color: #e2e8f0 !important;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06) !important;
        }
        .leaflet-control-zoom a:hover {
          background: #f8fafc !important;
          color: #1e293b !important;
        }
      `;
      document.head.appendChild(style);

      mapInstanceRef.current = map;
      setLoaded(true);
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Invalidate map size when maximized/minimized
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 300);
    }
  }, [maximized]);

  return (
    <>
      {/* Backdrop when maximized */}
      {maximized && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998] transition-opacity"
          onClick={() => setMaximized(false)}
        />
      )}

      <div
        className={`glass-card flex flex-col overflow-hidden transition-all duration-300 ${
          maximized
            ? "fixed inset-4 z-[999] shadow-2xl"
            : "h-full"
        }`}
      >
        <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="p-1 rounded-lg bg-indigo-50 flex-shrink-0">
              <MapPin className="w-3 h-3 text-indigo-500" />
            </div>
            <h3 className="text-[11px] font-bold text-slate-800 truncate">Kandhamal District</h3>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="hidden sm:flex items-center gap-2 text-[8px] text-slate-400">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />AI</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-500" />ANPR</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" />Off</span>
            </div>
            <button
              onClick={() => setMaximized((m) => !m)}
              className="p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
              title={maximized ? "Minimize" : "Maximize"}
            >
              {maximized ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
        <div ref={mapRef} className="flex-1 min-h-[300px]" style={{ borderRadius: "0 0 16px 16px" }} />
      </div>
    </>
  );
}

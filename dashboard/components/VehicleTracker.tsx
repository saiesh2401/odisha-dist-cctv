"use client";

import { vehicleLog, stolenVehicles } from "@/lib/mock-data";
import { Search, AlertTriangle, Scan } from "lucide-react";
import { useState } from "react";

export default function VehicleTracker() {
  const [searchPlate, setSearchPlate] = useState("");
  const [activeTab, setActiveTab] = useState<"live" | "stolen">("live");

  return (
    <div className="glass-card flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-50">
              <Scan className="w-3.5 h-3.5 text-cyan-600" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 tracking-wide">ANPR & Vehicle Intelligence</h3>
          </div>
        </div>
        <div className="flex gap-1.5 mb-2.5">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
              activeTab === "live"
                ? "bg-cyan-50 text-cyan-700 border border-cyan-200"
                : "text-slate-400 hover:text-slate-600 border border-transparent"
            }`}
          >
            Live ANPR Log
          </button>
          <button
            onClick={() => setActiveTab("stolen")}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
              activeTab === "stolen"
                ? "bg-red-50 text-red-600 border border-red-200"
                : "text-slate-400 hover:text-slate-600 border border-transparent"
            }`}
          >
            Stolen / Watchlist
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search plate (e.g., OD-21-B-3456)"
            value={searchPlate}
            onChange={(e) => setSearchPlate(e.target.value.toUpperCase())}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-100 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "live" ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Plate</th>
                <th>Camera</th>
                <th>Dir</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicleLog
                .filter((v) => !searchPlate || v.plate.includes(searchPlate))
                .map((v, i) => (
                  <tr key={i} className={v.flagged ? "!bg-red-50/50" : ""}>
                    <td className="font-mono text-slate-400 text-[11px]">{v.time}</td>
                    <td>
                      <span className={`font-mono font-bold text-[11px] ${v.flagged ? "text-red-600" : "text-slate-700"}`}>
                        {v.plate}
                      </span>
                    </td>
                    <td className="text-slate-500 text-[11px]">{v.camera}</td>
                    <td>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                        v.direction === "Inbound"
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "bg-violet-50 text-violet-600 border border-violet-200"
                      }`}>
                        {v.direction === "Inbound" ? "IN" : "OUT"}
                      </span>
                    </td>
                    <td>
                      {v.flagged ? (
                        <span className="flex items-center gap-1 text-[9px] font-bold text-red-600">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          {v.reason}
                        </span>
                      ) : (
                        <span className="text-[9px] text-emerald-600 font-medium">Clear</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <div className="p-2.5 space-y-2">
            {stolenVehicles.map((v, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl border transition-all ${
                  v.status === "detected"
                    ? "border-red-200 bg-red-50/50"
                    : "border-slate-100 bg-slate-50/50 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-bold text-sm text-slate-800 tracking-wide">{v.plate}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                      v.status === "detected"
                        ? "bg-red-100 text-red-600 border-red-200 animate-pulse-alert"
                        : "bg-amber-50 text-amber-600 border-amber-200"
                    }`}
                  >
                    {v.status === "detected" ? "DETECTED" : "MONITORING"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px]">
                  <span className="text-slate-400">Vehicle:</span>
                  <span className="text-slate-600">{v.type} ({v.color})</span>
                  <span className="text-slate-400">FIR No:</span>
                  <span className="text-slate-600">{v.fir}</span>
                  <span className="text-slate-400">PS:</span>
                  <span className="text-slate-600 truncate">{v.ps}</span>
                  <span className="text-slate-400">Date:</span>
                  <span className="text-slate-600">{v.date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

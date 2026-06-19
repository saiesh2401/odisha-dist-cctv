"use client";

import { wantedPersons } from "@/lib/mock-data";
import { UserSearch, Upload, AlertTriangle } from "lucide-react";

export default function FaceRecognition() {
  return (
    <div className="glass-card flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-violet-50">
              <UserSearch className="w-3.5 h-3.5 text-violet-500" />
            </div>
            <h3 className="text-xs font-bold text-slate-800 tracking-wide">Face Recognition - Wanted Persons</h3>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet-50 text-violet-600 text-[11px] font-semibold hover:bg-violet-100 transition-colors border border-violet-200">
            <Upload className="w-3 h-3" />
            Upload Photo
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {wantedPersons.map((person) => (
          <div
            key={person.id}
            className={`p-3 rounded-xl border transition-all ${
              person.status === "detected"
                ? "border-red-200 bg-red-50/60 animate-pulse-alert"
                : "border-slate-100 bg-slate-50/50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-14 rounded-lg flex items-center justify-center text-lg font-bold ${
                person.status === "detected"
                  ? "bg-red-100 text-red-600 border border-red-200"
                  : "bg-slate-100 text-slate-400 border border-slate-200"
              }`}>
                {person.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-bold text-slate-800">{person.name}</span>
                  {person.status === "detected" ? (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-600 text-[10px] font-bold border border-red-200">
                      <AlertTriangle className="w-3 h-3" />
                      DETECTED
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold border border-slate-200">
                      SCANNING
                    </span>
                  )}
                </div>

                <div className="space-y-1 text-[11px]">
                  <div className="flex items-center gap-4">
                    <span className="text-slate-400">Age: <span className="text-slate-600">{person.age}</span></span>
                    <span className="text-slate-400">Warrant: <span className="text-cyan-700 font-mono font-semibold">{person.warrant}</span></span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-slate-400">Crime:</span>
                    <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 font-medium text-[10px] border border-amber-200">
                      {person.crime}
                    </span>
                  </div>
                  {person.status === "detected" && (
                    <div className="flex items-center gap-4 mt-1 pt-1 border-t border-slate-200">
                      <span className="text-emerald-600 font-semibold">{person.confidence}% Match</span>
                      <span className="text-slate-400">Last seen: {person.lastSeen}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100">
          <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Database Status</h4>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-lg font-bold text-slate-800">247</p>
              <p className="text-[10px] text-slate-400">Wanted Persons</p>
            </div>
            <div>
              <p className="text-lg font-bold text-violet-600">3</p>
              <p className="text-[10px] text-slate-400">Active Matches</p>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-600">76</p>
              <p className="text-[10px] text-slate-400">Cameras Scanning</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

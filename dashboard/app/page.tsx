"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import StatsBar from "@/components/StatsBar";
import AlertPanel from "@/components/AlertPanel";
import CameraGrid from "@/components/CameraGrid";
import VehicleTracker from "@/components/VehicleTracker";
import FaceRecognition from "@/components/FaceRecognition";
import AnalyticsCharts from "@/components/AnalyticsCharts";
import {
  LayoutDashboard,
  Camera,
  Car,
  UserSearch,
  BarChart3,
  Map,
  Activity,
} from "lucide-react";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

const tabs = [
  { id: "dashboard", label: "Command Center", icon: LayoutDashboard },
  { id: "cameras", label: "Camera Feeds", icon: Camera },
  { id: "vehicles", label: "ANPR & Vehicles", icon: Car },
  { id: "faces", label: "Face Recognition", icon: UserSearch },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "map", label: "District Map", icon: Map },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f8fafc]">
      <Header />

      <nav className="border-b border-slate-200 bg-white/90 backdrop-blur-xl px-5 py-1.5 flex items-center gap-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-tab flex items-center gap-2 ${activeTab === tab.id ? "active" : ""}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
        <div className="flex-1" />
        <div className="flex items-center gap-2 text-[10px] text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
          <Activity className="w-3 h-3 text-emerald-500" />
          <span>System: <span className="text-emerald-600 font-semibold">All Operational</span></span>
        </div>
      </nav>

      <main className="flex-1 overflow-hidden relative">
        {activeTab === "dashboard" && <DashboardView />}
        {activeTab === "cameras" && (
          <div className="h-full p-4"><CameraGrid /></div>
        )}
        {activeTab === "vehicles" && (
          <div className="h-full p-4 grid grid-cols-2 gap-4">
            <VehicleTracker />
            <MapView />
          </div>
        )}
        {activeTab === "faces" && (
          <div className="h-full p-4 grid grid-cols-2 gap-4">
            <FaceRecognition />
            <CameraGrid />
          </div>
        )}
        {activeTab === "analytics" && (
          <div className="h-full p-4 flex flex-col gap-3">
            <StatsBar />
            <div className="flex-1 min-h-0"><AnalyticsCharts /></div>
          </div>
        )}
        {activeTab === "map" && (
          <div className="h-full p-4"><MapView /></div>
        )}
      </main>
    </div>
  );
}

function DashboardView() {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <StatsBar />

      {/* Two-row layout */}
      <div className="flex-1 px-5 pb-4 flex flex-col gap-3 min-h-0 overflow-hidden">
        {/* Top row: Map + Camera Feeds */}
        <div className="flex-1 min-h-0 grid grid-cols-5 gap-3">
          <div className="col-span-2 min-h-0">
            <MapView />
          </div>
          <div className="col-span-3 min-h-0">
            <CameraGrid />
          </div>
        </div>

        {/* Bottom row: Vehicle Tracker + Alerts */}
        <div className="h-[280px] flex-shrink-0 grid grid-cols-5 gap-3">
          <div className="col-span-3 min-h-0">
            <VehicleTracker />
          </div>
          <div className="col-span-2 min-h-0">
            <AlertPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { hourlyStats, alertTypeDistribution } from "@/lib/mock-data";
import { BarChart3, TrendingUp } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, CartesianGrid,
} from "recharts";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload) return null;
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-lg">
      <p className="text-[11px] text-slate-500 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[11px] font-semibold" style={{ color: p.color }}>
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

export default function AnalyticsCharts() {
  return (
    <div className="grid grid-cols-3 gap-3 h-full">
      {/* Vehicle Traffic Trend */}
      <div className="glass-card p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-cyan-50">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-600" />
          </div>
          <h3 className="text-xs font-bold text-slate-800">Vehicle Traffic (Today)</h3>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourlyStats}>
              <defs>
                <linearGradient id="vehicleGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0891b2" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fill: "#94a3b8", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 9 }} axisLine={false} tickLine={false} width={30} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="vehicles" stroke="#0891b2" strokeWidth={2} fill="url(#vehicleGrad)" name="Vehicles" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts Over Time */}
      <div className="glass-card p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-amber-50">
            <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <h3 className="text-xs font-bold text-slate-800">Alerts & Violations (Today)</h3>
        </div>
        <div className="flex-1 min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="hour" tick={{ fill: "#94a3b8", fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 9 }} axisLine={false} tickLine={false} width={20} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="alerts" fill="#d97706" radius={[3, 3, 0, 0]} name="Alerts" />
              <Bar dataKey="violations" fill="#dc2626" radius={[3, 3, 0, 0]} name="Violations" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alert Type Distribution */}
      <div className="glass-card p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-3">
          <div className="p-1.5 rounded-lg bg-violet-50">
            <BarChart3 className="w-3.5 h-3.5 text-violet-500" />
          </div>
          <h3 className="text-xs font-bold text-slate-800">Alert Distribution</h3>
        </div>
        <div className="flex-1 min-h-0 flex items-center">
          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={alertTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius="45%"
                  outerRadius="80%"
                  paddingAngle={3}
                  dataKey="value"
                >
                  {alertTypeDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-1/2 space-y-1.5">
            {alertTypeDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                <span className="text-[10px] text-slate-500 truncate flex-1">{item.name}</span>
                <span className="text-[10px] text-slate-700 font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

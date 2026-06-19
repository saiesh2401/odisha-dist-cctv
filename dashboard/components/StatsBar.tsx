"use client";

import { Camera, Car, AlertTriangle, UserSearch, ShieldAlert, TrendingUp, ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

type StatItem = {
  label: string;
  value: number | string;
  total?: number;
  icon: typeof Camera;
  color: string;
  iconBg: string;
  increment?: boolean;
  isText?: boolean;
  change?: string;
};

const stats: StatItem[] = [
  { label: "Cameras Online", value: 73, total: 76, icon: Camera, color: "text-emerald-600", iconBg: "bg-emerald-50", change: "+2" },
  { label: "Vehicles Scanned", value: 4823, icon: Car, color: "text-cyan-600", iconBg: "bg-cyan-50", increment: true, change: "+127" },
  { label: "Active Alerts", value: 8, icon: AlertTriangle, color: "text-red-600", iconBg: "bg-red-50", change: "3 critical" },
  { label: "Face Matches", value: 3, icon: UserSearch, color: "text-violet-600", iconBg: "bg-violet-50", change: "1 new" },
  { label: "Violations Today", value: 47, icon: ShieldAlert, color: "text-amber-600", iconBg: "bg-amber-50", increment: true, change: "+12" },
  { label: "Threat Level", value: "MODERATE", icon: TrendingUp, color: "text-amber-600", iconBg: "bg-amber-50", isText: true, change: "Stable" },
];

export default function StatsBar() {
  const [values, setValues] = useState(stats.map((s) => s.value));

  useEffect(() => {
    const interval = setInterval(() => {
      setValues((prev) =>
        prev.map((v, i) => {
          if (stats[i].increment && typeof v === "number") {
            return v + Math.floor(Math.random() * 3) + 1;
          }
          return v;
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-6 gap-2.5 px-5 py-3">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        const displayValue = values[i];
        return (
          <div
            key={stat.label}
            className="stat-card animate-fade-up"
            style={{
              animationDelay: `${i * 60}ms`,
              animationFillMode: "forwards",
            }}
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className={`p-2 rounded-xl ${stat.iconBg}`}>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              {stat.total ? (
                <span className="text-[9px] text-slate-400 font-mono font-medium bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                  {typeof displayValue === "number" ? displayValue : 0}/{stat.total}
                </span>
              ) : stat.change ? (
                <span className="flex items-center gap-0.5 text-[9px] text-emerald-500 font-medium">
                  <ArrowUpRight className="w-2.5 h-2.5" />
                  {stat.change}
                </span>
              ) : null}
            </div>
            <p className={`text-[22px] font-extrabold ${stat.color} leading-none tracking-tight`}>
              {typeof displayValue === "number" ? displayValue.toLocaleString() : displayValue}
            </p>
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium tracking-wide">{stat.label}</p>
          </div>
        );
      })}
    </div>
  );
}

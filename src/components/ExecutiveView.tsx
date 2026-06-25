/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from "react";
import { FormARecord, FormBRecord, FORM_A_INDICATORS } from "../types";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle, 
  ShieldAlert, 
  School, 
  Apple, 
  BookOpen, 
  Sparkles 
} from "lucide-react";

interface ExecutiveViewProps {
  formAData: FormARecord[];
  formBData: FormBRecord[];
}

export default function ExecutiveView({ formAData, formBData }: ExecutiveViewProps) {
  
  // 1. Calculate Bento Stats
  const totalClasses = formAData.length;
  
  const overallAvg = useMemo(() => {
    if (totalClasses === 0) return 0;
    return Number((formAData.reduce((sum, r) => sum + r.average, 0) / totalClasses).toFixed(2));
  }, [formAData, totalClasses]);

  const overallAvgB = useMemo(() => {
    if (formBData.length === 0) return 0;
    return Number((formBData.reduce((sum, r) => sum + r.average, 0) / formBData.length).toFixed(2));
  }, [formBData]);

  // Find lowest average indicator across all classes in Form A
  const lowestIndicatorMeta = useMemo(() => {
    const indicatorSums: { [key: string]: { sum: number; count: number } } = {};
    FORM_A_INDICATORS.forEach(ind => {
      indicatorSums[ind.code] = { sum: 0, count: 0 };
    });

    formAData.forEach(r => {
      FORM_A_INDICATORS.forEach(ind => {
        const val = r[ind.code as keyof FormARecord] as number;
        if (typeof val === "number") {
          indicatorSums[ind.code].sum += val;
          indicatorSums[ind.code].count += 1;
        }
      });
    });

    let lowestCode = "";
    let lowestAvg = 100;

    Object.keys(indicatorSums).forEach(code => {
      const { sum, count } = indicatorSums[code];
      const avg = count > 0 ? sum / count : 100;
      if (avg < lowestAvg) {
        lowestAvg = avg;
        lowestCode = code;
      }
    });

    const meta = FORM_A_INDICATORS.find(ind => ind.code === lowestCode);
    return {
      code: lowestCode.toUpperCase(),
      label: meta?.label || "Unknown",
      average: Number(lowestAvg.toFixed(2))
    };
  }, [formAData]);

  // 2. Identify Traffic Light Warnings (Unsur Pelayanan below 85)
  const trafficLightAlerts = useMemo(() => {
    const alerts: {
      trainingName: string;
      indicatorCode: string;
      indicatorLabel: string;
      category: string;
      score: number;
      status: "CRITICAL" | "WARNING";
    }[] = [];

    formAData.forEach(r => {
      FORM_A_INDICATORS.forEach(ind => {
        const score = r[ind.code as keyof FormARecord] as number;
        if (typeof score === "number" && score < 85) {
          alerts.push({
            trainingName: r.name,
            indicatorCode: ind.code.toUpperCase(),
            indicatorLabel: ind.label,
            category: ind.category,
            score,
            status: score < 80 ? "CRITICAL" : "WARNING"
          });
        }
      });
    });

    // Sort lowest score first
    return alerts.sort((a, b) => a.score - b.score).slice(0, 8);
  }, [formAData]);

  // 3. Prepare monthly trend data (Jan - Aug 2026)
  const trendData = useMemo(() => {
    const months = [
      "Januari 2026",
      "Februari 2026",
      "Maret 2026",
      "April 2026",
      "Mei 2026",
      "Juni 2026",
      "Juli 2026",
      "Agustus 2026"
    ];

    return months.map(m => {
      const filteredA = formAData.filter(r => r.period === m);
      const filteredB = formBData.filter(r => r.period === m);

      const avgA = filteredA.length > 0 
        ? filteredA.reduce((sum, r) => sum + r.average, 0) / filteredA.length 
        : null;

      const avgB = filteredB.length > 0 
        ? filteredB.reduce((sum, r) => sum + r.average, 0) / filteredB.length 
        : null;

      return {
        name: m.split(" ")[0], // Just month name e.g. "Januari"
        "IKM Pelayanan (Form A)": avgA ? Number(avgA.toFixed(2)) : undefined,
        "Kemanfaatan (Form B)": avgB ? Number(avgB.toFixed(2)) : undefined
      };
    });
  }, [formAData, formBData]);

  return (
    <div className="space-y-6 text-slate-100 dark:text-slate-100">
      
      {/* Executive Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="text-xs font-mono font-semibold text-indigo-400 tracking-wide uppercase">
              Dashboard Eksekutif
            </span>
          </div>
          <h2 className="text-2xl font-sans font-bold text-white mt-1">
            Executive Monitoring & Evaluasi (Monev)
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Analisis kinerja cepat, tren bulanan, dan deteksi dini kelemahan unsur pelayanan.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700/50">
          <Sparkles className="h-4 w-4 text-indigo-400" />
          <span className="text-xs text-slate-300 font-medium">BPSDM Provinsi Jawa Timur</span>
        </div>
      </div>

      {/* Bento Grid Layout - Summary KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bento-card">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
            Total Angkatan Diklat
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-extrabold text-white">
              {totalClasses}
            </span>
            <span className="text-xs text-indigo-400 flex items-center gap-0.5 font-bold">
              <TrendingUp className="h-3 w-3" /> +100%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">
            Januari - Agustus 2026
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bento-card">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
            Rerata Indeks Kepuasan (Form A)
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-extrabold text-indigo-450 text-indigo-400">
              {typeof overallAvg === "number" ? overallAvg.toFixed(2) : overallAvg}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">
            Kategori Pelayanan Penyelenggaraan
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bento-card">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
            Rerata Kemanfaatan (Form B)
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-3xl font-mono font-extrabold text-emerald-400">
              {typeof overallAvgB === "number" ? overallAvgB.toFixed(2) : overallAvgB}
            </span>
            <span className="text-xs text-slate-500">/ 100</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 font-mono">
            Penyerapan & Kemanfaatan Materi
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bento-card">
          <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
            Kelemahan Utama Pelayanan
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-sm font-sans font-bold text-rose-400 truncate w-full" title={lowestIndicatorMeta.label}>
              {lowestIndicatorMeta.code}: {typeof lowestIndicatorMeta.average === "number" ? lowestIndicatorMeta.average.toFixed(2) : lowestIndicatorMeta.average}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 truncate font-mono" title={lowestIndicatorMeta.label}>
            {lowestIndicatorMeta.label}
          </p>
        </div>

      </div>

      {/* Main Analysis Section (Grid: 2 Columns Trend Chart, 1 Column Traffic Light) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Trend Chart (2 Columns) */}
        <div className="lg:col-span-2 bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-white">
              Tren Kualitas Diklat (Januari - Agustus 2026)
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Rata-rata perkembangan bulanan Indeks Kepuasan (Form A) dan Kemanfaatan Materi (Form B)
            </p>
          </div>

          <div className="h-[280px] w-full mt-6 text-slate-800">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <YAxis domain={[80, 98]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "12px", color: "#f8fafc" }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: "#f8fafc", paddingTop: 10 }} />
                <Line 
                  type="monotone" 
                  dataKey="IKM Pelayanan (Form A)" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  activeDot={{ r: 6 }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="Kemanfaatan (Form B)" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Traffic Light Warning Hub (1 Column) */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-md flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-400" />
              <h3 className="font-sans font-bold text-base text-white">
                Traffic Light Alerts (<span className="font-mono text-xs text-rose-400">&lt;85</span>)
              </h3>
            </div>
            <span className="text-[10px] bg-rose-950/80 text-rose-300 font-bold px-2 py-0.5 rounded-full border border-rose-900/30">
              {trafficLightAlerts.length} Temuan
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Unsur pelayanan yang dinilai di bawah standar dan butuh perhatian segera.
          </p>

          <div className="mt-4 flex-1 overflow-y-auto max-h-[280px] space-y-2 pr-1 custom-scrollbar">
            {trafficLightAlerts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-10 text-slate-550">
                <CheckCircle className="h-8 w-8 text-indigo-400 mb-2" />
                <p className="text-xs text-slate-400">Semua indikator prima (&ge;85)!</p>
              </div>
            ) : (
              trafficLightAlerts.map((alert, i) => (
                <div 
                  key={i}
                  className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                    alert.status === "CRITICAL"
                      ? "bg-rose-950/20 border-rose-900/40 hover:bg-rose-950/30"
                      : "bg-amber-950/20 border-amber-900/40 hover:bg-amber-950/30"
                  }`}
                >
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    alert.status === "CRITICAL" ? "bg-rose-900/20 text-rose-400" : "bg-amber-900/20 text-amber-400"
                  }`}>
                    <ShieldAlert className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono font-bold text-[10px] text-slate-300 uppercase tracking-wide">
                        {alert.indicatorCode} ({alert.category})
                      </span>
                      <span className={`font-mono font-bold text-xs px-1.5 py-0.2 rounded ${
                        alert.status === "CRITICAL" ? "bg-rose-900/40 text-rose-200" : "bg-amber-900/40 text-amber-200"
                      }`}>
                        {typeof alert.score === "number" ? alert.score.toFixed(2) : alert.score}
                      </span>
                    </div>
                    <p className="text-xs text-white font-semibold truncate mt-0.5" title={alert.trainingName}>
                      {alert.trainingName}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      Sub-Indikator: {alert.indicatorLabel}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from "react";
import { FormARecord, FormBRecord, FORM_A_INDICATORS } from "../types";
import { Trophy, Award, Lock, ExternalLink, Sparkles, BookOpen, TrendingUp, Filter, Check, Info, Layers } from "lucide-react";
import { motion } from "motion/react";
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

interface PublicViewProps {
  formAData: FormARecord[];
  formBData: FormBRecord[];
  darkMode?: boolean;
}

export default function PublicView({ formAData, formBData, darkMode = false }: PublicViewProps) {
  // State for U1-U28 detailed analysis
  const [selectedIndicator, setSelectedIndicator] = useState<string>("u1");
  const [activeCategory, setActiveCategory] = useState<string>("Semua");

  // 1. Calculate Average Scores per Diklat Type
  const diklatAverages = useMemo(() => {
    const types = ["PKN II", "PKP", "PKA", "Latsar Gol II", "Latsar Gol III", "PIP Pratama", "Lainnya"];
    return types.map((type) => {
      const filteredA = formAData.filter((r) => r.type === type);
      const filteredB = formBData.filter((r) => r.type === type);
      
      const avgA = filteredA.length > 0 
        ? filteredA.reduce((sum, r) => sum + r.average, 0) / filteredA.length 
        : 0;
      
      const avgB = filteredB.length > 0 
        ? filteredB.reduce((sum, r) => sum + r.average, 0) / filteredB.length 
        : 0;

      return {
        type,
        avgA: Number(avgA.toFixed(2)),
        avgB: Number(avgB.toFixed(2)),
        count: filteredA.length
      };
    });
  }, [formAData, formBData]);

  // 2. Top 5 Best Performing Diklat (Form A average)
  const top5Diklat = useMemo(() => {
    return [...formAData]
      .sort((a, b) => b.average - a.average)
      .slice(0, 5);
  }, [formAData]);

  // Total average for scorecard hero
  const totalAvg = useMemo(() => {
    if (formAData.length === 0) return 0;
    return Number((formAData.reduce((sum, r) => sum + r.average, 0) / formAData.length).toFixed(2));
  }, [formAData]);

  // Prepare monthly trend data (Jan - Aug 2026)
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

  const latestUploadDate = useMemo(() => {
    const maxId = formAData.reduce((max, r) => r.id > max ? r.id : max, 0);
    if (maxId > 10000000) {
      const date = new Date(maxId);
      const monthsIndo = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];
      const day = date.getDate();
      const month = monthsIndo[date.getMonth()];
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      return `${day} ${month} ${year} ${hours}:${minutes}`;
    }
    return "24 Juni 2026 19:25";
  }, [formAData]);

  // 3. Calculate Average Scores for each individual indicator (u1 - u28) across all Form A data
  const indicatorAverages = useMemo(() => {
    if (formAData.length === 0) return [];
    
    return FORM_A_INDICATORS.map((indicator) => {
      const key = indicator.code as keyof FormARecord;
      const values = formAData.map((r) => Number(r[key]) || 0);
      const sum = values.reduce((s, v) => s + v, 0);
      const avg = Number((sum / formAData.length).toFixed(2));
      
      // Determine letter grade and color classes based on requested ranges
      let grade = "D";
      let gradeColor = "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40";
      let gradeText = "Tidak Baik";
      if (avg >= 88.31) {
        grade = "A";
        gradeColor = "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/40";
        gradeText = "Sangat Baik";
      } else if (avg >= 76.61) {
        grade = "B";
        gradeColor = "text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-900/40";
        gradeText = "Baik";
      } else if (avg >= 65.00) {
        grade = "C";
        gradeColor = "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40";
        gradeText = "Kurang Baik";
      }
      
      return {
        ...indicator,
        avg,
        grade,
        gradeColor,
        gradeText
      };
    });
  }, [formAData]);

  // Filtered indicators based on active category
  const filteredIndicatorAverages = useMemo(() => {
    if (activeCategory === "Semua") return indicatorAverages;
    return indicatorAverages.filter(item => item.category === activeCategory);
  }, [indicatorAverages, activeCategory]);

  // Selected indicator meta details
  const selectedIndicatorMeta = useMemo(() => {
    return FORM_A_INDICATORS.find(ind => ind.code === selectedIndicator) || FORM_A_INDICATORS[0];
  }, [selectedIndicator]);

  // Monthly trend for the selected indicator (sajikan dalam trend tahunan/bulanan)
  const selectedIndicatorTrend = useMemo(() => {
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
    
    const key = selectedIndicator as keyof FormARecord;
    
    return months.map(m => {
      const filtered = formAData.filter(r => r.period === m);
      const avg = filtered.length > 0
        ? filtered.reduce((sum, r) => sum + (Number(r[key]) || 0), 0) / filtered.length
        : null;
        
      return {
        name: m.split(" ")[0], // "Januari", etc.
        "Rata-rata Skor": avg ? Number(avg.toFixed(2)) : undefined
      };
    });
  }, [formAData, selectedIndicator]);

  return (
    <div className="space-y-6 animate-fade-in text-slate-800 dark:text-slate-100">
      
      {/* Banner / Hero Section */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 border border-indigo-500/20 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 transform translate-x-12 -translate-y-12">
          <Award className="h-96 w-96 text-indigo-400" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-xs font-semibold tracking-wide uppercase mb-3 text-indigo-300">
            <Sparkles className="h-3 w-3 text-indigo-400" /> Transparansi Publik & Hasil Evaluasi
          </div>
          <h2 className="text-2xl md:text-3xl font-sans font-bold tracking-tight">
            Portal Informasi Kualitas Penyelenggaraan Diklat
          </h2>
          <p className="mt-2 text-slate-300 text-xs md:text-sm leading-relaxed">
            Selamat datang di portal informasi kinerja dan hasil evaluasi pelayanan BPSDM Provinsi Jawa Timur. 
            Data yang disajikan merupakan skor agregasi kepuasan peserta diklat periode terakhir data paling baru diupload.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs font-mono text-indigo-300 bg-indigo-950/40 border border-indigo-800/30 rounded-xl px-3.5 py-2 w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            <span>Update data terakhir tanggal: {latestUploadDate}</span>
          </div>
        </div>
      </div>

      {/* Bento Layout for Public View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Scorecard Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white">
                Rapor Kinerja per Jenis Pelatihan (Form A & B)
              </h3>
            </div>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold font-mono bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/30 px-2 py-0.5 rounded-full">
              {formAData.length} Program Terdaftar
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {diklatAverages.map((item) => (
              <motion.div 
                key={item.type}
                whileHover={{ scale: 1.01 }}
                className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
                      Jenis Diklat
                    </span>
                    <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white mt-1">
                      {item.type}
                    </h4>
                    <span className="inline-block text-[10px] text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 font-semibold px-2 py-0.5 rounded mt-2">
                      {item.count} Angkatan
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">IKM Layanan</span>
                    <span className="font-mono font-bold text-xl text-indigo-600 dark:text-indigo-400 block mt-1">
                      {item.avgA > 0 ? item.avgA.toFixed(2) : "N/A"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-slate-600 dark:text-slate-400">Skor Form B (Manfaat):</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100/30 dark:border-emerald-900/20 px-2 py-0.5 rounded font-bold">
                      {item.avgB > 0 ? item.avgB.toFixed(2) : "N/A"}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Skala 100</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Trend Kualitas Diklat Chart */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between mt-6">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-indigo-500" />
                <h3 className="font-sans font-bold text-base text-slate-900 dark:text-white">
                  Tren Kualitas Diklat (Januari - Agustus 2026)
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Perkembangan bulanan rata-rata Indeks Kepuasan Pelayanan (Form A) dan Kemanfaatan Materi (Form B)
              </p>
            </div>

            <div className="h-[280px] w-full mt-6 text-slate-800 dark:text-slate-200">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
                  <XAxis dataKey="name" stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 10 }} />
                  <YAxis domain={[80, 98]} stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: darkMode ? "#0f172a" : "#ffffff", 
                      border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0", 
                      borderRadius: "12px", 
                      color: darkMode ? "#f8fafc" : "#0f172a" 
                    }}
                    labelStyle={{ fontWeight: "bold" }}
                  />
                  <Legend wrapperStyle={{ fontSize: 11, color: darkMode ? "#f8fafc" : "#0f172a", paddingTop: 10 }} />
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
        </div>

        {/* Right 1 Column: Leaderboard & Limited Access Callout */}
        <div className="space-y-6">
          
          {/* Top 5 Leaderboard */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="h-5 w-5 text-amber-500" />
              <h3 className="font-sans font-bold text-sm text-slate-950 dark:text-white">
                Top 5 Program Terbaik
              </h3>
            </div>
            <div className="space-y-2.5">
              {top5Diklat.map((item, index) => {
                const medalColors = [
                  "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
                  "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300",
                  "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300",
                  "bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400",
                  "bg-slate-100 text-slate-600 dark:bg-slate-850 dark:text-slate-400"
                ];
                return (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950/50 rounded-xl border border-slate-150 dark:border-slate-850"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${medalColors[index] || "bg-slate-100 text-slate-600"}`}>
                        {index + 1}
                      </span>
                      <div className="min-w-0">
                        <h5 className="font-sans font-semibold text-xs text-slate-800 dark:text-slate-200 truncate" title={item.name}>
                          {item.name}
                        </h5>
                        <p className="text-[9px] text-slate-400 uppercase tracking-wide mt-0.5">
                          {item.type} • {item.period}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100/40 dark:border-indigo-900/20 px-2 py-1 rounded">
                      {typeof item.average === "number" ? item.average.toFixed(2) : item.average}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Detail Penilaian Unsur Pelayanan (U1 - U28) */}
      <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6">
        
        {/* Header and Grade Scale Explanations */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-500" />
              <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-white">
                Detail Indikator Kinerja Pelayanan (U1 - U28)
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Analisis komprehensif skor rata-rata dan tren bulanan dari 28 unsur pelayanan berdasarkan kuesioner evaluasi Form A peserta diklat BPSDM Jatim.
            </p>
          </div>

          {/* Rujukan Skala Nilai */}
          <div className="bg-white dark:bg-slate-950/80 border border-slate-150 dark:border-slate-850 rounded-2xl p-4 shadow-sm shrink-0">
            <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 dark:text-slate-500 mb-2.5 flex items-center gap-1">
              <Info className="h-3 w-3" /> Rujukan Skala Nilai
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="flex flex-col p-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 rounded-xl text-center">
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">A</span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">88,31 - 100,00</span>
                <span className="text-[8px] font-bold uppercase text-emerald-700 dark:text-emerald-500 mt-0.5">Sangat Baik</span>
              </div>
              <div className="flex flex-col p-2 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl text-center">
                <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">B</span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">76,61 - 88,30</span>
                <span className="text-[8px] font-bold uppercase text-indigo-700 dark:text-indigo-500 mt-0.5">Baik</span>
              </div>
              <div className="flex flex-col p-2 bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/30 rounded-xl text-center">
                <span className="text-xs font-black text-amber-600 dark:text-amber-400">C</span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">65,00 - 76,60</span>
                <span className="text-[8px] font-bold uppercase text-amber-700 dark:text-amber-500 mt-0.5">Kurang Baik</span>
              </div>
              <div className="flex flex-col p-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl text-center">
                <span className="text-xs font-black text-rose-600 dark:text-rose-400">D</span>
                <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5 font-mono">25,00 - 64,99</span>
                <span className="text-[8px] font-bold uppercase text-rose-700 dark:text-rose-500 mt-0.5">Tidak Baik</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Trend Chart for Selected Indicator */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold bg-indigo-600 text-white px-2.5 py-0.5 rounded-md uppercase font-mono">
                  {selectedIndicator.toUpperCase()}
                </span>
                <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white">
                  Kurva Tren Bulanan: {selectedIndicatorMeta.label}
                </h4>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Visualisasi kurva perkembangan skor bulanan untuk unsur pelayanan {selectedIndicator.toUpperCase()}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">Pilih Indikator:</span>
              <select
                value={selectedIndicator}
                onChange={(e) => setSelectedIndicator(e.target.value)}
                className="bg-slate-50 dark:bg-slate-950 border border-slate-250 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                {FORM_A_INDICATORS.map((ind) => (
                  <option key={ind.code} value={ind.code}>
                    {ind.code.toUpperCase()} - {ind.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="h-[280px] w-full mt-4 text-slate-800 dark:text-slate-200">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={selectedIndicatorTrend} margin={{ top: 10, right: 15, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1e293b" : "#f1f5f9"} />
                <XAxis dataKey="name" stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 10 }} />
                <YAxis domain={[80, 100]} stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{ fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: darkMode ? "#0f172a" : "#ffffff", 
                    border: darkMode ? "1px solid #334155" : "1px solid #e2e8f0", 
                    borderRadius: "12px", 
                    color: darkMode ? "#f8fafc" : "#0f172a" 
                  }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Rata-rata Skor" 
                  stroke="#6366f1" 
                  strokeWidth={3} 
                  activeDot={{ r: 6 }} 
                  name={`Rata-rata ${selectedIndicator.toUpperCase()}`}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Indicator Cards Area */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h4 className="font-sans font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-slate-400" /> Filter Kategori Unsur Pelayanan
            </h4>
            
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-250 dark:border-slate-850 w-fit">
              {["Semua", "Prosedur", "Sarana", "Pembelajaran", "Konsumsi"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    activeCategory === cat
                      ? "bg-white dark:bg-slate-850 text-indigo-600 dark:text-indigo-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of 28 Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredIndicatorAverages.map((item) => {
              const isSelected = selectedIndicator === item.code;
              return (
                <motion.div
                  key={item.code}
                  whileHover={{ y: -2, scale: 1.01 }}
                  onClick={() => setSelectedIndicator(item.code)}
                  className={`cursor-pointer rounded-2xl p-4 border transition-all relative overflow-hidden ${
                    isSelected 
                      ? "bg-indigo-50/40 dark:bg-indigo-950/20 border-indigo-500 shadow-md ring-1 ring-indigo-500/30" 
                      : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 shadow-xs"
                  }`}
                >
                  {/* Category mini pill */}
                  <div className="flex justify-between items-start gap-2">
                    <span className="font-mono text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      {item.code.toUpperCase()}
                    </span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded">
                      {item.category}
                    </span>
                  </div>

                  {/* Indicator Label */}
                  <h5 className="font-sans font-bold text-xs text-slate-800 dark:text-slate-200 mt-2.5 leading-snug min-h-[38px] line-clamp-2">
                    Penjelasan {item.code.toUpperCase()} : {item.label}
                  </h5>

                  {/* Divider */}
                  <div className="h-px bg-slate-100 dark:bg-slate-800 my-3" />

                  {/* Value and Letter grade */}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 uppercase block">Rata-rata Skor</span>
                      <span className="font-mono font-black text-base text-slate-900 dark:text-white mt-0.5 block">
                        {typeof item.avg === "number" ? item.avg.toFixed(2) : item.avg}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      <span className="text-[9px] text-slate-400 uppercase block">Predikat</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-md border mt-0.5 ${item.gradeColor}`}>
                        {item.grade} ({item.gradeText})
                      </span>
                    </div>
                  </div>

                  {/* Active highlight corner tick */}
                  {isSelected && (
                    <div className="absolute top-0 right-0 h-4 w-4 bg-indigo-500 rounded-bl flex items-center justify-center text-white">
                      <Check className="h-2.5 w-2.5 stroke-[4]" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

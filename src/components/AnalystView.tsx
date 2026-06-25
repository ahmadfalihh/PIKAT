/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { FormARecord, FormBRecord, FORM_A_INDICATORS } from "../types";
import { 
  ResponsiveContainer, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  Radar, 
  Legend, 
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { 
  Search, 
  Filter, 
  GitCompare, 
  FileText, 
  ChevronRight, 
  X, 
  Grid, 
  BarChart3, 
  TrendingUp, 
  Compass,
  AlertCircle,
  Trash2,
  CheckSquare,
  Square,
  CheckCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AnalystViewProps {
  formAData: FormARecord[];
  formBData: FormBRecord[];
  deleteRecords?: (idsToDelete: number[]) => void;
}

export default function AnalystView({ formAData, formBData, deleteRecords }: AnalystViewProps) {
  // Custom Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });

  // Custom Toast State
  const [toast, setToast] = useState<{
    show: boolean;
    message: string;
    type: "success" | "warning" | "info";
  }>({
    show: false,
    message: "",
    type: "info"
  });

  const showToast = (message: string, type: "success" | "warning" | "info" = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // State management
  const [search, setSearch] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("SEMUA");
  const [selectedType, setSelectedType] = useState("SEMUA");
  const [selectedRowsForCompare, setSelectedRowsForCompare] = useState<number[]>([]);
  const [activeDrilldownRow, setActiveDrilldownRow] = useState<FormARecord | null>(null);
  const [activeTab, setActiveTab] = useState<"table" | "charts" | "heatmap">("table");

  // Get unique months & types for filter options
  const monthOptions = useMemo(() => {
    const months = new Set(formAData.map(r => r.period));
    return ["SEMUA", ...Array.from(months)];
  }, [formAData]);

  const typeOptions = useMemo(() => {
    const types = new Set(formAData.map(r => r.type));
    return ["SEMUA", ...Array.from(types)];
  }, [formAData]);

  // Filtered dataset
  const filteredData = useMemo(() => {
    return formAData.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
      const matchMonth = selectedMonth === "SEMUA" || r.period === selectedMonth;
      const matchType = selectedType === "SEMUA" || r.type === selectedType;
      return matchSearch && matchMonth && matchType;
    });
  }, [formAData, search, selectedMonth, selectedType]);

  // Handle comparison/checklist selection (unlimited selection for delete, sliced to 4 for radar compare)
  const toggleRowCompare = (id: number) => {
    if (selectedRowsForCompare.includes(id)) {
      setSelectedRowsForCompare(selectedRowsForCompare.filter(rid => rid !== id));
    } else {
      setSelectedRowsForCompare([...selectedRowsForCompare, id]);
    }
  };

  // Check All / Select All
  const handleSelectAll = () => {
    const allFilteredIds = filteredData.map(r => r.id);
    setSelectedRowsForCompare(allFilteredIds);
  };

  // Uncheck All / Deselect All
  const handleDeselectAll = () => {
    setSelectedRowsForCompare([]);
  };

  // Delete single row with custom modal
  const handleDeleteSingle = (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Penghapusan",
      message: `Apakah Anda yakin ingin menghapus data pelatihan "${name}"? Tindakan ini akan menghapus seluruh rekapan Form A dan Form B terkait secara permanen dari database.`,
      onConfirm: () => {
        if (deleteRecords) {
          deleteRecords([id]);
          setSelectedRowsForCompare(prev => prev.filter(rid => rid !== id));
          if (activeDrilldownRow?.id === id) {
            setActiveDrilldownRow(null);
          }
          showToast(`Data pelatihan "${name}" berhasil dihapus`, "success");
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Delete all selected rows with custom modal
  const handleDeleteSelected = () => {
    if (selectedRowsForCompare.length === 0) return;
    
    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Hapus Terpilih",
      message: `Apakah Anda yakin ingin menghapus ${selectedRowsForCompare.length} data pelatihan terpilih? Seluruh data yang dicentang akan dihapus secara permanen dari database.`,
      onConfirm: () => {
        if (deleteRecords) {
          deleteRecords(selectedRowsForCompare);
          setSelectedRowsForCompare([]);
          if (selectedRowsForCompare.includes(activeDrilldownRow?.id || 0)) {
            setActiveDrilldownRow(null);
          }
          showToast(`${selectedRowsForCompare.length} data pelatihan berhasil dihapus`, "success");
        }
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Prepare radar chart comparison data
  const comparisonRadarData = useMemo(() => {
    if (selectedRowsForCompare.length < 2) return [];

    const categories = [
      { name: "Prosedur", keys: ["u1", "u2", "u3", "u4", "u24", "u25", "u26", "u27", "u28"] },
      { name: "Sarana", keys: ["u5", "u6", "u7", "u8", "u9", "u10", "u11", "u12", "u13", "u14"] },
      { name: "Pembelajaran", keys: ["u15", "u16", "u17", "u18", "u19"] },
      { name: "Konsumsi", keys: ["u20", "u21", "u22", "u23"] }
    ];

    const selectedRecords = selectedRowsForCompare.slice(0, 4).map(id => formAData.find(r => r.id === id)).filter(Boolean) as FormARecord[];

    return categories.map(cat => {
      const dataPoint: any = { subject: cat.name };
      selectedRecords.forEach(rec => {
        const sum = cat.keys.reduce((acc, key) => acc + (rec[key as keyof FormARecord] as number || 0), 0);
        const avg = sum / cat.keys.length;
        // Label using short class name
        const displayName = rec.name.replace("PELATIHAN DASAR (LATSAR) CPNS ", "Latsar ").replace("PELATIHAN KEPEMIMPINAN ", "PK ").slice(0, 20) + "...";
        dataPoint[displayName] = Number(avg.toFixed(2));
      });
      return dataPoint;
    });
  }, [selectedRowsForCompare, formAData]);

  // Top 10 rankings for horizontal bar chart
  const top10Rankings = useMemo(() => {
    return [...formAData]
      .sort((a, b) => b.average - a.average)
      .slice(0, 10)
      .map(r => ({
        name: r.name.replace("PELATIHAN DASAR (LATSAR) CPNS ", "Latsar ").replace("PELATIHAN KEPEMIMPINAN ", "PK ").slice(0, 20) + "...",
        "Nilai Rerata": r.average
      }));
  }, [formAData]);

  // Scatter plot dataset matching Form B (Manfaat U5 vs Penyerapan U6)
  const scatterData = useMemo(() => {
    return formBData.map(r => ({
      name: r.name,
      manfaat: r.u5,
      penyerapan: r.u6,
      size: 100
    }));
  }, [formBData]);

  // Heatmap helper for cell colors
  const getCellColor = (val: number) => {
    if (val >= 95) return "bg-emerald-900/90 text-emerald-100 hover:bg-emerald-800";
    if (val >= 90) return "bg-emerald-800/60 text-emerald-200 hover:bg-emerald-700/60";
    if (val >= 85) return "bg-yellow-800/40 text-amber-200 hover:bg-yellow-800/50";
    if (val >= 80) return "bg-amber-950/80 text-rose-200 hover:bg-amber-900";
    return "bg-rose-950/90 text-rose-100 hover:bg-rose-900";
  };

  const radarColors = ["#10b981", "#06b6d4", "#f59e0b", "#ec4899"];

  return (
    <div className="space-y-6 text-slate-100 dark:text-slate-100">
      
      {/* Tab Control */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
        <div>
          <h2 className="text-xl font-bold font-sans">Analyst & Comparative Hub</h2>
          <p className="text-xs text-slate-400 mt-0.5">Eksplorasi data, komparasi multi-angkatan, heatmap indikator, dan pemetaan kurikulum.</p>
        </div>
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("table")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "table" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="h-3.5 w-3.5" /> Data Tabel
          </button>
          <button
            onClick={() => setActiveTab("charts")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "charts" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" /> Diagram Analitik
          </button>
          <button
            onClick={() => setActiveTab("heatmap")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "heatmap" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            <Grid className="h-3.5 w-3.5" /> Heatmap Matriks
          </button>
        </div>
      </div>

      {/* RENDER TAB 1: DATA TABEL */}
      {activeTab === "table" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Table Panel (2 Columns) */}
          <div className="lg:col-span-2 space-y-4">
            
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Cari pelatihan BPSDM..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600 transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  {monthOptions.map(m => (
                    <option key={m} value={m}>{m === "SEMUA" ? "Semua Bulan" : m.split(" ")[0]}</option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  {typeOptions.map(t => (
                    <option key={t} value={t}>{t === "SEMUA" ? "Semua Jenis" : t}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Actions & Checklist Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900/40 p-3 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSelectAll}
                  disabled={filteredData.length === 0}
                  className="bg-slate-850 hover:bg-slate-750 disabled:opacity-40 text-slate-200 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-750 transition-colors flex items-center gap-1.5"
                >
                  <CheckSquare className="h-3 w-3 text-indigo-400" />
                  Centang Semua ({filteredData.length})
                </button>
                <button
                  onClick={handleDeselectAll}
                  disabled={selectedRowsForCompare.length === 0}
                  className="bg-slate-850 hover:bg-slate-750 disabled:opacity-40 text-slate-200 text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-slate-750 transition-colors flex items-center gap-1.5"
                >
                  <Square className="h-3 w-3 text-slate-400" />
                  Hapus Centang
                </button>
              </div>

              {deleteRecords && (
                <button
                  onClick={handleDeleteSelected}
                  disabled={selectedRowsForCompare.length === 0}
                  className="bg-rose-600/90 hover:bg-rose-500 disabled:opacity-40 disabled:bg-slate-850 disabled:text-slate-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 shadow-md border border-rose-500/20"
                >
                  <Trash2 className="h-3 w-3" />
                  Hapus Terpilih ({selectedRowsForCompare.length})
                </button>
              )}
            </div>

            {/* List & Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4 w-12 text-center">Pilih</th>
                      <th className="py-3 px-4">Nama Program / Angkatan</th>
                      <th className="py-3 px-4 text-center">Jenis</th>
                      <th className="py-3 px-4 text-center">Rerata A</th>
                      <th className="py-3 px-4 text-center">Detail</th>
                      {deleteRecords && <th className="py-3 px-4 text-center w-12">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={deleteRecords ? 6 : 5} className="py-8 text-center text-slate-500">
                          Data tidak ditemukan. Silakan sesuaikan pencarian Anda.
                        </td>
                      </tr>
                    ) : (
                      filteredData.map(r => (
                        <tr 
                          key={r.id} 
                          className="hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3 px-4 text-center">
                            <input
                              type="checkbox"
                              checked={selectedRowsForCompare.includes(r.id)}
                              onChange={() => toggleRowCompare(r.id)}
                              className="accent-indigo-600 rounded cursor-pointer"
                            />
                          </td>
                          <td className="py-3 px-4 font-medium max-w-xs md:max-w-md">
                            <div className="font-semibold text-white truncate" title={r.name}>{r.name}</div>
                            <div className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">{r.period}</div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full text-[10px]">
                              {r.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center font-mono font-bold text-indigo-400">
                            {typeof r.average === "number" ? r.average.toFixed(2) : r.average}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => setActiveDrilldownRow(r)}
                              className="p-1 hover:bg-indigo-600 hover:text-white rounded text-slate-400 transition-colors"
                              title="Tampilkan Detail Analitik"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </td>
                          {deleteRecords && (
                            <td className="py-3 px-4 text-center">
                              <button
                                onClick={() => handleDeleteSingle(r.id, r.name)}
                                className="text-slate-500 hover:text-rose-400 p-1 hover:bg-rose-950/30 rounded-lg transition-colors"
                                title="Hapus data ini"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Side Panel: Radar Compare or Row Drilldown (1 Column) */}
          <div className="space-y-6">
            
            {/* Comparer Hub Panel */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
              <div className="flex items-center gap-2 mb-3">
                <GitCompare className="h-5 w-5 text-indigo-400" />
                <h3 className="font-sans font-bold text-base text-white">Compare Tool ({selectedRowsForCompare.length}/4)</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Centang 2 sampai 4 program di tabel untuk membandingkan nilainya secara side-by-side pada Radar Chart di bawah ini.
              </p>

              {selectedRowsForCompare.length < 2 ? (
                <div className="py-12 border-2 border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-500">
                  <AlertCircle className="h-8 w-8 text-slate-600 mb-2" />
                  <p className="text-xs">Pilih minimal 2 program</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Radar Chart */}
                  <div className="h-[250px] w-full text-slate-800 bg-slate-950/40 rounded-xl p-2 border border-slate-800">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="70%" data={comparisonRadarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                        <PolarRadiusAxis angle={30} domain={[80, 100]} tick={{ fontSize: 8 }} stroke="#475569" />
                        {selectedRowsForCompare.slice(0, 4).map((id, idx) => {
                          const record = formAData.find(r => r.id === id);
                          if (!record) return null;
                          const displayName = record.name.replace("PELATIHAN DASAR (LATSAR) CPNS ", "Latsar ").replace("PELATIHAN KEPEMIMPINAN ", "PK ").slice(0, 20) + "...";
                          return (
                            <Radar
                              key={id}
                              name={displayName}
                              dataKey={displayName}
                              stroke={radarColors[idx]}
                              fill={radarColors[idx]}
                              fillOpacity={0.25}
                            />
                          );
                        })}
                        <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc" }} />
                        <Legend wrapperStyle={{ fontSize: 8, paddingTop: 10 }} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <button
                    onClick={() => setSelectedRowsForCompare([])}
                    className="w-full text-center bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs py-1.5 rounded-lg transition-colors"
                  >
                    Reset Perbandingan
                  </button>
                </div>
              )}
            </div>

            {/* Drilldown details slide-in */}
            <AnimatePresence>
              {activeDrilldownRow && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="bg-slate-900 border border-indigo-800/40 rounded-3xl p-5 shadow-2xl relative"
                >
                  <button
                    onClick={() => setActiveDrilldownRow(null)}
                    className="absolute right-4 top-4 p-1 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <h3 className="font-sans font-bold text-sm text-indigo-400 uppercase tracking-wide">
                    Detail Drill-Down Program
                  </h3>
                  <h4 className="font-sans font-bold text-base text-white mt-1 pr-6 leading-tight">
                    {activeDrilldownRow.name}
                  </h4>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-mono mt-0.5">
                    {activeDrilldownRow.type} • {activeDrilldownRow.period}
                  </p>

                  <div className="mt-5 space-y-4 text-xs">
                    
                    {/* Category A: Fasilitas */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <h5 className="font-semibold text-slate-200 flex justify-between">
                        <span>Sarana & Fasilitas (U5-U14)</span>
                        <span className="font-mono text-indigo-400">
                          {((activeDrilldownRow.u5 + activeDrilldownRow.u6 + activeDrilldownRow.u7 + activeDrilldownRow.u8 + activeDrilldownRow.u9 + activeDrilldownRow.u10 + activeDrilldownRow.u11 + activeDrilldownRow.u12 + activeDrilldownRow.u13 + activeDrilldownRow.u14) / 10).toFixed(2)}
                        </span>
                      </h5>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2.5 text-[11px] text-slate-400 border-t border-slate-800/60 pt-2">
                        <div className="flex justify-between">
                          <span>U5 Ketersediaan:</span>
                          <span className="font-mono text-slate-200">
                            {typeof activeDrilldownRow.u5 === "number" ? activeDrilldownRow.u5.toFixed(2) : activeDrilldownRow.u5}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>U6 Kualitas:</span>
                          <span className="font-mono text-slate-200">
                            {typeof activeDrilldownRow.u6 === "number" ? activeDrilldownRow.u6.toFixed(2) : activeDrilldownRow.u6}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>U7 Ketersediaan TI:</span>
                          <span className="font-mono text-slate-200">
                            {typeof activeDrilldownRow.u7 === "number" ? activeDrilldownRow.u7.toFixed(2) : activeDrilldownRow.u7}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>U14 Lingkungan:</span>
                          <span className="font-mono text-slate-200">
                            {typeof activeDrilldownRow.u14 === "number" ? activeDrilldownRow.u14.toFixed(2) : activeDrilldownRow.u14}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Category B: Konsumsi */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <h5 className="font-semibold text-slate-200 flex justify-between">
                        <span>Layanan Konsumsi (U20-U23)</span>
                        <span className="font-mono text-indigo-400">
                          {((activeDrilldownRow.u20 + activeDrilldownRow.u21 + activeDrilldownRow.u22 + activeDrilldownRow.u23) / 4).toFixed(2)}
                        </span>
                      </h5>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2.5 text-[11px] text-slate-400 border-t border-slate-800/60 pt-2">
                        <div className="flex justify-between">
                          <span>U20 Gizi Menu:</span>
                          <span className="font-mono text-slate-200">
                            {typeof activeDrilldownRow.u20 === "number" ? activeDrilldownRow.u20.toFixed(2) : activeDrilldownRow.u20}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>U21 Kecukupan:</span>
                          <span className="font-mono text-slate-200">
                            {typeof activeDrilldownRow.u21 === "number" ? activeDrilldownRow.u21.toFixed(2) : activeDrilldownRow.u21}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>U22 Kebersihan:</span>
                          <span className={`font-mono font-bold ${activeDrilldownRow.u22 < 85 ? "text-rose-400" : "text-slate-200"}`}>
                            {typeof activeDrilldownRow.u22 === "number" ? activeDrilldownRow.u22.toFixed(2) : activeDrilldownRow.u22}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>U23 Ketepatan:</span>
                          <span className="font-mono text-slate-200">
                            {typeof activeDrilldownRow.u23 === "number" ? activeDrilldownRow.u23.toFixed(2) : activeDrilldownRow.u23}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Category C: Pembelajaran */}
                    <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                      <h5 className="font-semibold text-slate-200 flex justify-between">
                        <span>Pembelajaran & Kurikulum (U15-U19)</span>
                        <span className="font-mono text-indigo-400">
                          {((activeDrilldownRow.u15 + activeDrilldownRow.u16 + activeDrilldownRow.u17 + activeDrilldownRow.u18 + activeDrilldownRow.u19) / 5).toFixed(2)}
                        </span>
                      </h5>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2.5 text-[11px] text-slate-400 border-t border-slate-800/60 pt-2">
                        <div className="flex justify-between">
                          <span>U15 Kejelasan:</span>
                          <span className="font-mono text-slate-200">
                            {typeof activeDrilldownRow.u15 === "number" ? activeDrilldownRow.u15.toFixed(2) : activeDrilldownRow.u15}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>U16 Bahan Ajar:</span>
                          <span className="font-mono text-slate-200">
                            {typeof activeDrilldownRow.u16 === "number" ? activeDrilldownRow.u16.toFixed(2) : activeDrilldownRow.u16}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>U17 Pemanfaatan TI:</span>
                          <span className="font-mono text-slate-200">
                            {typeof activeDrilldownRow.u17 === "number" ? activeDrilldownRow.u17.toFixed(2) : activeDrilldownRow.u17}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>U19 Kesesuaian:</span>
                          <span className="font-mono text-slate-200">
                            {typeof activeDrilldownRow.u19 === "number" ? activeDrilldownRow.u19.toFixed(2) : activeDrilldownRow.u19}
                          </span>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>
      )}

      {/* RENDER TAB 2: DIAGRAM ANALITIK */}
      {activeTab === "charts" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          
          {/* Top 10 Trainings ranking (Horizontal Bar Chart) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Compass className="h-5 w-5 text-indigo-400" />
                <h3 className="font-sans font-bold text-base text-white">Ranking 10 Besar Pelatihan</h3>
              </div>
              <p className="text-xs text-slate-400">Penyelenggaraan dengan nilai kepuasan (Form A) tertinggi, diurutkan dari atas ke bawah.</p>
            </div>

            <div className="h-[320px] w-full mt-6 text-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={top10Rankings} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" domain={[85, 100]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" stroke="#94a3b8" tick={{ fontSize: 9 }} width={120} />
                  <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc" }} />
                  <Bar dataKey="Nilai Rerata" fill="#6366f1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Form B: Manfaat vs Penyerapan (Scatter Plot) */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-5 w-5 text-indigo-400" />
                <h3 className="font-sans font-bold text-base text-white">Syllabus Effectiveness (Form B)</h3>
              </div>
              <p className="text-xs text-slate-400">Memetakan hubungan "Manfaat Materi" (Sumbu X) vs "Penyerapan Materi" (Sumbu Y).</p>
            </div>

            <div className="h-[320px] w-full mt-6 text-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 20, bottom: 10, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis type="number" dataKey="manfaat" name="Manfaat" unit="%" domain={[80, 100]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <YAxis type="number" dataKey="penyerapan" name="Penyerapan" unit="%" domain={[80, 100]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                  <ZAxis type="number" dataKey="size" range={[100, 100]} />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #334155", color: "#f8fafc" }} />
                  <Scatter name="Program Diklat" data={scatterData} fill="#06b6d4" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
            
            <div className="text-[11px] text-slate-500 text-center mt-2">
              Kanan-Atas menunjukkan silabus yang sangat bermanfaat dan mudah diserap dengan sempurna.
            </div>
          </div>

        </div>
      )}

      {/* RENDER TAB 3: HEATMAP MATRIKS */}
      {activeTab === "heatmap" && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl animate-fade-in space-y-4">
          <div>
            <h3 className="font-sans font-bold text-base text-white">Interactive Indicator Heatmap Table</h3>
            <p className="text-xs text-slate-400 mt-1">
              Baris mewakili angkatan pelatihan, Kolom mewakili 28 Indikator (U1-U28). 
              Warna cell berkisar dari <span className="text-emerald-400 font-semibold">Hijau Gelap (Sangat Tinggi &ge;95)</span> hingga <span className="text-rose-400 font-semibold">Merah/Pink (Rendah &lt;85)</span>.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 custom-scrollbar">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-950 border-b border-slate-800 text-[10px] font-mono text-slate-400">
                  <th className="py-2.5 px-3 text-left sticky left-0 bg-slate-950 z-20 w-44">Nama Pelatihan</th>
                  {FORM_A_INDICATORS.map(ind => (
                    <th 
                      key={ind.code} 
                      className="py-2.5 px-1.5 text-center w-10 border-l border-slate-800 hover:text-white"
                      title={`${ind.code.toUpperCase()}: ${ind.label}`}
                    >
                      {ind.code.toUpperCase()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {formAData.map(r => (
                  <tr key={r.id} className="border-b border-slate-900/60 text-[10px]">
                    <td className="py-2 px-3 font-semibold text-slate-300 sticky left-0 bg-slate-950 z-10 border-r border-slate-900 max-w-xs truncate" title={r.name}>
                      {r.name.replace("PELATIHAN DASAR (LATSAR) CPNS ", "").replace("PELATIHAN KEPEMIMPINAN ", "")}
                    </td>
                    {FORM_A_INDICATORS.map(ind => {
                      const val = r[ind.code as keyof FormARecord] as number;
                      const formattedVal = typeof val === "number" ? val.toFixed(2) : val;
                      return (
                        <td 
                          key={ind.code}
                          className={`py-2 px-1 text-center font-mono font-bold border-l border-slate-900 transition-colors ${getCellColor(val)}`}
                          title={`${r.name}\n${ind.code.toUpperCase()}: ${ind.label}\nSkor: ${formattedVal}`}
                        >
                          {formattedVal}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Color legend scale */}
          <div className="flex flex-wrap items-center justify-end gap-3 text-[11px] text-slate-400 pt-2 font-mono">
            <span>Skala Warna:</span>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-emerald-900 border border-emerald-700" />
              <span>&ge;95 (Sempurna)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-emerald-800/60 border border-emerald-600/40" />
              <span>90-94 (Sangat Baik)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-yellow-800/40 border border-yellow-600/40" />
              <span>85-89 (Cukup Baik)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-amber-950/80 border border-amber-900" />
              <span>80-84 (Di Bawah Harapan)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded bg-rose-950 border border-rose-800" />
              <span>&lt;80 (Kritis)</span>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-950/50 border border-rose-500/20 rounded-xl text-rose-400 shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-sans font-bold text-base text-white">{confirmModal.title}</h4>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{confirmModal.message}</p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-4 py-2 rounded-xl border border-slate-700 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-md shadow-rose-950/25"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-900 border border-indigo-500/30 rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-in slide-in-from-bottom-5 duration-300">
          <div className="p-1.5 bg-indigo-950/50 border border-indigo-500/20 rounded-lg text-indigo-400 shrink-0">
            <CheckCircle className="h-4 w-4" />
          </div>
          <p className="text-xs text-slate-250 font-sans font-semibold">{toast.message}</p>
        </div>
      )}

    </div>
  );
}

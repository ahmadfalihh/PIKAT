/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Role, FormARecord, FormBRecord, AuditLog } from "./types";
import { getInitialFormA, getInitialFormB } from "./data";
import Header from "./components/Header";
import PublicView from "./components/PublicView";
import ExecutiveView from "./components/ExecutiveView";
import AnalystView from "./components/AnalystView";
import OperatorView from "./components/OperatorView";
import ExecutiveLogin from "./components/ExecutiveLogin";
import { Sparkles, ArrowRight } from "lucide-react";

export default function App() {
  const [currentRole, setRole] = useState<Role>(Role.PUBLIC);
  const [formAData, setFormAData] = useState<FormARecord[]>(() => getInitialFormA());
  const [formBData, setFormBData] = useState<FormBRecord[]>(() => getInitialFormB());
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // Executive/Pimpinan Authentication State
  const [isExecutiveLoggedIn, setIsExecutiveLoggedIn] = useState<boolean>(false);
  const [executiveSubTab, setExecutiveSubTab] = useState<"dashboard" | "operator">("dashboard");

  // Initialize Audit Logs with default items
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { 
      id: "1", 
      user: "n33d2know@gmail.com", 
      action: "Menginisialisasi sistem Portal Informasi Kualitas Penyelenggaraan Diklat (PIKAT)", 
      timestamp: "2026-06-24T00:52:31-07:00" 
    },
    { 
      id: "2", 
      user: "Sistem", 
      action: "Sinkronisasi 25 rekapan hasil pelatihan (Form A dan Form B)", 
      timestamp: "2026-06-24T00:52:31-07:00" 
    },
  ]);

  // Contextual theme logic: All roles default to Dark Mode (malam / gelap)
  useEffect(() => {
    setDarkMode(true);
  }, [currentRole]);

  // Record adding handler to sync between operator and other dashboards
  const addRecord = (newA: FormARecord, newB: FormBRecord, logMessage: string) => {
    setFormAData((prev) => [newA, ...prev]);
    setFormBData((prev) => [newB, ...prev]);
    addAuditLog(logMessage);
  };

  const deleteRecords = (idsToDelete: number[]) => {
    setFormAData((prev) => prev.filter((r) => !idsToDelete.includes(r.id)));
    setFormBData((prev) => prev.filter((r) => !idsToDelete.includes(r.id)));
    addAuditLog(`Menghapus ${idsToDelete.length} data pelatihan dari database`, undefined, idsToDelete.length);
  };

  const addAuditLog = (action: string, fileName?: string, count?: number) => {
    const newLog: AuditLog = {
      id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      user: "n33d2know@gmail.com",
      action,
      timestamp: "2026-06-24T00:52:31-07:00",
      fileName,
      recordCount: count
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${
      darkMode 
        ? "bg-slate-950 text-slate-100 dark" 
        : "bg-slate-50 text-slate-800"
    }`}>
      
      {/* Header Bar */}
      <Header 
        currentRole={currentRole} 
        setRole={setRole} 
        darkMode={darkMode} 
        setDarkMode={setDarkMode} 
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Content Views Routing */}
        <div className="transition-all duration-300">
          {currentRole === Role.PUBLIC && (
            <PublicView formAData={formAData} formBData={formBData} darkMode={darkMode} />
          )}

          {currentRole === Role.EXECUTIVE && (
            !isExecutiveLoggedIn ? (
              <ExecutiveLogin onLoginSuccess={() => setIsExecutiveLoggedIn(true)} />
            ) : (
              <div className="space-y-6">
                {/* Sub-navigation to switch between Executive Dashboard and Operator Console */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
                    <h4 className="font-sans font-bold text-xs text-white uppercase tracking-wider">
                      Monev Portal &mdash; BPSDM Jatim
                    </h4>
                  </div>
                  
                  <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-850">
                    <button
                      id="exec-tab-dashboard"
                      onClick={() => setExecutiveSubTab("dashboard")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        executiveSubTab === "dashboard"
                          ? "bg-indigo-600 text-white shadow"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Dashboard Eksekutif
                    </button>
                    <button
                      id="exec-tab-operator"
                      onClick={() => setExecutiveSubTab("operator")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        executiveSubTab === "operator"
                          ? "bg-indigo-600 text-white shadow"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      Konsol Operator (Admin)
                    </button>
                  </div>

                  <button
                    onClick={() => {
                      setIsExecutiveLoggedIn(false);
                      setExecutiveSubTab("dashboard");
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-4 py-1.5 rounded-lg border border-rose-950/40 hover:bg-rose-950/20 transition-all text-center"
                  >
                    Keluar (Logout)
                  </button>
                </div>

                {executiveSubTab === "dashboard" ? (
                  <ExecutiveView formAData={formAData} formBData={formBData} />
                ) : (
                  <OperatorView 
                    formAData={formAData} 
                    addRecord={addRecord} 
                    deleteRecords={deleteRecords}
                    auditLogs={auditLogs} 
                    addAuditLog={addAuditLog} 
                  />
                )}
              </div>
            )
          )}

          {currentRole === Role.ANALYST && (
            <AnalystView formAData={formAData} formBData={formBData} deleteRecords={deleteRecords} />
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className={`border-t py-6 text-center text-xs mt-12 transition-colors ${
        darkMode ? "bg-slate-950 border-slate-900 text-slate-500" : "bg-white border-slate-200 text-slate-400"
      }`}>
        <p>© 2026 Badan Pengembangan Sumber Daya Manusia (BPSDM) Provinsi Jawa Timur. Hak Cipta Dilindungi.</p>
        <p className="mt-1 font-mono text-[10px]">Portal Informasi Kualitas Penyelenggaraan Diklat (PIKAT) • Terverifikasi Komite Akreditasi Kinerja Aparatur</p>
      </footer>

    </div>
  );
}

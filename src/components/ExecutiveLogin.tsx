/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Lock, User, Eye, EyeOff, AlertCircle, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface ExecutiveLoginProps {
  onLoginSuccess: () => void;
}

export default function ExecutiveLogin({ onLoginSuccess }: ExecutiveLoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi.");
      return;
    }

    setIsLoading(true);

    // Simulate database lookup/validation
    setTimeout(() => {
      if (username === "ppk123" && password === "admin") {
        onLoginSuccess();
      } else {
        setError("Kredensial salah! Silakan periksa kembali username & password.");
        setIsLoading(false);
      }
    }, 600);
  };

  const handleAutofill = () => {
    setUsername("ppk123");
    setPassword("admin");
    setError("");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-md mx-auto my-8 bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden text-slate-100"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />
      
      <div className="flex flex-col items-center text-center mb-6">
        <div className="h-12 w-12 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 mb-4 shadow-inner">
          <Lock className="h-5 w-5" />
        </div>
        <h3 className="font-sans font-extrabold text-xl text-white tracking-tight">
          Login Area Pimpinan & Admin
        </h3>
        <p className="text-xs text-slate-400 mt-1.5 max-w-sm">
          Akses terbatas ke Executive Monitoring & Evaluasi (Monev) serta Konsol Operator BPSDM Jatim.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-rose-950/40 border border-rose-850/50 p-3.5 rounded-xl text-rose-300 text-xs flex items-start gap-2"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{error}</span>
          </motion.div>
        )}

        <div>
          <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
            Username
          </label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Masukkan username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-9 pr-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Password
            </label>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-850 rounded-xl py-2 pl-3 pr-9 text-xs text-slate-200 focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 focus:outline-none"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-lg active:scale-[0.99] disabled:opacity-50 mt-6"
        >
          {isLoading ? (
            <span className="flex items-center gap-1.5">
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Memverifikasi Kredensial...
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4" /> Masuk ke Dashboard Terpadu
            </span>
          )}
        </button>
      </form>
    </motion.div>
  );
}

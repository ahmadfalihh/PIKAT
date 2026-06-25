/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Role } from "../types";
import { 
  ShieldCheck, 
  TrendingUp, 
  BarChart2, 
  Database, 
  Clock, 
  Sun, 
  Moon 
} from "lucide-react";

interface HeaderProps {
  currentRole: Role;
  setRole: (role: Role) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Header({ currentRole, setRole, darkMode, setDarkMode }: HeaderProps) {
  return (
    <header className={`border-b transition-colors duration-300 ${
      darkMode 
        ? "bg-slate-900 border-slate-800 text-white" 
        : "bg-white border-slate-200 text-slate-900"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md font-bold tracking-wider text-lg">
              P
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sans font-bold tracking-tight text-lg md:text-xl">
                  PIKAT <span className="text-indigo-500 dark:text-indigo-400 font-light">/ Portal Utama</span>
                </h1>
                <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded dark:bg-indigo-950 dark:text-indigo-300 uppercase tracking-wider">
                  v2.4
                </span>
              </div>
              <p className={`text-[10px] uppercase tracking-wider ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Portal Informasi Kualitas Penyelenggaraan Diklat
              </p>
            </div>
          </div>

          {/* Role Switching Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800">
            {Object.values(Role).map((role) => {
              const isActive = currentRole === role;
              let Icon = ShieldCheck;
              if (role === Role.EXECUTIVE) Icon = TrendingUp;
              if (role === Role.ANALYST) Icon = BarChart2;

              return (
                <button
                  key={role}
                  id={`role-btn-${role.replace(/\s+/g, "").toLowerCase()}`}
                  onClick={() => setRole(role)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{role === Role.EXECUTIVE ? "LOGIN" : role}</span>
                </button>
              );
            })}
          </div>

          {/* Theme Switcher & Clock */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
              darkMode ? "bg-slate-900 text-slate-300 border border-slate-800" : "bg-slate-50 text-slate-600 border border-slate-200"
            }`}>
              <Clock className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
              <span>2026-06-24 01:02:40 UTC</span>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg border transition-all ${
                darkMode
                  ? "bg-slate-900 border-slate-800 hover:bg-slate-800 text-amber-400 shadow-inner"
                  : "bg-indigo-50 border-indigo-200 hover:bg-indigo-100 hover:border-indigo-300 text-indigo-600 shadow-sm"
              }`}
              title="Toggle Tema Visual"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}

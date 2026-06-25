/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormARecord, FormBRecord } from "./types";

// Raw representative rows for Form A
export const RAW_FORM_A: Omit<FormARecord, "average">[] = [
  {
    id: 1,
    name: "PELATIHAN KEPEMIMPINAN NASIONAL TK. II ANGKATAN II - KELAS A",
    type: "PKN II",
    u1: 89.69, u2: 90.18, u3: 92.83, u4: 92.60, u5: 89.60, u6: 86.80, u7: 92.00, u8: 92.00, u9: 90.02, u10: 89.80, u11: 93.20, u12: 88.40, u13: 93.00, u14: 92.40, u15: 91.40, u16: 91.20, u17: 91.80, u18: 91.00, u19: 90.75, u20: 87.50, u21: 90.50, u22: 90.50, u23: 91.75, u24: 91.25, u25: 89.25, u26: 92.50, u27: 92.75, u28: 91.75,
    period: "Februari 2026"
  },
  {
    id: 2,
    name: "PELATIHAN KEPEMIMPINAN NASIONAL TK. II ANGKATAN II - KELAS B",
    type: "PKN II",
    u1: 95.50, u2: 96.75, u3: 90.00, u4: 91.00, u5: 95.50, u6: 93.50, u7: 93.50, u8: 93.00, u9: 90.50, u10: 90.50, u11: 92.00, u12: 91.50, u13: 95.00, u14: 93.00, u15: 94.00, u16: 90.50, u17: 93.00, u18: 92.50, u19: 92.50, u20: 90.50, u21: 92.00, u22: 92.50, u23: 92.50, u24: 92.50, u25: 93.50, u26: 93.00, u27: 93.50, u28: 93.50,
    period: "Februari 2026"
  },
  {
    id: 3,
    name: "PELATIHAN KEPEMIMPINAN PENGAWAS (PKP) ANGKATAN I",
    type: "PKP",
    u1: 91.81, u2: 91.83, u3: 92.35, u4: 91.80, u5: 90.89, u6: 91.34, u7: 93.26, u8: 93.18, u9: 89.49, u10: 90.06, u11: 90.99, u12: 89.25, u13: 93.43, u14: 93.51, u15: 93.17, u16: 93.49, u17: 93.04, u18: 92.57, u19: 93.17, u20: 91.74, u21: 92.35, u22: 92.47, u23: 92.03, u24: 93.69, u25: 93.09, u26: 93.93, u27: 91.21, u28: 93.46,
    period: "Maret 2026"
  },
  {
    id: 4,
    name: "PELATIHAN KEPEMIMPINAN PENGAWAS (PKP) ANGKATAN II",
    type: "PKP",
    u1: 89.84, u2: 89.33, u3: 89.79, u4: 89.58, u5: 88.37, u6: 87.54, u7: 89.60, u8: 89.61, u9: 89.29, u10: 89.28, u11: 91.86, u12: 90.66, u13: 92.98, u14: 92.78, u15: 92.30, u16: 92.41, u17: 92.54, u18: 92.13, u19: 92.61, u20: 90.52, u21: 90.55, u22: 90.80, u23: 91.34, u24: 92.01, u25: 92.58, u26: 91.69, u27: 92.06, u28: 91.56,
    period: "Maret 2026"
  },
  {
    id: 5,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN II ANGKATAN I",
    type: "Latsar Gol II",
    u1: 90.09, u2: 87.50, u3: 88.34, u4: 88.56, u5: 88.25, u6: 87.82, u7: 85.81, u8: 86.34, u9: 86.41, u10: 86.60, u11: 87.63, u12: 86.06, u13: 89.68, u14: 89.68, u15: 87.65, u16: 88.55, u17: 89.13, u18: 88.68, u19: 86.97, u20: 89.87, u21: 90.52, u22: 89.84, u23: 90.97, u24: 89.94, u25: 89.90, u26: 88.48, u27: 89.68, u28: 87.97,
    period: "Januari 2026"
  },
  {
    id: 6,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN II ANGKATAN II",
    type: "Latsar Gol II",
    u1: 89.20, u2: 87.59, u3: 89.12, u4: 87.15, u5: 86.79, u6: 86.43, u7: 85.47, u8: 83.05, u9: 88.35, u10: 88.57, u11: 87.71, u12: 86.76, u13: 88.44, u14: 88.75, u15: 88.55, u16: 88.55, u17: 88.08, u18: 88.05, u19: 88.90, u20: 87.71, u21: 88.21, u22: 88.95, u23: 89.72, u24: 89.94, u25: 88.53, u26: 87.99, u27: 89.19, u28: 88.78,
    period: "Januari 2026"
  },
  {
    id: 7,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN I",
    type: "Latsar Gol III",
    u1: 89.35, u2: 88.53, u3: 89.33, u4: 88.75, u5: 89.90, u6: 87.74, u7: 86.97, u8: 87.51, u9: 87.62, u10: 87.92, u11: 88.49, u12: 89.79, u13: 91.64, u14: 90.44, u15: 87.00, u16: 89.58, u17: 91.09, u18: 88.23, u19: 89.36, u20: 90.98, u21: 91.60, u22: 90.46, u23: 91.99, u24: 91.20, u25: 90.85, u26: 91.08, u27: 91.08, u28: 89.90,
    period: "Februari 2026"
  },
  {
    id: 8,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN II",
    type: "Latsar Gol III",
    u1: 89.22, u2: 89.00, u3: 90.19, u4: 88.16, u5: 88.41, u6: 87.57, u7: 85.42, u8: 86.14, u9: 87.36, u10: 87.78, u11: 87.42, u12: 87.36, u13: 88.81, u14: 88.78, u15: 87.92, u16: 90.20, u17: 89.06, u18: 89.31, u19: 90.14, u20: 88.50, u21: 88.78, u22: 90.03, u23: 90.86, u24: 90.17, u25: 88.89, u26: 87.70, u27: 88.73, u28: 88.42,
    period: "Februari 2026"
  },
  {
    id: 9,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN VIII",
    type: "Latsar Gol III",
    u1: 92.30, u2: 91.03, u3: 90.28, u4: 89.70, u5: 92.25, u6: 91.70, u7: 88.75, u8: 88.55, u9: 88.08, u10: 87.15, u11: 87.73, u12: 88.55, u13: 85.10, u14: 90.59, u15: 90.75, u16: 90.53, u17: 89.68, u18: 90.83, u19: 90.25, u20: 91.53, u21: 93.00, u22: 92.20, u23: 94.03, u24: 91.98, u25: 92.45, u26: 92.58, u27: 92.53, u28: 92.58,
    period: "Maret 2026"
  },
  {
    id: 10,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN IX",
    type: "Latsar Gol III",
    u1: 90.70, u2: 89.45, u3: 90.58, u4: 90.33, u5: 90.53, u6: 89.43, u7: 87.43, u8: 87.78, u9: 86.05, u10: 85.75, u11: 87.85, u12: 85.53, u13: 84.95, u14: 89.45, u15: 89.93, u16: 90.43, u17: 89.40, u18: 90.28, u19: 90.03, u20: 89.68, u21: 89.93, u22: 90.45, u23: 92.28, u24: 91.95, u25: 91.10, u26: 90.73, u27: 92.30, u28: 90.60,
    period: "Maret 2026"
  },
  {
    id: 11,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN II ANGKATAN XII",
    type: "Latsar Gol II",
    u1: 95.43, u2: 94.85, u3: 95.75, u4: 94.93, u5: 96.63, u6: 95.78, u7: 95.22, u8: 94.64, u9: 94.31, u10: 94.08, u11: 96.09, u12: 95.43, u13: 95.75, u14: 96.38, u15: 94.93, u16: 95.89, u17: 96.05, u18: 95.78, u19: 94.93, u20: 96.68, u21: 96.83, u22: 96.20, u23: 96.55, u24: 96.83, u25: 96.78, u26: 96.50, u27: 96.83, u28: 96.63,
    period: "April 2026"
  },
  {
    id: 12,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN II ANGKATAN XIII",
    type: "Latsar Gol II",
    u1: 96.93, u2: 96.20, u3: 97.58, u4: 96.83, u5: 97.53, u6: 96.73, u7: 96.43, u8: 96.30, u9: 95.58, u10: 95.95, u11: 97.03, u12: 96.60, u13: 96.00, u14: 96.95, u15: 96.73, u16: 96.85, u17: 97.25, u18: 96.78, u19: 96.98, u20: 96.68, u21: 94.30, u22: 97.10, u23: 96.85, u24: 97.83, u25: 97.50, u26: 97.20, u27: 97.23, u28: 97.08,
    period: "April 2026"
  },
  {
    id: 13,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN XIV",
    type: "Latsar Gol III",
    u1: 85.19, u2: 84.64, u3: 84.16, u4: 84.87, u5: 86.93, u6: 84.79, u7: 83.48, u8: 83.69, u9: 82.93, u10: 83.03, u11: 84.95, u12: 84.44, u13: 87.87, u14: 86.78, u15: 85.26, u16: 87.53, u17: 87.09, u18: 86.06, u19: 85.73, u20: 86.48, u21: 85.70, u22: 87.59, u23: 86.89, u24: 86.34, u25: 86.14, u26: 84.18, u27: 85.78, u28: 83.11,
    period: "Mei 2026"
  },
  {
    id: 14,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN XXXII",
    type: "Latsar Gol III",
    u1: 85.82, u2: 85.07, u3: 87.97, u4: 82.65, u5: 88.15, u6: 86.68, u7: 88.97, u8: 88.65, u9: 86.06, u10: 85.93, u11: 88.18, u12: 84.04, u13: 85.51, u14: 88.66, u15: 85.30, u16: 88.19, u17: 88.04, u18: 86.10, u19: 87.22, u20: 78.88, u21: 78.22, u22: 80.65, u23: 86.28, u24: 87.41, u25: 88.06, u26: 87.35, u27: 88.06, u28: 87.03,
    period: "Juni 2026"
  },
  {
    id: 15,
    name: "PELATIHAN KEPEMIMPINAN ADMINISTRATOR (PKA) ANGKATAN I",
    type: "PKA",
    u1: 93.86, u2: 93.39, u3: 91.94, u4: 93.53, u5: 92.56, u6: 92.74, u7: 94.39, u8: 94.12, u9: 93.09, u10: 93.36, u11: 93.36, u12: 91.74, u13: 95.06, u14: 94.47, u15: 92.65, u16: 93.91, u17: 93.89, u18: 92.86, u19: 93.41, u20: 91.41, u21: 91.44, u22: 91.77, u23: 94.86, u24: 94.06, u25: 94.15, u26: 94.56, u27: 93.39, u28: 94.47,
    period: "Mei 2026"
  },
  {
    id: 16,
    name: "PELATIHAN KEPEMIMPINAN ADMINISTRATOR (PKA) ANGKATAN II",
    type: "PKA",
    u1: 93.74, u2: 92.50, u3: 91.53, u4: 92.86, u5: 91.49, u6: 91.70, u7: 92.79, u8: 92.79, u9: 92.88, u10: 93.12, u11: 93.46, u12: 92.16, u13: 93.63, u14: 93.13, u15: 93.31, u16: 92.97, u17: 93.50, u18: 92.53, u19: 91.84, u20: 90.88, u21: 89.81, u22: 91.94, u23: 91.75, u24: 92.66, u25: 93.03, u26: 93.22, u27: 92.72, u28: 92.25,
    period: "Juni 2026"
  },
  {
    id: 17,
    name: "PELATIHAN KEPEMIMPINAN PENGAWAS (PKP) ANGKATAN III KABUPATEN SITUBONDO",
    type: "PKP",
    u1: 89.75, u2: 89.54, u3: 89.13, u4: 88.38, u5: 85.21, u6: 86.29, u7: 87.63, u8: 86.79, u9: 88.08, u10: 88.79, u11: 86.08, u12: 84.33, u13: 85.04, u14: 88.70, u15: 89.87, u16: 90.09, u17: 88.74, u18: 89.26, u19: 89.83, u20: 86.48, u21: 87.32, u22: 87.68, u23: 88.32, u24: 89.77, u25: 89.59, u26: 90.68, u27: 89.27, u28: 89.59,
    period: "Juni 2026"
  },
  {
    id: 18,
    name: "Diklat PIP Pratama ASN Angkatan I Jawa Timur",
    type: "PIP Pratama",
    u1: 89.45, u2: 89.05, u3: 87.72, u4: 88.59, u5: 89.81, u6: 88.58, u7: 89.25, u8: 89.47, u9: 89.49, u10: 89.16, u11: 90.46, u12: 88.31, u13: 90.03, u14: 90.96, u15: 90.42, u16: 88.75, u17: 89.67, u18: 89.71, u19: 89.29, u20: 90.90, u21: 92.03, u22: 92.03, u23: 92.17, u24: 90.45, u25: 90.91, u26: 91.37, u27: 91.79, u28: 90.88,
    period: "Juli 2026"
  },
  {
    id: 19,
    name: "Diklat PIP Pratama ASN Angkatan II Jawa Timur",
    type: "PIP Pratama",
    u1: 92.73, u2: 91.99, u3: 90.85, u4: 91.79, u5: 93.88, u6: 91.91, u7: 92.82, u8: 92.39, u9: 92.79, u10: 89.56, u11: 92.98, u12: 92.55, u13: 94.05, u14: 94.19, u15: 92.60, u16: 93.10, u17: 93.87, u18: 93.13, u19: 92.17, u20: 92.46, u21: 93.23, u22: 93.09, u23: 93.77, u24: 92.94, u25: 92.54, u26: 93.30, u27: 93.50, u28: 92.30,
    period: "Juli 2026"
  },
  {
    id: 20,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN XLIV",
    type: "Latsar Gol III",
    u1: 83.93, u2: 84.98, u3: 88.20, u4: 83.25, u5: 91.45, u6: 91.93, u7: 85.40, u8: 83.53, u9: 82.28, u10: 82.70, u11: 86.05, u12: 83.48, u13: 81.88, u14: 87.73, u15: 85.08, u16: 84.08, u17: 84.65, u18: 85.40, u19: 88.03, u20: 88.65, u21: 91.68, u22: 92.13, u23: 93.18, u24: 87.90, u25: 89.83, u26: 89.90, u27: 88.20, u28: 88.48,
    period: "Agustus 2026"
  },
  {
    id: 21,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN XLVI",
    type: "Latsar Gol III",
    u1: 88.26, u2: 86.49, u3: 89.02, u4: 83.68, u5: 89.84, u6: 89.26, u7: 82.97, u8: 83.77, u9: 85.00, u10: 84.01, u11: 85.37, u12: 82.70, u13: 81.26, u14: 90.44, u15: 84.77, u16: 88.30, u17: 87.38, u18: 87.33, u19: 89.80, u20: 90.90, u21: 89.17, u22: 91.29, u23: 92.64, u24: 90.67, u25: 87.18, u26: 89.34, u27: 90.57, u28: 86.62,
    period: "Agustus 2026"
  },
  {
    id: 22,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN XLIX",
    type: "Latsar Gol III",
    u1: 81.10, u2: 80.05, u3: 81.27, u4: 78.70, u5: 87.52, u6: 86.83, u7: 88.17, u8: 87.27, u9: 85.04, u10: 84.91, u11: 86.82, u12: 84.73, u13: 84.18, u14: 86.82, u15: 81.23, u16: 85.82, u17: 85.86, u18: 84.00, u19: 82.37, u20: 82.27, u21: 82.14, u22: 85.32, u23: 87.00, u24: 84.78, u25: 84.91, u26: 79.91, u27: 83.55, u28: 80.55,
    period: "Agustus 2026"
  },
  {
    id: 23,
    name: "Pelatihan Tim Penilai Internal (TPI) Zona Integritas",
    type: "Lainnya",
    u1: 84.24, u2: 85.79, u3: 82.09, u4: 88.11, u5: 80.71, u6: 78.18, u7: 87.50, u8: 86.87, u9: 88.79, u10: 88.00, u11: 85.66, u12: 87.55, u13: 92.05, u14: 88.50, u15: 85.03, u16: 87.78, u17: 88.76, u18: 85.88, u19: 82.35, u20: 90.84, u21: 90.92, u22: 88.00, u23: 91.30, u24: 88.68, u25: 88.66, u26: 91.95, u27: 89.44, u28: 90.08,
    period: "Agustus 2026"
  },
  {
    id: 24,
    name: "PELATIHAN JABATAN FUNGSIONAL PRANATA KOMPUTER",
    type: "Lainnya",
    u1: 92.89, u2: 92.67, u3: 93.44, u4: 93.50, u5: 94.22, u6: 92.39, u7: 92.56, u8: 92.44, u9: 92.23, u10: 93.61, u11: 94.06, u12: 92.89, u13: 94.17, u14: 94.67, u15: 93.89, u16: 94.44, u17: 92.89, u18: 92.78, u19: 92.83, u20: 94.45, u21: 93.17, u22: 93.51, u23: 95.67, u24: 95.56, u25: 95.39, u26: 95.00, u27: 94.89, u28: 94.61,
    period: "Juli 2026"
  },
  {
    id: 25,
    name: "PELATIHAN BENDAHARA PENGELUARAN - PROV JATIM",
    type: "Lainnya",
    u1: 94.74, u2: 94.54, u3: 94.38, u4: 94.18, u5: 93.90, u6: 93.23, u7: 94.26, u8: 94.21, u9: 94.46, u10: 94.26, u11: 93.97, u12: 93.00, u13: 94.44, u14: 94.44, u15: 94.59, u16: 94.82, u17: 95.03, u18: 94.59, u19: 94.52, u20: 93.74, u21: 94.28, u22: 93.87, u23: 94.44, u24: 94.57, u25: 94.16, u26: 94.36, u27: 94.85, u28: 94.46,
    period: "Agustus 2026"
  }
];

// Raw representative rows for Form B
export const RAW_FORM_B: Omit<FormBRecord, "average">[] = [
  {
    id: 1,
    name: "PELATIHAN KEPEMIMPINAN NASIONAL TK. II ANGKATAN II - KELAS A",
    type: "PKN II",
    u1: 90.00, u2: 88.50, u3: 88.00, u4: 88.50, u5: 93.00, u6: 88.50, u7: 87.50,
    period: "Februari 2026"
  },
  {
    id: 2,
    name: "PELATIHAN KEPEMIMPINAN NASIONAL TK. II ANGKATAN II - KELAS B",
    type: "PKN II",
    u1: 92.00, u2: 90.50, u3: 93.50, u4: 92.00, u5: 92.50, u6: 93.50, u7: 89.00,
    period: "Februari 2026"
  },
  {
    id: 3,
    name: "PELATIHAN KEPEMIMPINAN PENGAWAS (PKP) ANGKATAN I",
    type: "PKP",
    u1: 90.31, u2: 92.77, u3: 94.65, u4: 93.97, u5: 94.97, u6: 93.87, u7: 90.32,
    period: "Maret 2026"
  },
  {
    id: 4,
    name: "PELATIHAN KEPEMIMPINAN PENGAWAS (PKP) ANGKATAN II",
    type: "PKP",
    u1: 92.71, u2: 91.52, u3: 92.81, u4: 93.13, u5: 94.06, u6: 92.74, u7: 90.10,
    period: "Maret 2026"
  },
  {
    id: 5,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN II ANGKATAN I",
    type: "Latsar Gol II",
    u1: 88.28, u2: 86.97, u3: 87.75, u4: 89.13, u5: 92.13, u6: 89.78, u7: 88.06,
    period: "Januari 2026"
  },
  {
    id: 6,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN II ANGKATAN II",
    type: "Latsar Gol II",
    u1: 89.16, u2: 88.44, u3: 89.41, u4: 90.72, u5: 90.91, u6: 90.09, u7: 88.03,
    period: "Januari 2026"
  },
  {
    id: 7,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN I",
    type: "Latsar Gol III",
    u1: 91.35, u2: 88.78, u3: 89.53, u4: 91.13, u5: 92.73, u6: 91.78, u7: 89.50,
    period: "Februari 2026"
  },
  {
    id: 8,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN II",
    type: "Latsar Gol III",
    u1: 90.36, u2: 90.75, u3: 90.19, u4: 90.58, u5: 91.56, u6: 91.00, u7: 90.00,
    period: "Februari 2026"
  },
  {
    id: 9,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN VIII",
    type: "Latsar Gol III",
    u1: 92.25, u2: 90.65, u3: 92.15, u4: 91.43, u5: 92.85, u6: 91.43, u7: 88.28,
    period: "Maret 2026"
  },
  {
    id: 10,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN IX",
    type: "Latsar Gol III",
    u1: 91.00, u2: 91.83, u3: 90.63, u4: 90.88, u5: 92.58, u6: 90.83, u7: 88.18,
    period: "Maret 2026"
  },
  {
    id: 11,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN II ANGKATAN XII",
    type: "Latsar Gol II",
    u1: 96.64, u2: 96.28, u3: 96.59, u4: 96.31, u5: 96.62, u6: 96.44, u7: 95.77,
    period: "April 2026"
  },
  {
    id: 12,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN II ANGKATAN XIII",
    type: "Latsar Gol II",
    u1: 97.95, u2: 97.92, u3: 97.54, u4: 97.38, u5: 97.82, u6: 97.77, u7: 97.15,
    period: "April 2026"
  },
  {
    id: 13,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN XIV",
    type: "Latsar Gol III",
    u1: 86.84, u2: 86.47, u3: 84.39, u4: 87.00, u5: 88.03, u6: 87.63, u7: 84.79,
    period: "Mei 2026"
  },
  {
    id: 14,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN XXXII",
    type: "Latsar Gol III",
    u1: 87.47, u2: 87.50, u3: 87.28, u4: 86.97, u5: 88.41, u6: 87.78, u7: 87.38,
    period: "Juni 2026"
  },
  {
    id: 15,
    name: "PELATIHAN KEPEMIMPINAN ADMINISTRATOR (PKA) ANGKATAN I",
    type: "PKA",
    u1: 93.63, u2: 91.91, u3: 94.69, u4: 93.75, u5: 95.38, u6: 92.75, u7: 89.78,
    period: "Mei 2026"
  },
  {
    id: 16,
    name: "PELATIHAN KEPEMIMPINAN ADMINISTRATOR (PKA) ANGKATAN II",
    type: "PKA",
    u1: 89.97, u2: 88.66, u3: 93.77, u4: 93.52, u5: 94.68, u6: 93.42, u7: 92.00,
    period: "Juni 2026"
  },
  {
    id: 17,
    name: "PELATIHAN KEPEMIMPINAN PENGAWAS (PKP) ANGKATAN III KABUPATEN SITUBONDO",
    type: "PKP",
    u1: 91.35, u2: 89.80, u3: 91.80, u4: 89.70, u5: 92.05, u6: 90.40, u7: 87.25,
    period: "Juni 2026"
  },
  {
    id: 18,
    name: "Diklat PIP Pratama ASN Angkatan I Jawa Timur",
    type: "PIP Pratama",
    u1: 89.07, u2: 89.30, u3: 90.81, u4: 87.78, u5: 90.78, u6: 90.26, u7: 88.30,
    period: "Juli 2026"
  },
  {
    id: 19,
    name: "Diklat PIP Pratama ASN Angkatan II Jawa Timur",
    type: "PIP Pratama",
    u1: 89.63, u2: 91.10, u3: 92.83, u4: 92.62, u5: 92.93, u6: 91.79, u7: 88.21,
    period: "Juli 2026"
  },
  {
    id: 20,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN XLIV",
    type: "Latsar Gol III",
    u1: 80.49, u2: 86.82, u3: 86.68, u4: 78.47, u5: 84.68, u6: 84.71, u7: 86.55,
    period: "Agustus 2026"
  },
  {
    id: 21,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN XLVI",
    type: "Latsar Gol III",
    u1: 89.15, u2: 91.49, u3: 89.82, u4: 87.74, u5: 91.05, u6: 89.92, u7: 86.18,
    period: "Agustus 2026"
  },
  {
    id: 22,
    name: "PELATIHAN DASAR (LATSAR) CPNS GOLONGAN III ANGKATAN XLIX",
    type: "Latsar Gol III",
    u1: 83.79, u2: 87.58, u3: 82.16, u4: 84.74, u5: 86.89, u6: 80.79, u7: 86.37,
    period: "Agustus 2026"
  },
  {
    id: 23,
    name: "Pelatihan Tim Penilai Internal (TPI) Zona Integritas",
    type: "Lainnya",
    u1: 88.84, u2: 84.35, u3: 88.59, u4: 89.97, u5: 91.65, u6: 88.46, u7: 88.30,
    period: "Agustus 2026"
  },
  {
    id: 24,
    name: "PELATIHAN JABATAN FUNGSIONAL PRANATA KOMPUTER",
    type: "Lainnya",
    u1: 94.35, u2: 94.24, u3: 94.59, u4: 93.71, u5: 94.06, u6: 93.41, u7: 92.18,
    period: "Juli 2026"
  },
  {
    id: 25,
    name: "PELATIHAN BENDAHARA PENGELUARAN - PROV JATIM",
    type: "Lainnya",
    u1: 94.08, u2: 94.53, u3: 94.95, u4: 95.08, u5: 96.61, u6: 94.29, u7: 94.00,
    period: "Agustus 2026"
  }
];

// Helper to calculate average of a Form A record
export function calculateFormAAverage(record: Omit<FormARecord, "average">): number {
  const scores = [
    record.u1, record.u2, record.u3, record.u4, record.u5, record.u6, record.u7, record.u8,
    record.u9, record.u10, record.u11, record.u12, record.u13, record.u14, record.u15, record.u16,
    record.u17, record.u18, record.u19, record.u20, record.u21, record.u22, record.u23, record.u24,
    record.u25, record.u26, record.u27, record.u28
  ];
  const sum = scores.reduce((acc, val) => acc + val, 0);
  return Number((sum / scores.length).toFixed(2));
}

// Helper to calculate average of a Form B record
export function calculateFormBAverage(record: Omit<FormBRecord, "average">): number {
  const scores = [
    record.u1, record.u2, record.u3, record.u4, record.u5, record.u6, record.u7
  ];
  const sum = scores.reduce((acc, val) => acc + val, 0);
  return Number((sum / scores.length).toFixed(2));
}

export function getInitialFormA(): FormARecord[] {
  return RAW_FORM_A.map(record => ({
    ...record,
    average: calculateFormAAverage(record)
  }));
}

export function getInitialFormB(): FormBRecord[] {
  return RAW_FORM_B.map(record => ({
    ...record,
    average: calculateFormBAverage(record)
  }));
}

export const MONTHS = [
  "Januari 2026",
  "Februari 2026",
  "Maret 2026",
  "April 2026",
  "Mei 2026",
  "Juni 2026",
  "Juli 2026",
  "Agustus 2026"
];

export const TRAINING_TYPES = [
  "PKN II",
  "PKP",
  "PKA",
  "Latsar Gol II",
  "Latsar Gol III",
  "PIP Pratama",
  "Lainnya"
];

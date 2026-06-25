/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum Role {
  PUBLIC = "Publik",
  ANALYST = "analisis data",
  EXECUTIVE = "Pimpinan",
}

export interface FormARecord {
  id: number;
  name: string;
  type: string; // e.g. "PKP", "Latsar Gol II", "Latsar Gol III", "PKA", "PKN II", "Lainnya"
  u1: number;
  u2: number;
  u3: number;
  u4: number;
  u5: number;
  u6: number;
  u7: number;
  u8: number;
  u9: number;
  u10: number;
  u11: number;
  u12: number;
  u13: number;
  u14: number;
  u15: number;
  u16: number;
  u17: number;
  u18: number;
  u19: number;
  u20: number;
  u21: number;
  u22: number;
  u23: number;
  u24: number;
  u25: number;
  u26: number;
  u27: number;
  u28: number;
  average: number;
  period: string; // e.g. "Januari 2026", "Februari 2026", etc.
}

export interface FormBRecord {
  id: number;
  name: string;
  type: string;
  u1: number;
  u2: number;
  u3: number;
  u4: number;
  u5: number;
  u6: number;
  u7: number;
  average: number;
  period: string;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  fileName?: string;
  recordCount?: number;
}

export interface IndicatorMeta {
  code: string;
  label: string;
  category: "Prosedur" | "Sarana" | "Pembelajaran" | "Konsumsi";
}

export const FORM_A_INDICATORS: IndicatorMeta[] = [
  { code: "u1", label: "Prosedur Penyelenggaraan", category: "Prosedur" },
  { code: "u2", label: "Persyaratan Penyelenggaraan", category: "Prosedur" },
  { code: "u3", label: "Ketepatan Jadwal Penyelenggaraan", category: "Prosedur" },
  { code: "u4", label: "Pengadministrasian", category: "Prosedur" },
  { code: "u5", label: "Ketersediaan Asrama & Fasilitas", category: "Sarana" },
  { code: "u6", label: "Kualitas Asrama & Fasilitas", category: "Sarana" },
  { code: "u7", label: "Ketersediaan Sarana Pembelajaran", category: "Sarana" },
  { code: "u8", label: "Kualitas Sarana Pembelajaran", category: "Sarana" },
  { code: "u9", label: "Ketersediaan Sarana TI (WIFI/LMS)", category: "Sarana" },
  { code: "u10", label: "Kualitas Sarana TI (WIFI/LMS)", category: "Sarana" },
  { code: "u11", label: "Ketersediaan & Kebersihan Fasilitas Umum", category: "Sarana" },
  { code: "u12", label: "Sarana Penyandang Disabilitas", category: "Sarana" },
  { code: "u13", label: "Ketersediaan Ruang Hijau", category: "Sarana" },
  { code: "u14", label: "Keamanan dan Kenyamanan Lingkungan", category: "Sarana" },
  { code: "u15", label: "Kejelasan Informasi Pembelajaran", category: "Pembelajaran" },
  { code: "u16", label: "Kelengkapan Bahan Ajar", category: "Pembelajaran" },
  { code: "u17", label: "Pemanfaatan TI", category: "Pembelajaran" },
  { code: "u18", label: "Pemantauan Penyelenggaraan Pembelajaran", category: "Pembelajaran" },
  { code: "u19", label: "Kesesuaian waktu dengan jadwal", category: "Pembelajaran" },
  { code: "u20", label: "Kecukupan Gizi dan Variasi Menu", category: "Konsumsi" },
  { code: "u21", label: "Kecukupan Hidangan", category: "Konsumsi" },
  { code: "u22", label: "Kebersihan Makanan", category: "Konsumsi" },
  { code: "u23", label: "Ketepatan Waktu Penyajian", category: "Konsumsi" },
  { code: "u24", label: "Kedisiplinan & Kecepatan Petugas", category: "Prosedur" },
  { code: "u25", label: "Tanggung Jawab & Keajegan Petugas Kelas", category: "Prosedur" },
  { code: "u26", label: "Kesopanan dan Keramahan Petugas", category: "Prosedur" },
  { code: "u27", label: "Kemampuan Komunikasi & Penampilan", category: "Prosedur" },
  { code: "u28", label: "Penanganan Pengaduan oleh Petugas", category: "Prosedur" },
];

export const FORM_B_INDICATORS = [
  { code: "u1", label: "Program Pelatihan sesuai Tujuan Kurikuler" },
  { code: "u2", label: "Ketepatan & Keefektifan Waktu" },
  { code: "u3", label: "Penyelenggaraan Pelatihan" },
  { code: "u4", label: "Kesesuaian Materi" },
  { code: "u5", label: "Manfaat Materi Pelatihan" },
  { code: "u6", label: "Penyerapan Materi oleh Peserta" },
  { code: "u7", label: "Perlunya Penambahan Materi" },
];

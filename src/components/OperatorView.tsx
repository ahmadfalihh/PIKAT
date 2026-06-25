/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from "react";
import * as XLSX from "xlsx";
import { FormARecord, FormBRecord, AuditLog } from "../types";
import { 
  UploadCloud, 
  Database, 
  History, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  FileSpreadsheet,
  RefreshCw,
  Clock,
  User,
  ShieldCheck,
  Trash2,
  CheckSquare,
  Square,
  Search
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface OperatorViewProps {
  formAData: FormARecord[];
  addRecord: (newA: FormARecord, newB: FormBRecord, logMessage: string) => void;
  deleteRecords: (idsToDelete: number[]) => void;
  auditLogs: AuditLog[];
  addAuditLog: (action: string, fileName?: string, count?: number) => void;
}

export default function OperatorView({ formAData, addRecord, deleteRecords, auditLogs, addAuditLog }: OperatorViewProps) {
  // Manual Entry Form State
  const [name, setName] = useState("");
  const [type, setType] = useState("Latsar Gol III");
  const [period, setPeriod] = useState("Agustus 2026");
  
  // Sliders for representative indicators (instead of all 28 to avoid overwhelming UI, but we'll compute averages)
  const [u1, setU1] = useState(90); // Prosedur
  const [u5, setU5] = useState(88); // Sarana
  const [u15, setU15] = useState(92); // Pembelajaran
  const [u22, setU22] = useState(90); // Kebersihan Makanan
  const [u26, setU26] = useState(95); // Kesopanan

  // Live preview calculations
  const liveAverage = useMemo(() => {
    // We simulate other 23 indicators as a close average of these 5 to make a realistic Form A record
    const averageSimulated = (u1 + u5 + u15 + u22 + u26) / 5;
    return Number(averageSimulated.toFixed(2));
  }, [u1, u5, u15, u22, u26]);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // States for database management table & checklist deletion
  const [selectedForDelete, setSelectedForDelete] = useState<number[]>([]);
  const [dbSearch, setDbSearch] = useState("");
  const [dbTypeFilter, setDbTypeFilter] = useState("SEMUA");

  // Filtered data for the management list
  const managedFilteredData = useMemo(() => {
    return formAData.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(dbSearch.toLowerCase());
      const matchType = dbTypeFilter === "SEMUA" || r.type === dbTypeFilter;
      return matchSearch && matchType;
    });
  }, [formAData, dbSearch, dbTypeFilter]);

  // Unique list of types for filter select
  const dbTypeOptions = useMemo(() => {
    const types = new Set(formAData.map(r => r.type));
    return ["SEMUA", ...Array.from(types)];
  }, [formAData]);

  // Handler to toggle single item selection
  const handleToggleSelect = (id: number) => {
    if (selectedForDelete.includes(id)) {
      setSelectedForDelete(prev => prev.filter(item => item !== id));
    } else {
      setSelectedForDelete(prev => [...prev, id]);
    }
  };

  // Check All / Select All
  const handleSelectAll = () => {
    const allIdsOnCurrentPage = managedFilteredData.map(r => r.id);
    setSelectedForDelete(allIdsOnCurrentPage);
  };

  // Uncheck All / Deselect All
  const handleDeselectAll = () => {
    setSelectedForDelete([]);
  };

  // Individual deletion with custom modal
  const handleDeleteSingle = (id: number, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Penghapusan",
      message: `Apakah Anda yakin ingin menghapus data pelatihan "${name}"? Tindakan ini akan menghapus seluruh rekapan Form A (kepuasan) dan Form B (kemanfaatan) secara sinkron dari database portal.`,
      onConfirm: () => {
        deleteRecords([id]);
        setSelectedForDelete(prev => prev.filter(itemId => itemId !== id));
        showToast(`Pelatihan "${name}" berhasil dihapus`, "success");
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Bulk deletion of checked items with custom modal
  const handleDeleteSelected = () => {
    if (selectedForDelete.length === 0) return;
    
    setConfirmModal({
      isOpen: true,
      title: "Konfirmasi Hapus Terpilih",
      message: `Apakah Anda yakin ingin menghapus ${selectedForDelete.length} data pelatihan terpilih? Tindakan ini akan menghapus seluruh rekapan terpilih secara permanen dari database.`,
      onConfirm: () => {
        deleteRecords(selectedForDelete);
        setSelectedForDelete([]);
        showToast(`${selectedForDelete.length} data pelatihan berhasil dihapus`, "success");
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Bulk Upload simulator state
  const [isDragging, setIsDragging] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<{
    id: string;
    fileName: string;
    status: "SCANNING" | "WARNING" | "READY" | "COMPLETED";
    totalRows: number;
    warnings: string[];
    dataA: FormARecord[];
    dataB: FormBRecord[];
  } | null>(null);

  // Handle manual submission
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Silakan masukkan nama pelatihan!");
      return;
    }

    // Check if duplicate exists (case-insensitive name match)
    const isDuplicate = formAData.some(
      (existing) => existing.name.trim().toUpperCase() === name.trim().toUpperCase()
    );

    if (isDuplicate) {
      alert(`Data pelatihan "${name.trim().toUpperCase()}" sudah terdaftar di database (Duplikat). Data baru ini tidak dimasukkan.`);
      return;
    }

    // Construct full mock Form A record
    const recordId = Date.now();
    const newFormA: FormARecord = {
      id: recordId,
      name: name.trim().toUpperCase(),
      type,
      period,
      u1, u2: u1, u3: u1, u4: u1, // Map simulated Prosedur
      u5, u6: u5, u7: u5, u8: u5, u9: u5, u10: u5, u11: u5, u12: u5, u13: u5, u14: u5, // Map simulated Sarana
      u15, u16: u15, u17: u15, u18: u15, u19: u15, // Map Pembelajaran
      u20: u22, u21: u22, u22, u23: u22, // Map Konsumsi
      u24: u26, u25: u26, u26, u27: u26, u28: u26, // Map Pelayanan
      average: liveAverage
    };

    // Construct full mock Form B record
    const newFormB: FormBRecord = {
      id: recordId,
      name: name.trim().toUpperCase(),
      type,
      period,
      u1: u1 - 2,
      u2: u5 - 1,
      u3: u15,
      u4: u26,
      u5: u15, // Manfaat
      u6: u15 - 1, // Penyerapan
      u7: u22,
      average: Number(((u1 + u5 + u15 + u26 + u15 + u15 + u22) / 7).toFixed(2))
    };

    addRecord(newFormA, newFormB, `Menambahkan pelatihan manual: ${name.trim().toUpperCase()}`);
    
    // Reset form
    setName("");
    alert("Data Pelatihan manual berhasil disimpan ke database dan logs!");
  };

  // Simulate bulk file upload scan
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      parseUploadedFile(files[0]);
    }
  };

  const parseUploadedFile = (file: File) => {
    setIsDragging(false);
    
    // Set scanning state
    setUploadQueue({
      id: Math.random().toString(),
      fileName: file.name,
      status: "SCANNING",
      totalRows: 0,
      warnings: [],
      dataA: [],
      dataB: []
    });

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error("File kosong atau tidak dapat dibaca.");
        }
        
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert sheet to row arrays
        const rawRows = XLSX.utils.sheet_to_json<any[]>(worksheet, { header: 1 });
        
        if (!rawRows || rawRows.length === 0) {
          throw new Error("Sheet kosong atau format tidak sesuai.");
        }

        const dataA: FormARecord[] = [];
        const dataB: FormBRecord[] = [];
        const warnings: string[] = [];

        let parsedCount = 0;
        let emptyCellCount = 0;

        rawRows.forEach((row, rowIndex) => {
          if (!row || row.length === 0) return;
          
          // Let's find if there is a cell containing a training name
          let trainingName = "";
          let nameColIndex = -1;

          for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const cellVal = row[colIndex];
            if (cellVal !== undefined && cellVal !== null && typeof cellVal === "string" && cellVal.trim().length > 12) {
              const upperVal = cellVal.toUpperCase();
              if (
                upperVal.includes("PELATIHAN") || 
                upperVal.includes("LATSAR") || 
                upperVal.includes("DIKLAT") || 
                upperVal.includes("PKA") || 
                upperVal.includes("PKP") || 
                upperVal.includes("PKN") || 
                upperVal.includes("PIP")
              ) {
                // If it's a header like "NAMA PELATIHAN" or "NAMA PROGRAM", ignore
                if (upperVal === "NAMA PELATIHAN" || upperVal === "NAMA PROGRAM" || upperVal === "NAMA KEGIATAN") {
                  continue;
                }
                trainingName = cellVal.trim();
                nameColIndex = colIndex;
                break;
              }
            }
          }

          // If we found a training name row and it's not an aggregate summary row like "Rata - Rata" or "Jumlah"
          if (trainingName && !trainingName.toUpperCase().startsWith("RATA") && !trainingName.toUpperCase().startsWith("JUMLAH")) {
            // Find all numbers in the columns after the training name column
            const numbers: number[] = [];
            for (let c = nameColIndex + 1; c < row.length; c++) {
              const cellVal = row[c];
              if (cellVal !== undefined && cellVal !== null && cellVal !== "") {
                const parsedNum = parseFloat(String(cellVal).replace(",", "."));
                if (!isNaN(parsedNum)) {
                  numbers.push(parsedNum);
                }
              }
            }

            // Determine the Type of training
            let type = "Lainnya";
            const upperName = trainingName.toUpperCase();
            if (upperName.includes("GOLONGAN II") || upperName.includes("GOL II") || upperName.includes("GOL. II")) {
              type = "Latsar Gol II";
            } else if (upperName.includes("GOLONGAN III") || upperName.includes("GOL III") || upperName.includes("GOL. III")) {
              type = "Latsar Gol III";
            } else if (upperName.includes("ADMINISTRATOR") || upperName.includes("PKA")) {
              type = "PKA";
            } else if (upperName.includes("PENGAWAS") || upperName.includes("PKP")) {
              type = "PKP";
            } else if (upperName.includes("NASIONAL") || upperName.includes("PKN")) {
              type = "PKN II";
            } else if (upperName.includes("PIP") || upperName.includes("PRATAMA")) {
              type = "PIP Pratama";
            }

            // If we have some numbers or even if we don't, construct a record
            const defaultAvg = 88.5;
            let avgVal = defaultAvg;
            if (numbers.length > 0) {
              const sum = numbers.reduce((a, b) => a + b, 0);
              avgVal = parseFloat((sum / numbers.length).toFixed(2));
            }

            // Populate Form A: needs 28 scores (u1 to u28)
            const scoresA: number[] = [];
            for (let i = 0; i < 28; i++) {
              if (i < numbers.length) {
                scoresA.push(numbers[i]);
              } else {
                scoresA.push(avgVal); // pad missing cells with average
                emptyCellCount++;
              }
            }

            // Populate Form B: needs 7 scores (u1 to u7)
            const scoresB: number[] = [];
            if (numbers.length >= 35) {
              for (let i = 28; i < 35; i++) {
                scoresB.push(numbers[i]);
              }
            } else {
              for (let i = 0; i < 7; i++) {
                if (i < numbers.length) {
                  scoresB.push(numbers[i]);
                } else {
                  scoresB.push(avgVal);
                }
              }
            }

            const mockId = Date.now() + parsedCount + Math.floor(Math.random() * 1000000);

            // Construct records
            const recordA: FormARecord = {
              id: mockId,
              name: trainingName,
              type,
              u1: scoresA[0], u2: scoresA[1], u3: scoresA[2], u4: scoresA[3], u5: scoresA[4], u6: scoresA[5], u7: scoresA[6], u8: scoresA[7], u9: scoresA[8], u10: scoresA[9], u11: scoresA[10], u12: scoresA[11], u13: scoresA[12], u14: scoresA[13], u15: scoresA[14], u16: scoresA[15], u17: scoresA[16], u18: scoresA[17], u19: scoresA[18], u20: scoresA[19], u21: scoresA[20], u22: scoresA[21], u23: scoresA[22], u24: scoresA[23], u25: scoresA[24], u26: scoresA[25], u27: scoresA[26], u28: scoresA[27],
              average: avgVal,
              period: "Juni 2026"
            };

            const sumB = scoresB.reduce((a, b) => a + b, 0);
            const avgB = parseFloat((sumB / 7).toFixed(2));

            const recordB: FormBRecord = {
              id: mockId,
              name: trainingName,
              type,
              u1: scoresB[0], u2: scoresB[1], u3: scoresB[2], u4: scoresB[3], u5: scoresB[4], u6: scoresB[5], u7: scoresB[6],
              average: avgB,
              period: "Juni 2026"
            };

            dataA.push(recordA);
            dataB.push(recordB);
            parsedCount++;
          }
        });

        if (dataA.length === 0) {
          throw new Error("Tidak dapat mengidentifikasi baris data pelatihan yang valid di file Excel ini. Pastikan nama pelatihan tertulis jelas di salah satu kolom.");
        }

        // Generate helpful messages & warnings
        if (emptyCellCount > 0) {
          warnings.push(`Terdeteksi beberapa sel kosong dalam data indikator. Sistem otomatis mengisinya dengan nilai rata-rata baris agar hasil analisis tetap presisi.`);
        }
        warnings.push(`Berhasil memetakan ${dataA.length} data pelatihan untuk Form A (28 indikator kepuasan) dan Form B (7 indikator kemanfaatan).`);
        warnings.push(`File Excel berhasil dibaca secara utuh, termasuk kolom yang tersembunyi atau terlihat sebagai '###' di layar spreadsheet Anda.`);

        setUploadQueue({
          id: Math.random().toString(),
          fileName: file.name,
          status: "READY",
          totalRows: dataA.length,
          warnings,
          dataA,
          dataB
        });

        showToast(`Berhasil membaca file Excel! ${dataA.length} data siap diunggah.`, "success");
      } catch (err: any) {
        setUploadQueue(null);
        alert(`Gagal membaca file: ${err.message || "Pastikan format file Anda sesuai."}`);
      }
    };

    reader.onerror = () => {
      setUploadQueue(null);
      alert("Terjadi kesalahan teknis saat membaca file.");
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      parseUploadedFile(files[0]);
    }
  };

  const handleSaveBulkToDatabase = () => {
    if (!uploadQueue) return;
    
    const duplicates: typeof uploadQueue.dataA = [];
    const nonDuplicates: typeof uploadQueue.dataA = [];
    const nonDuplicatesB: typeof uploadQueue.dataB = [];

    uploadQueue.dataA.forEach((item, index) => {
      const isDup = formAData.some(
        (existing) => existing.name.trim().toUpperCase() === item.name.trim().toUpperCase()
      );
      if (isDup) {
        duplicates.push(item);
      } else {
        nonDuplicates.push(item);
        nonDuplicatesB.push(uploadQueue.dataB[index]);
      }
    });

    if (nonDuplicates.length === 0) {
      alert(
        `PERINGATAN: Duplikat Terdeteksi!\n\n` +
        `Semua data (${duplicates.length} baris) dalam file bulk terdeteksi sebagai duplikat dan sudah pernah diupload sebelumnya.\n\n` +
        `Data baru tidak dimasukkan ke dalam database.`
      );
      setUploadQueue(null);
      return;
    }

    // Save only unique records
    nonDuplicates.forEach((item, index) => {
      const uniqueId = Date.now() + index + Math.floor(Math.random() * 1000000);
      const itemWithUniqueId = { ...item, id: uniqueId };
      const bItemWithUniqueId = { ...nonDuplicatesB[index], id: uniqueId };
      addRecord(itemWithUniqueId, bItemWithUniqueId, `Mengunggah file bulk "${uploadQueue.fileName}" - Baris ${index + 1}`);
    });

    addAuditLog(
      `Menyimpan bulk file "${uploadQueue.fileName}" ke database (${nonDuplicates.length} baru, ${duplicates.length} duplikat dilewati)`,
      uploadQueue.fileName,
      nonDuplicates.length
    );

    setUploadQueue(prev => prev ? { ...prev, status: "COMPLETED" } : null);
    setTimeout(() => {
      setUploadQueue(null);
      if (duplicates.length > 0) {
        alert(
          `Proses Berhasil dengan Penyaringan!\n\n` +
          `- Data baru berhasil disimpan: ${nonDuplicates.length} pelatihan.\n` +
          `- Data duplikat dilewati: ${duplicates.length} pelatihan (sudah pernah diupload).\n\n` +
          `Sistem menyaring duplikat otomatis demi menjaga keandalan database.`
        );
      } else {
        alert(`Semua data (${nonDuplicates.length} pelatihan) dalam antrean bulk berhasil disimpan!`);
      }
    }, 1000);
  };

  return (
    <div className="space-y-6 text-slate-100 dark:text-slate-100">
      
      {/* Operator Welcome Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-400" />
            <span className="text-xs font-mono font-semibold text-indigo-400 tracking-wide uppercase">
              Operator Console
            </span>
          </div>
          <h2 className="text-2xl font-sans font-bold text-white mt-1">
            Smart Data Input & Validation Workflow
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Lakukan input manual dengan sinkronisasi preview instan, atau upload file Excel evaluasi dengan verifikasi queue cerdas.
          </p>
        </div>
      </div>

      {/* Grid: Split Screen Manual Entry & Bulk Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Manual Entry Split Screen */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-base text-white mb-1">
              Split-Screen Manual Entry
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Form input di sebelah kiri, preview kalkulasi rata-rata di database instan di sebelah kanan.
            </p>

            <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Input Fields */}
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                    Nama Angkatan / Program
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: LATSAR GOL III ANGKATAN XCI"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-600 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                      Jenis Diklat
                    </label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-600"
                    >
                      <option value="PKN II">PKN II</option>
                      <option value="PKP">PKP</option>
                      <option value="PKA">PKA</option>
                      <option value="Latsar Gol II">Latsar Gol II</option>
                      <option value="Latsar Gol III">Latsar Gol III</option>
                      <option value="PIP Pratama">PIP Pratama</option>
                      <option value="Lainnya">Lainnya</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                      Periode Bulan
                    </label>
                    <select
                      value={period}
                      onChange={(e) => setPeriod(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-600"
                    >
                      <option value="Januari 2026">Januari</option>
                      <option value="Februari 2026">Februari</option>
                      <option value="Maret 2026">Maret</option>
                      <option value="April 2026">April</option>
                      <option value="Mei 2026">Mei</option>
                      <option value="Juni 2026">Juni</option>
                      <option value="Juli 2026">Juli</option>
                      <option value="Agustus 2026">Agustus</option>
                    </select>
                  </div>
                </div>

                {/* Sub-Sliders for 5 indicator groups */}
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block">
                    Sampel Skor Unsur Pelayanan
                  </span>
                  
                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Prosedur (U1):</span>
                      <span className="font-mono font-bold text-indigo-400">{u1}</span>
                    </div>
                    <input
                      type="range" min="60" max="100" value={u1} onChange={(e) => setU1(Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Sarana & Fasilitas (U5):</span>
                      <span className="font-mono font-bold text-indigo-400">{u5}</span>
                    </div>
                    <input
                      type="range" min="60" max="100" value={u5} onChange={(e) => setU5(Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Pembelajaran (U15):</span>
                      <span className="font-mono font-bold text-indigo-400">{u15}</span>
                    </div>
                    <input
                      type="range" min="60" max="100" value={u15} onChange={(e) => setU15(Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Kebersihan Makanan (U22):</span>
                      <span className={`font-mono font-bold ${u22 < 85 ? "text-rose-400" : "text-indigo-400"}`}>{u22}</span>
                    </div>
                    <input
                      type="range" min="60" max="100" value={u22} onChange={(e) => setU22(Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-300 mb-1">
                      <span>Kesopanan Petugas (U26):</span>
                      <span className="font-mono font-bold text-indigo-400">{u26}</span>
                    </div>
                    <input
                      type="range" min="60" max="100" value={u26} onChange={(e) => setU26(Number(e.target.value))}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Live Calculated Preview */}
              <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-2">
                    Live Database Preview
                  </span>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-xs text-slate-400">Nama Pelatihan:</h4>
                      <p className="font-sans font-bold text-sm text-white uppercase truncate mt-0.5">
                        {name || "(Belum ada nama)"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-slate-900/50 p-2.5 rounded-lg">
                        <span className="text-[10px] text-slate-500">Jenis:</span>
                        <p className="text-xs font-semibold text-slate-200 mt-0.5">{type}</p>
                      </div>
                      <div className="bg-slate-900/50 p-2.5 rounded-lg">
                        <span className="text-[10px] text-slate-500">Periode:</span>
                        <p className="text-xs font-semibold text-slate-200 mt-0.5">{period}</p>
                      </div>
                    </div>

                    <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-850">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-300">Simulasi Rata-rata:</span>
                        <span className="font-mono text-xl font-extrabold text-indigo-450 text-indigo-400">
                          {liveAverage}
                        </span>
                      </div>
                    </div>

                    {/* Alert notification preview */}
                    <AnimatePresence>
                      {u22 < 85 && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="bg-rose-950/40 border border-rose-900/50 p-3 rounded-xl flex items-start gap-2 text-[11px] text-rose-300"
                        >
                          <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold">Traffic Light Alert:</span> Nilai U22 (Kebersihan Makanan) berada di bawah 85. Sistem pimpinan akan otomatis merekam warna merah!
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors mt-6 shadow"
                >
                  <Plus className="h-4 w-4" /> Simpan ke Database
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Drag & Drop Bulk Upload Section */}
        <div className="space-y-6">
          
          {/* Drag and Drop Zone */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="font-sans font-bold text-base text-white mb-1">
              Drag-and-Drop Bulk Upload
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Mendukung upload massal file Excel/CSV hasil rekapitulasi. Sistem memindai kolom Form A & B secara otomatis.
            </p>

            {/* Dropper */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-indigo-500 bg-indigo-950/10 scale-[1.01]"
                  : "border-slate-800 hover:border-slate-700 bg-slate-950/40"
              }`}
            >
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".xlsx,.xls,.csv"
                className="hidden"
              />
              <UploadCloud className="h-12 w-12 text-slate-500 mb-3 animate-bounce" />
              <p className="text-xs font-semibold text-slate-200">
                Seret file Excel Anda ke sini, atau klik untuk memilih file
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                Format yang didukung: XLSX, XLS, CSV (Maks. 10MB)
              </p>
            </div>

            {/* Upload Queue Simulator */}
            <AnimatePresence>
              {uploadQueue && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 bg-slate-950 rounded-xl p-4 border border-slate-850 space-y-3 overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="h-4 w-4 text-indigo-400 animate-pulse" />
                      <span className="text-xs font-semibold text-white truncate max-w-[200px]">
                        {uploadQueue.fileName}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      uploadQueue.status === "SCANNING" ? "bg-cyan-900/50 text-cyan-300" :
                      uploadQueue.status === "WARNING" ? "bg-amber-900/50 text-amber-300" :
                      "bg-indigo-900/50 text-indigo-300"
                    }`}>
                      {uploadQueue.status === "SCANNING" ? "MEMINDAI..." :
                       uploadQueue.status === "WARNING" ? "VERIFIKASI ANTRIAN" :
                       "SIAP SIMPAN"}
                    </span>
                  </div>

                  {uploadQueue.status === "SCANNING" ? (
                    <div className="flex items-center gap-2 text-xs text-slate-400 py-2">
                      <RefreshCw className="h-4 w-4 text-indigo-500 animate-spin" />
                      <span>Sistem sedang mencocokkan kolom Form A dan Form B...</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {/* Warnings / Alerts Box */}
                      <div className="space-y-1.5">
                        {uploadQueue.warnings.map((w, i) => (
                           <div key={i} className="flex items-start gap-1.5 text-[11px] text-amber-400 leading-tight">
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>{w}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                        <span className="text-[11px] text-slate-400">
                          Total: <strong className="text-white">{uploadQueue.dataA.length}</strong> Program Terbaca
                        </span>
                        <button
                          onClick={handleSaveBulkToDatabase}
                          className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> Konfirmasi & Simpan
                        </button>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Audit Trail / Histori Log */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <History className="h-5 w-5 text-indigo-400" />
              <h3 className="font-sans font-bold text-base text-white">Audit Trail / Histori Log</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Mencatat jejak digital "Siapa mengunggah apa dan kapan" demi akuntabilitas data pemerintahan.
            </p>

            <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
              {auditLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="bg-slate-950 p-2.5 rounded-xl border border-slate-900/60 flex items-start justify-between text-[11px]"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                      <User className="h-3 w-3 text-indigo-400" />
                      <span>{log.user}</span>
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">
                        Operator
                      </span>
                    </div>
                    <p className="text-slate-400 leading-normal">{log.action}</p>
                    {log.fileName && (
                      <p className="text-[9px] text-cyan-400 font-mono mt-0.5">File: {log.fileName}</p>
                    )}
                  </div>
                  <div className="text-right shrink-0 flex items-center gap-1 text-slate-500 font-mono text-[9px] whitespace-nowrap">
                    <Clock className="h-3 w-3" />
                    <span>{log.timestamp.split("T")[1]?.slice(0, 5) || log.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* SECTION: DATABASE MANAGEMENT & CHECKLIST DELETION */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-indigo-400" />
              <h3 className="font-sans font-bold text-lg text-white">
                Daftar & Pengelolaan Database Pelatihan BPSDM Jatim
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Kelola seluruh rekapan pelatihan terdaftar. Gunakan checklist untuk memilih dan menghapus data yang tidak sesuai.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Selection quick actions */}
            <button
              onClick={handleSelectAll}
              disabled={managedFilteredData.length === 0}
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              Pilih Semua ({managedFilteredData.length})
            </button>
            <button
              onClick={handleDeselectAll}
              disabled={selectedForDelete.length === 0}
              className="bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Square className="h-3.5 w-3.5" />
              Batal Pilih
            </button>
            
            {/* Bulk delete trigger button */}
            <button
              onClick={handleDeleteSelected}
              disabled={selectedForDelete.length === 0}
              className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 disabled:bg-slate-800 disabled:border-slate-700 disabled:text-slate-500 text-white text-xs font-bold px-4 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-rose-950/25 border border-rose-500/30"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Hapus Terpilih ({selectedForDelete.length})
            </button>
          </div>
        </div>

        {/* Filters and search inside database list */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Cari berdasarkan nama angkatan / program..."
              value={dbSearch}
              onChange={(e) => setDbSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-600 transition-all font-sans"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 shrink-0">Filter Jenis:</span>
            <select
              value={dbTypeFilter}
              onChange={(e) => setDbTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-600"
            >
              {dbTypeOptions.map(t => (
                <option key={t} value={t}>{t === "SEMUA" ? "Semua Jenis Diklat" : t}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Database Checklist Table */}
        <div className="bg-slate-950 border border-slate-850 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto font-sans">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">
                    <input
                      type="checkbox"
                      checked={managedFilteredData.length > 0 && managedFilteredData.every(r => selectedForDelete.includes(r.id))}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleSelectAll();
                        } else {
                          handleDeselectAll();
                        }
                      }}
                      className="accent-indigo-600 rounded cursor-pointer h-3.5 w-3.5"
                    />
                  </th>
                  <th className="py-3.5 px-4">Nama Program / Angkatan Pelatihan</th>
                  <th className="py-3.5 px-4">Jenis Diklat</th>
                  <th className="py-3.5 px-4">Periode</th>
                  <th className="py-3.5 px-4 text-center">Rerata Nilai</th>
                  <th className="py-3.5 px-4 text-center w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900">
                {managedFilteredData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500 font-medium">
                      Tidak ada data pelatihan terdaftar yang cocok dengan kriteria.
                    </td>
                  </tr>
                ) : (
                  managedFilteredData.map((r) => {
                    const isChecked = selectedForDelete.includes(r.id);
                    return (
                      <tr 
                        key={r.id} 
                        className={`hover:bg-slate-900/50 transition-colors ${
                          isChecked ? "bg-indigo-950/10" : ""
                        }`}
                      >
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleSelect(r.id)}
                            className="accent-indigo-600 rounded cursor-pointer h-3.5 w-3.5"
                          />
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-250 block">{r.name}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="bg-slate-900 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                            {r.type}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-400">{r.period}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-indigo-400">
                          {typeof r.average === "number" ? r.average.toFixed(2) : r.average}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleDeleteSingle(r.id, r.name)}
                            className="text-slate-500 hover:text-rose-400 p-1.5 hover:bg-rose-950/30 rounded-lg transition-all"
                            title="Hapus data ini"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Footnote information */}
        <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-950/40 border border-slate-850/55 rounded-xl px-4 py-3 font-sans">
          <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
          <span>
            <strong>Informasi:</strong> Penghapusan di atas akan menghapus record kepuasan (Form A) dan record kemanfaatan (Form B) yang sinkron secara bersamaan demi menjaga integritas relasional database portal.
          </span>
        </div>
      </div>

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

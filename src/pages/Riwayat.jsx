import React, { useState } from "react";
import {
  FiArrowLeft,
  FiClock,
  FiCalendar,
  FiActivity,
  FiMapPin,
  FiAlertCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Box } from "@mui/material";

// Dayjs Imports & Plugins
import dayjs from "dayjs";
import "dayjs/locale/id";
import localeData from "dayjs/plugin/localeData";

dayjs.extend(localeData);
dayjs.locale("id");

const Riwayat = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);

  // State untuk Filter
  const [tanggalAbsensi, setTanggalAbsensi] = useState(dayjs());
  const [bulan, setBulan] = useState(dayjs().month() + 1);
  const [tahun, setTahun] = useState(dayjs().year());

  const listBulan = dayjs.months();
  const listTahun = [0, 1, 2].map((i) => dayjs().year() - i);

  const tabs = [
    { id: 0, label: "Detail", icon: <FiClock size={16} /> },
    { id: 1, label: "Kehadiran", icon: <FiCalendar size={16} /> },
    { id: 2, label: "Rekap", icon: <FiActivity size={16} /> },
  ];

  return (
    <div className="h-[100dvh] bg-gray-50 font-poppins flex flex-col overflow-hidden text-custom-gelap">
      {/* 1. Header Section - Ringkas */}
      <div className="relative bg-gradient-to-br from-custom-merah to-custom-gelap h-36 rounded-b-[40px] p-6 pt-2 shadow-xl flex-shrink-0 z-0">
        <div className="flex justify-between items-start mt-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 backdrop-blur-md p-3 rounded-2xl text-white active:scale-95 transition shadow-lg"
          >
            <FiArrowLeft size={24} />
          </button>
          <div className="text-right text-white">
            <h1 className="text-2xl font-black uppercase tracking-widest leading-none">
              Riwayat
            </h1>
            <p className="text-white/60 text-[10px] font-bold uppercase tracking-[2px] mt-2">
              Log Aktivitas Kerja
            </p>
          </div>
        </div>

        {/* 2. Floating Modern Tabs */}
        <div className="absolute -bottom-7 left-6 right-6 bg-white rounded-2xl shadow-lg p-1.5 border border-gray-50 flex gap-1 z-20">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-custom-merah text-white shadow-md shadow-custom-merah/20"
                  : "text-gray-400"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Filter Section - Ukuran Lebih Proporsional */}
      <div className="mt-10 px-6 flex-shrink-0">
        {activeTab === 0 ? (
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center justify-center">
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
              <DatePicker
                value={tanggalAbsensi}
                onChange={(v) => setTanggalAbsensi(v)}
                format="DD MMMM YYYY"
                slotProps={{
                  textField: {
                    variant: "standard",
                    InputProps: { disableUnderline: true },
                    className:
                      "bg-gray-50 py-2 px-6 rounded-xl font-black text-xs text-custom-gelap text-center shadow-inner",
                  },
                }}
              />
            </LocalizationProvider>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 grid grid-cols-2 gap-3">
            <select
              value={bulan}
              onChange={(e) => setBulan(Number(e.target.value))}
              className="bg-gray-50 p-2.5 rounded-xl font-bold text-[11px] text-custom-gelap outline-none border-none shadow-inner text-center appearance-none"
            >
              {listBulan.map((m, i) => (
                <option key={i} value={i + 1}>
                  {m}
                </option>
              ))}
            </select>
            <select
              value={tahun}
              onChange={(e) => setTahun(Number(e.target.value))}
              className="bg-gray-50 p-2.5 rounded-xl font-bold text-[11px] text-custom-gelap outline-none border-none shadow-inner text-center appearance-none"
            >
              {listTahun.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* 4. Content Area */}
      <div className="mt-4 px-6 flex-1 overflow-y-auto pb-10">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-400">
          {activeTab === 0 && <DailyDetailContent />}
          {activeTab === 1 && <AttendanceListContent />}
          {activeTab === 2 && <SummaryHistoryContent />}
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

// 1. DETAIL HARIAN (TAB 0)
const DailyDetailContent = () => (
  <div className="bg-white rounded-[35px] p-6 shadow-sm border border-gray-100 space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-green-50/50 p-4 rounded-[25px] border border-green-100/50 text-center">
        <p className="text-[8px] font-black text-green-600 uppercase tracking-widest mb-1">
          Masuk
        </p>
        <h4 className="text-2xl font-black text-custom-gelap tracking-tighter">
          08:02
        </h4>
      </div>
      <div className="bg-red-50/50 p-4 rounded-[25px] border border-red-100/50 text-center">
        <p className="text-[8px] font-black text-custom-merah uppercase tracking-widest mb-1">
          Pulang
        </p>
        <h4 className="text-2xl font-black text-custom-gelap tracking-tighter">
          17:05
        </h4>
      </div>
    </div>

    <div className="space-y-4 border-t border-gray-50 pt-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-orange-400 rounded-full" />
          <div>
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
              Istirahat
            </p>
            <p className="text-base font-black text-custom-gelap mt-1">12:00</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
            Kembali
          </p>
          <p className="text-base font-black text-custom-gelap mt-1">13:05</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-orange-50 p-3.5 rounded-2xl border border-orange-100 text-center">
          <p className="text-[8px] font-black text-orange-600 uppercase mb-0.5">
            Telat Kembali
          </p>
          <p className="text-sm font-black text-orange-700">5 Menit</p>
        </div>
        <div className="bg-blue-50 p-3.5 rounded-2xl border border-blue-100 text-center">
          <p className="text-[8px] font-black text-blue-600 uppercase mb-0.5">
            Tunjangan
          </p>
          <p className="text-sm font-black text-blue-700">Rp 50k</p>
        </div>
      </div>
    </div>
  </div>
);

// 2. DAFTAR KEHADIRAN TIAP HARI (TAB 1)
const AttendanceListContent = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div
        key={i}
        className="bg-white rounded-[25px] p-4 shadow-sm border border-gray-100 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="bg-gray-50 w-12 h-12 rounded-2xl flex flex-col items-center justify-center border border-gray-100">
            <span className="text-[8px] font-black text-gray-400 uppercase leading-none">
              {dayjs().subtract(i, "day").format("MMM")}
            </span>
            <span className="text-lg font-black text-custom-gelap leading-none mt-1">
              {dayjs().subtract(i, "day").format("DD")}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-black text-custom-gelap">
                08:00 - 17:00
              </h4>
              <span className="text-[7px] font-black bg-green-100 text-green-600 px-1.5 py-0.5 rounded uppercase">
                Hadir
              </span>
            </div>
            <div className="flex items-center gap-1 text-gray-400 mt-1">
              <FiMapPin size={10} />
              <p className="text-[9px] font-bold italic truncate w-32">
                Kantor Pusat
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[7px] font-black text-gray-300 uppercase leading-none">
            Terlambat
          </p>
          <p className="text-[11px] font-black text-orange-500 mt-1">2 Menit</p>
        </div>
      </div>
    ))}
  </div>
);

// 3. REKAP BULANAN (TAB 2)
const SummaryHistoryContent = () => (
  <div className="bg-white rounded-[40px] p-6 shadow-sm border border-gray-100 space-y-6">
    <div className="grid grid-cols-2 gap-4">
      <SummaryItem
        label="Hadir"
        value="22"
        unit="Hari"
        color="text-green-600"
      />
      <SummaryItem label="Alpha" value="0" unit="Hari" color="text-red-500" />
      <SummaryItem label="Izin" value="2" unit="Hari" color="text-orange-500" />
      <SummaryItem label="Lembur" value="12" unit="Jam" color="text-blue-600" />
    </div>
    <button className="w-full py-4 bg-custom-gelap text-white rounded-[20px] font-black text-[10px] uppercase tracking-[2px] shadow-lg active:scale-95 transition">
      Unduh Slip Gaji (PDF)
    </button>
  </div>
);

const SummaryItem = ({ label, value, unit, color }) => (
  <div className="bg-gray-50/50 p-4 rounded-[25px] text-center border border-gray-100">
    <p className="text-[8px] font-black text-gray-400 uppercase mb-1">
      {label}
    </p>
    <p className={`text-xl font-black ${color} leading-none`}>{value}</p>
    <p className="text-[9px] font-bold text-gray-300 uppercase mt-1">{unit}</p>
  </div>
);

export default Riwayat;

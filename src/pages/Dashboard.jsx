import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  IoMdNotificationsOutline,
  IoMdClose,
  IoMdLogOut,
} from "react-icons/io";
import {
  IoTrashBin,
  IoSettingsOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { RiCalendarScheduleFill } from "react-icons/ri";
import {
  FaNotesMedical,
  FaLocationDot,
  FaPersonDigging,
} from "react-icons/fa6";
import { Avatar } from "@mui/material";
import CameraAttendance from "../components/CameraAttendance";
import { FiLock } from "react-icons/fi";

const Dashboard = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [attendanceMode, setAttendanceMode] = useState("");

  // === DATA DUMMY LENGKAP ===
  const [nama] = useState("Gugun Jofandi");
  const [dataPresensi] = useState({
    jam_masuk: "08:02",
    lokasi_masuk: "Kantor Perampuan",
    istirahat_mulai: "12:05",
    istirahat_selesai: "13:15",
    lokasi_istirahat_selesai: "Gudang GM",
    jam_keluar: "17:05",
    lokasi_keluar: "Kantor Perampuan",
    menit_terlambat: 70,
    terlambat_istirahat: 15,
  });

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const formatTerlambat = (totalMenit) => {
    if (!totalMenit || totalMenit <= 0) return null;

    const jam = Math.floor(totalMenit / 60);
    const menit = totalMenit % 60;

    if (jam > 0) {
      return `${jam} Jam ${menit > 0 ? `${menit} Menit` : ""}`;
    }
    return `${menit} Menit`;
  };

  const handleLogout = () => {
    localStorage.clear(); // Menghapus semua data login
    navigate("/login"); // Melempar user ke login
  };

  return (
    <div className="h-[100dvh] bg-gray-50 font-poppins overflow-hidden flex flex-col">
      {/* 1. Header Section - Height ditingkatkan agar ruang Floating Card lebih lega */}
      <div className="relative bg-gradient-to-br from-custom-merah to-custom-gelap h-44 rounded-b-[45px] p-6 shadow-xl flex-shrink-0">
        <div className="flex justify-between items-start mt-2">
          <div className="text-white">
            <span className="text-sm opacity-70 uppercase tracking-[2px] font-medium">
              Selamat Pagi,
            </span>
            {/* Nama diperbesar ke text-2xl */}
            <h1 className="text-2xl font-extrabold tracking-tight leading-tight">
              {nama}
            </h1>
          </div>

          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <button
              onClick={() => setShowStatusModal(true)}
              className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl text-white hover:bg-white/30 transition shadow-lg"
            >
              <IoMdNotificationsOutline size={24} />
            </button>
            <Avatar
              onClick={toggleDropdown}
              className="border-2 border-white/50 cursor-pointer shadow-xl hover:scale-105 transition-transform"
              sx={{
                bgcolor: "#B77171",
                width: 42,
                height: 42,
                fontWeight: "bold",
              }}
            >
              GJ
            </Avatar>

            {isDropdownOpen && (
              <div className="absolute right-0 top-14 w-56 bg-white rounded-[30px] shadow-2xl py-3 z-50 border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <IoPersonOutline size={20} className="text-gray-400" />
                  <span className="font-bold text-xs uppercase tracking-widest">
                    Profile
                  </span>
                </button>

                {/* Menu Baru: Keamanan */}
                <button
                  onClick={() => navigate("/settings")}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-sm text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <FiLock size={20} className="text-gray-400" />
                  <span className="font-bold text-xs uppercase tracking-widest">
                    Keamanan
                  </span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-4 text-sm text-red-600 font-black border-t border-gray-50 hover:bg-red-50 transition-all uppercase tracking-[2px]"
                >
                  <IoMdLogOut size={20} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Card - Diperbesar agar seimbang dengan section aktivitas */}
        <div className="absolute -bottom-14 left-6 right-6 bg-white rounded-[35px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] p-6 border border-gray-50">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-custom-merah animate-pulse"></div>
              <span className="text-[11px] font-black text-custom-gelap uppercase tracking-[2px]">
                Shift Pagi
              </span>
            </div>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-tight">
              Sabtu, 3 Jan 2026
            </span>
          </div>

          <div className="flex items-center justify-between gap-5">
            <div className="flex-shrink-0">
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-[3px] mb-1">
                Jam Kerja
              </p>
              {/* Jam kerja diperbesar ke text-3xl agar senada dengan DetailActivityRow */}
              <h2 className="text-3xl font-black text-custom-gelap tracking-tighter leading-none">
                08:00 - 17:00
              </h2>
            </div>

            {/* Button dibuat lebih tinggi (py-4) dan font lebih bold */}
            <button
              onClick={() => {
                setAttendanceMode("masuk");
                setIsCameraOpen(true);
              }}
              className="flex-1 bg-gradient-to-r from-custom-merah to-custom-gelap text-white py-4 px-4 rounded-[22px] text-sm font-black shadow-lg shadow-custom-merah/30 active:scale-95 transition-all uppercase tracking-widest"
            >
              {dataPresensi.jam_keluar ? "Selesai" : "Absen Pulang"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Grid Menu Section */}
      <div className="mt-20 px-6 flex-shrink-0">
        <div className="grid grid-cols-3 gap-3">
          <MenuButton
            icon={<RiCalendarScheduleFill size={18} />}
            label="Riwayat"
            onClick={() => navigate("/riwayat")}
          />
          <MenuButton
            icon={<FaNotesMedical size={18} />}
            label="Izin"
            onClick={() => navigate("/izin-sakit")}
          />
          <MenuButton
            icon={<FaPersonDigging size={18} />}
            label="Lembur"
            onClick={() => navigate("/form-lembur")}
          />
        </div>
      </div>

      {/* 3. Activity Section - Enlarged Time Font */}
      <div className="mt-6 px-6 flex-1 overflow-hidden pb-6">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[11px] font-black text-custom-gelap uppercase tracking-[2px]">
            Aktivitas Hari Ini
          </h3>
          {dataPresensi.menit_terlambat > 0 && (
            <span className="text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
              Terlambat: {formatTerlambat(dataPresensi.menit_terlambat)}
            </span>
          )}
        </div>

        <div className="bg-white rounded-[35px] shadow-sm border border-gray-100 p-4 space-y-3">
          <DetailActivityRow
            label="Absensi Masuk"
            time={dataPresensi.jam_masuk}
            location={dataPresensi.lokasi_masuk}
            iconColor="bg-green-500"
            isActive={true}
          />

          <div className="grid grid-cols-2 gap-3">
            <CompactActivityBox
              label="Istirahat"
              time={dataPresensi.istirahat_mulai}
              iconColor="bg-orange-400"
              isActive={true}
            />
            <CompactActivityBox
              label="Kembali"
              time={dataPresensi.istirahat_selesai}
              iconColor="bg-blue-500"
              isActive={true}
              isLate={dataPresensi.terlambat_istirahat > 0}
              timeLate={dataPresensi.terlambat_istirahat}
              location={dataPresensi.lokasi_istirahat_selesai}
            />
          </div>

          <DetailActivityRow
            label="Absensi Pulang"
            time={dataPresensi.jam_keluar}
            location={dataPresensi.lokasi_keluar}
            iconColor="bg-custom-merah"
            isActive={true}
            showDelete={true}
          />
        </div>
      </div>

      {/* Modal Status */}
      {showStatusModal && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-xs rounded-t-[30px] rounded-b-[10px] overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-5">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-sm font-black text-custom-gelap uppercase">
                  Status Izin
                </h1>
                <button
                  onClick={() => setShowStatusModal(false)}
                  className="p-1 bg-gray-100 rounded-full"
                >
                  <IoMdClose size={18} />
                </button>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
                <StatusRow label="Periode" value="03 Jan - 05 Jan" />
                <StatusRow label="Keperluan" value="Izin Sakit (Demam)" />
                <StatusRow
                  label="Status"
                  value="Approved"
                  isStatus
                  statusColor="text-green-600 bg-green-100"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <CameraAttendance
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        mode={attendanceMode}
        onAttendanceSuccess={() => {
          // Panggil fungsi refresh data dashboard di sini
          alert("Absen Berhasil!");
        }}
      />
    </div>
  );
};

// --- SUB COMPONENTS (OPTIMIZED & ENLARGED) ---

const DetailActivityRow = ({
  label,
  time,
  location,
  iconColor,
  isActive,
  showDelete,
}) => (
  // Padding ditingkatkan dari p-3 ke p-4
  <div
    className={`p-4 px-5 rounded-[28px] border transition-all ${
      isActive
        ? "bg-gray-50/50 border-gray-100 shadow-sm"
        : "bg-white border-dashed border-gray-200"
    }`}
  >
    <div className="flex justify-between items-center">
      <div className="flex gap-4 items-center">
        {/* Indikator Bar diperlebar sedikit */}
        <div
          className={`w-2 h-12 rounded-full ${
            isActive ? iconColor : "bg-gray-200"
          }`}
        />

        <div className="flex flex-col">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[2px] mb-1">
            {label}
          </p>
          <div className="flex items-baseline gap-3">
            {/* Font Jam diperbesar ke text-3xl */}
            <h4 className="text-3xl font-black text-custom-gelap leading-none tracking-tighter">
              {time || "--:--"}
            </h4>
            {isActive && location && (
              <div className="flex items-center gap-1 text-gray-400 max-w-[140px]">
                <FaLocationDot
                  size={10}
                  className="text-custom-merah flex-shrink-0"
                />
                <p className="text-[10px] font-bold truncate italic">
                  {location}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      {showDelete && <IoTrashBin size={20} className="text-red-300" />}
    </div>
  </div>
);

const CompactActivityBox = ({
  label,
  time,
  iconColor,
  isActive,
  isLate,
  timeLate,
  location,
}) => (
  // Padding ditingkatkan ke p-4
  <div
    className={`p-4 rounded-[28px] border transition-all ${
      isActive
        ? "bg-gray-50/50 border-gray-100 shadow-sm"
        : "bg-white border-dashed border-gray-200"
    }`}
  >
    <div className="flex items-center gap-2 mb-2">
      <div
        className={`w-2 h-2 rounded-full ${
          isActive ? iconColor : "bg-gray-200"
        }`}
      />
      <p className="text-[10px] font-black text-gray-400 uppercase leading-none tracking-wider">
        {label}
      </p>
    </div>
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        {/* Font Jam diperbesar ke text-2xl */}
        <h4 className="text-2xl font-black text-custom-gelap leading-none tracking-tighter">
          {time || "--:--"}
        </h4>
        {isLate && (
          <span className="text-[8px] font-black text-red-500 bg-red-100 px-1.5 py-0.5 rounded uppercase">
            {timeLate}m
          </span>
        )}
      </div>
      {location && isActive && (
        <div className="flex items-center gap-1 mt-1 text-gray-400">
          <FaLocationDot size={8} className="flex-shrink-0" />
          <p className="text-[9px] font-bold truncate italic">{location}</p>
        </div>
      )}
    </div>
  </div>
);

const MenuButton = ({ icon, label, onClick }) => (
  // Padding ditingkatkan agar button lebih besar
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center bg-white p-4 rounded-[22px] border border-gray-100 shadow-sm active:scale-95 transition"
  >
    <div className="text-custom-merah mb-2 p-2.5 bg-red-50 rounded-2xl">
      {/* Icon size diperbesar sedikit */}
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <span className="text-[11px] font-black text-gray-600 uppercase tracking-widest">
      {label}
    </span>
  </button>
);

const StatusRow = ({ label, value, isStatus, statusColor }) => (
  <div className="flex justify-between items-center text-[10px]">
    <span className="text-gray-400 font-bold uppercase">{label}</span>
    <span
      className={`font-black ${
        isStatus ? `px-2 py-0.5 rounded-md ${statusColor}` : "text-custom-gelap"
      }`}
    >
      {value}
    </span>
  </div>
);

export default Dashboard;

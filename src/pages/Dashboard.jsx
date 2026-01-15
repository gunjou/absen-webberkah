import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdNotificationsOutline, IoMdLogOut } from "react-icons/io";
import { IoTrashBin, IoPersonOutline } from "react-icons/io5";
import { RiCalendarScheduleFill } from "react-icons/ri";
import {
  FaNotesMedical,
  FaLocationDot,
  FaPersonDigging,
} from "react-icons/fa6";
import { Avatar, Skeleton } from "@mui/material"; // Tambahkan Skeleton untuk loading
import CameraAttendance from "../components/CameraAttendance";
import { FiLock } from "react-icons/fi";
import dayjs from "dayjs";
import "dayjs/locale/id";

import Api from "../Api"; // Import instance axios Anda
import { formatTerlambat, toTitleCase } from "../utils/Helper";
import ShiftPickerModal from "../components/ShiftPickerModal";

const Dashboard = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  // State Management
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  // const [showStatusModal, setShowStatusModal] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [attendanceMode, setAttendanceMode] = useState("");
  const [loading, setLoading] = useState(true);
  const [showIstirahatModal, setShowIstirahatModal] = useState(false);

  // Data State
  const [pegawai, setPegawai] = useState({ nama: "" });
  const [activeIzin, setActiveIzin] = useState(null);
  const [isShift, setIsShift] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [selectedShiftId, setSelectedShiftId] = useState(null);
  const [shift, setShift] = useState({
    mulai: "08:00",
    selesai: "17:00",
    nama: "Normal",
  });
  const [presensi, setPresensi] = useState({
    jam_masuk: null,
    lokasi_masuk: null,
    jam_keluar: null,
    lokasi_keluar: null,
    menit_terlambat: 0,
    istirahat_mulai: null,
    istirahat_selesai: null,
    terlambat_istirahat: 0,
    lokasi_balik: null,
  });

  const getGreeting = () => {
    const hour = dayjs().hour(); // Mengambil jam (0-23)

    if (hour >= 5 && hour < 11) return "Selamat Pagi";
    if (hour >= 11 && hour < 15) return "Selamat Siang";
    if (hour >= 15 && hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  useEffect(() => {
    const checkActiveIzin = async () => {
      try {
        setLoading(true);
        const today = dayjs().format("YYYY-MM-DD");
        const res = await Api.get(`/perizinan/aktif?tanggal=${today}`);
        if (res.data.data && res.data.data.length > 0) {
          setActiveIzin(res.data.data[0]);
        }
      } catch (err) {
        console.error("Gagal cek izin aktif", err);
      }
      setLoading(false);
    };
    checkActiveIzin();
  }, []);

  // Fetch Data dari API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await Api.get("/absensi/hari-ini");
      const { data } = res.data;

      // Map Pegawai
      setPegawai({ nama: data.pegawai.nama_panggilan });

      // Map Check Bisa milih shift
      setIsShift(data.pegawai.is_shift === 1 || data.pegawai.is_shift === true);

      setShift({
        mulai: data.jam_kerja.jam_mulai,
        selesai: data.jam_kerja.jam_selesai,
        nama: data.jam_kerja.nama_shift,
      });

      // Map Jam Kerja
      setShift({
        mulai: data.jam_kerja.jam_mulai,
        selesai: data.jam_kerja.jam_selesai,
        nama: data.jam_kerja.nama_shift,
      });

      // Map Presensi & Istirahat (Ambil data istirahat pertama jika ada)
      const dataIstirahat = data.presensi.istirahat?.[0] || {};

      setPresensi({
        jam_masuk: data.presensi.jam_masuk,
        lokasi_masuk: data.presensi.lokasi_masuk,
        jam_keluar: data.presensi.jam_keluar,
        lokasi_keluar: data.presensi.lokasi_keluar,
        menit_terlambat: data.presensi.menit_terlambat,
        istirahat_mulai: dataIstirahat.jam_mulai || null,
        istirahat_selesai: dataIstirahat.jam_selesai || null,
        terlambat_istirahat: dataIstirahat.terlambat_istirahat || 0,
        lokasi_balik: dataIstirahat.lokasi_balik,
      });
    } catch (err) {
      console.error("Gagal memuat data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleMainAction = async () => {
    let mode = "";
    if (!presensi.jam_masuk) mode = "masuk";
    else if (!presensi.istirahat_mulai) mode = "mulai_istirahat";
    else if (!presensi.istirahat_selesai) mode = "selesai_istirahat";
    else mode = "pulang";

    // Jika mode mulai istirahat, buka modal konfirmasi
    if (mode === "mulai_istirahat") {
      setShowIstirahatModal(true);
      return;
    }

    // Jika mode masuk pegawai dan bisa pilih shift
    if (mode === "masuk" && isShift) {
      setShowShiftModal(true);
      return;
    }

    // Alur lainnya tetap buka kamera
    setAttendanceMode(mode);
    setIsCameraOpen(true);
  };

  const handleConfirmShift = (shiftId) => {
    setSelectedShiftId(shiftId);
    setShowShiftModal(false);
    setAttendanceMode("masuk");
    setIsCameraOpen(true);
  };

  // Fungsi eksekusi API setelah dikonfirmasi
  const confirmIstirahatMulai = async () => {
    try {
      setShowIstirahatModal(false); // Tutup modal konfirmasi
      setLoading(true); // Munculkan spinner overlay dashboard
      await Api.post("/absensi/istirahat-mulai");
      fetchDashboardData(); // Refresh data dashboard
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memulai istirahat");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="h-[100dvh] bg-gray-50 font-poppins overflow-hidden flex flex-col text-custom-gelap">
      {/* 1. Header Section */}
      <div className="relative bg-gradient-to-br from-custom-merah to-custom-gelap h-44 rounded-b-[45px] p-6 shadow-xl flex-shrink-0">
        <div className="flex justify-between items-start mt-2">
          <div className="text-white">
            <span className="text-sm opacity-70 uppercase tracking-[2px] font-medium">
              {getGreeting()},
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight leading-tight truncate max-w-[200px]">
              {loading ? (
                <Skeleton
                  width={150}
                  sx={{ bgcolor: "rgba(255,255,255,0.2)" }}
                />
              ) : (
                toTitleCase(pegawai.nama)
              )}
            </h1>
          </div>

          <div className="flex items-center gap-3 relative" ref={dropdownRef}>
            <button
              // onClick={() => setShowStatusModal(true)}
              className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl text-white"
            >
              <IoMdNotificationsOutline size={24} />
            </button>
            <Avatar
              onClick={toggleDropdown}
              className="border-2 border-white/50 cursor-pointer shadow-xl"
              sx={{
                bgcolor: "#B77171",
                width: 42,
                height: 42,
                fontWeight: "bold",
              }}
            >
              {pegawai.nama
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </Avatar>

            {isDropdownOpen && (
              <div className="absolute right-0 top-14 w-56 bg-white rounded-[30px] shadow-2xl py-3 z-50 border border-gray-100 overflow-hidden animate-in fade-in zoom-in duration-200">
                <button
                  onClick={() => navigate("/profile")}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-xs text-gray-700 hover:bg-gray-50 uppercase font-black tracking-widest"
                >
                  <IoPersonOutline size={20} className="text-gray-400" />{" "}
                  Profile
                </button>
                <button
                  onClick={() => navigate("/settings")}
                  className="w-full flex items-center gap-3 px-5 py-3.5 text-xs text-gray-700 hover:bg-gray-50 uppercase font-black tracking-widest"
                >
                  <FiLock size={20} className="text-gray-400" /> Keamanan
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-5 py-4 text-sm text-red-600 font-black border-t border-gray-50 hover:bg-red-50 uppercase tracking-[2px]"
                >
                  <IoMdLogOut size={20} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Card */}
        {/* Floating Card */}
        <div className="absolute -bottom-14 left-6 right-6 bg-white rounded-[35px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] p-6 border border-gray-50 h-[120px] flex flex-col justify-center">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  activeIzin
                    ? "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    : presensi.jam_keluar
                    ? "bg-green-500"
                    : "bg-custom-merah animate-pulse"
                }`}
              ></div>
              <span className="text-[11px] font-black text-custom-gelap uppercase">
                Shift {shift.nama}
              </span>
            </div>
            <span className="text-[11px] text-gray-500 font-bold uppercase tracking-tight">
              {dayjs().locale("id").format("dddd, D MMM YYYY")}
            </span>
          </div>

          <div className="flex items-center justify-between gap-5 mt-auto">
            {/* Jam Kerja tetap tampil di sisi kiri */}
            <div className="flex-shrink-0">
              <p className="text-[10px] text-gray-400 uppercase font-black tracking-[3px] mb-1">
                Jam Kerja
              </p>
              <h2 className="text-3xl font-black text-custom-gelap tracking-tighter leading-none">
                {shift.mulai} - {shift.selesai}
              </h2>
            </div>

            {/* LOGIKA PENGGANTI TOMBOL */}
            {activeIzin ? (
              /* Tampilan seukuran tombol (h-[52px]) jika ada izin aktif */
              <div className="flex-1 h-[52px] flex flex-col items-center justify-center bg-yellow-50/80 rounded-[22px] border border-blue-100 animate-in fade-in slide-in-from-right-2 duration-500">
                <p className="text-[10px] font-black text-yellow-700 uppercase tracking-widest leading-none">
                  Izin Aktif
                </p>
                <p className="text-[8px] font-bold text-yellow-500 uppercase mt-1 tracking-tighter">
                  {activeIzin.nama_izin} ({activeIzin.status_approval})
                </p>
              </div>
            ) : !presensi.jam_keluar ? (
              /* Tombol Absen Normal */
              <button
                onClick={handleMainAction}
                className="flex-1 bg-gradient-to-r from-custom-merah to-custom-gelap text-white h-[52px] px-4 rounded-[22px] text-xs font-black shadow-lg shadow-custom-merah/30 active:scale-95 transition-all uppercase tracking-widest"
              >
                {!presensi.jam_masuk && "Absen Masuk"}
                {presensi.jam_masuk &&
                  !presensi.istirahat_mulai &&
                  "Mulai Istirahat"}
                {presensi.istirahat_mulai &&
                  !presensi.istirahat_selesai &&
                  "Selesai Istirahat"}
                {presensi.istirahat_selesai && "Absen Pulang"}
              </button>
            ) : (
              /* Pesan Selesai */
              <div className="flex-1 h-[52px] flex flex-col items-center justify-center bg-green-50/50 rounded-[22px] border border-green-100 border-dashed">
                <p className="text-[9px] font-black text-green-700 uppercase tracking-[1px] text-center leading-tight">
                  Terima kasih sudah <br /> bekerja hari ini!
                </p>
              </div>
            )}
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

      {/* 3. Activity Section */}
      <div className="mt-6 px-6 flex-1 overflow-hidden pb-6 flex flex-col">
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="text-[11px] font-black text-custom-gelap uppercase tracking-[2px]">
            Aktivitas Hari Ini
          </h3>
          {presensi.menit_terlambat > 0 && (
            <span className="text-[9px] font-black text-red-700 bg-red-200 px-2 py-1 rounded-lg border border-red-100 animate-pulse">
              Telat: {formatTerlambat(presensi.menit_terlambat)}
            </span>
          )}
        </div>

        <div className="bg-white rounded-[35px] shadow-sm border border-gray-100 p-4 space-y-3 overflow-y-auto">
          <DetailActivityRow
            label="Absensi Masuk"
            time={presensi.jam_masuk}
            location={presensi.lokasi_masuk}
            iconColor="bg-green-500"
            isActive={!!presensi.jam_masuk}
          />

          <div className="grid grid-cols-2 gap-3">
            <CompactActivityBox
              label="Istirahat"
              time={presensi.istirahat_mulai}
              iconColor="bg-orange-400"
              isActive={!!presensi.istirahat_mulai}
            />
            <CompactActivityBox
              label="Kembali"
              time={presensi.istirahat_selesai}
              iconColor="bg-blue-500"
              isActive={!!presensi.istirahat_selesai}
              isLate={presensi.terlambat_istirahat > 0}
              timeLate={presensi.terlambat_istirahat}
              location={presensi.lokasi_balik}
            />
          </div>

          <DetailActivityRow
            label="Absensi Pulang"
            time={presensi.jam_keluar}
            location={presensi.lokasi_keluar}
            iconColor="bg-custom-merah"
            isActive={!!presensi.jam_keluar}
          />
        </div>
      </div>

      <ShiftPickerModal
        isOpen={showShiftModal}
        onClose={() => setShowShiftModal(false)}
        onConfirm={handleConfirmShift} // Dashboard tetap menerima ID yang dipilih untuk diteruskan ke Kamera
      />

      {/* Camera Component */}
      <CameraAttendance
        isOpen={isCameraOpen}
        onClose={() => {
          setIsCameraOpen(false);
          setSelectedShiftId(null);
        }}
        mode={attendanceMode}
        shiftId={selectedShiftId} // Props baru untuk dikirim ke API
        onAttendanceSuccess={() => fetchDashboardData()}
      />

      {/* MODAL KONFIRMASI ISTIRAHAT */}
      {showIstirahatModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-xs rounded-[40px] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-6">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center animate-pulse">
                  <span className="text-3xl">☕</span>
                </div>
              </div>

              <h3 className="text-lg font-black text-custom-gelap uppercase tracking-widest leading-tight">
                Mulai Istirahat?
              </h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2 leading-relaxed">
                Waktu istirahat Anda akan <br /> mulai dicatat sekarang.
              </p>

              <div className="grid grid-cols-2 gap-3 w-full mt-8">
                <button
                  onClick={() => setShowIstirahatModal(false)}
                  className="py-4 bg-gray-50 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition"
                >
                  Batal
                </button>
                <button
                  onClick={confirmIstirahatMulai}
                  className="py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-orange-200 active:scale-95 transition"
                >
                  Ya, Mulai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SIMPLE SPINNER OVERLAY */}
      {loading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4">
            {/* Outer Ring */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-custom-merah/20 rounded-full"></div>
              {/* Spinning Ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-custom-merah rounded-full animate-spin"></div>
            </div>
            <p className="text-[10px] font-black text-custom-gelap uppercase tracking-[3px] animate-pulse">
              Memuat Data...
            </p>
          </div>
        </div>
      )}
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
  <div
    className={`p-4 rounded-[28px] border flex flex-col justify-between transition-all ${
      isActive
        ? "bg-gray-50/50 border-gray-100 shadow-sm"
        : "bg-white border-dashed border-gray-200"
    }`}
  >
    {/* Baris Atas: Label & Badge Terlambat (Sejajar) */}
    <div className="flex items-center justify-between mb-2 gap-2">
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isActive ? iconColor : "bg-gray-200"
          }`}
        />
        <p className="text-[10px] font-black text-gray-400 uppercase leading-none tracking-wider">
          {label}
        </p>
      </div>

      {/* Badge Terlambat pindah ke sini agar sejajar label */}
      {isLate && isActive && (
        <span className="text-[8px] font-black text-red-700 bg-red-200 px-2 py-0.5 rounded-lg uppercase animate-pulse">
          {timeLate} m
        </span>
      )}
    </div>

    {/* Baris Tengah & Bawah: Jam dan Lokasi di sampingnya */}
    <div className="flex items-end justify-between gap-2 mt-auto">
      <div className="flex flex-col">
        <h4
          className={`text-2xl font-black leading-none tracking-tighter ${
            isActive ? "text-custom-gelap" : "text-gray-200"
          }`}
        >
          {time ? time.slice(0, 5) : "--:--"}
        </h4>
      </div>

      {/* Lokasi berada di posisi samping jam (bekas posisi badge terlambat sebelumnya) */}
      <div className="flex-1 flex justify-end">
        {location && isActive && (
          <div className="flex items-center gap-1 text-gray-400 max-w-[80px]">
            <FaLocationDot
              size={8}
              className="text-custom-merah flex-shrink-0"
            />
            <p className="text-[7px] font-bold italic leading-tight break-words line-clamp-2 uppercase">
              {location}
            </p>
          </div>
        )}
      </div>
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

// const StatusRow = ({ label, value, isStatus, statusColor }) => (
//   <div className="flex justify-between items-center text-[10px]">
//     <span className="text-gray-400 font-bold uppercase">{label}</span>
//     <span
//       className={`font-black ${
//         isStatus ? `px-2 py-0.5 rounded-md ${statusColor}` : "text-custom-gelap"
//       }`}
//     >
//       {value}
//     </span>
//   </div>
// );

export default Dashboard;

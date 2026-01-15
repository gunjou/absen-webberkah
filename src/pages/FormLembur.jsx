import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiClock, FiUploadCloud } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/id";
import api from "../Api";
import PrimaryButton from "../components/PrimaryButton";
import LemburHistoryModal from "../components/LemburHistoryModal";

const FormLembur = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(
    dayjs().set("hour", 17).set("minute", 0)
  );
  const [endTime, setEndTime] = useState(
    dayjs().set("hour", 19).set("minute", 0)
  );
  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [listJenisLembur, setListJenisLembur] = useState([]);
  const [type, setType] = useState("");
  const [showLemburModal, setShowLemburModal] = useState(false);
  const [activeLembur, setActiveLembur] = useState(null);
  const [isChecking, setIsChecking] = useState(true);

  // 1. Fetch Master Jenis Lembur
  useEffect(() => {
    const fetchMasterLembur = async () => {
      try {
        setIsChecking(true);
        const res = await api.get("/master/jenis-lembur");
        setListJenisLembur(res.data.data);
      } catch (err) {
        console.error("Gagal load master lembur", err);
      }
      setIsChecking(false);
    };
    fetchMasterLembur();
  }, []);

  useEffect(() => {
    const checkActiveLembur = async () => {
      try {
        setIsChecking(true);
        // Mengambil status lembur aktif hari ini
        const res = await api.get("/lembur/aktif");
        if (res.data.data && res.data.data.length > 0) {
          setActiveLembur(res.data.data[0]);
        }
      } catch (err) {
        console.error("Gagal cek lembur aktif", err);
      } finally {
        setIsChecking(false);
      }
    };
    checkActiveLembur();
  }, []);

  const hasActiveLembur = !!activeLembur;

  const hitungDurasi = () => {
    if (!startTime || !endTime) return "0";
    const diff = endTime.diff(startTime, "hour", true);
    return diff > 0 ? diff.toFixed(1) : "0";
  };

  // 2. Handle Submit sesuai Payload API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (parseFloat(hitungDurasi()) <= 0) {
      return alert("Waktu selesai harus lebih besar dari waktu mulai!");
    }

    setIsLoading(true);

    // Menggunakan FormData jika ada lampiran file
    const formData = new FormData();
    formData.append("id_jenis_lembur", type);
    formData.append("tanggal", date.format("YYYY-MM-DD"));
    formData.append("jam_mulai", startTime.format("HH:mm"));
    formData.append("jam_selesai", endTime.format("HH:mm"));
    formData.append("keterangan", reason);
    if (attachment) formData.append("lampiran", attachment);

    try {
      const res = await api.post("/lembur/pengajuan-lembur", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("Pengajuan lembur berhasil!");
        navigate("/dashboard");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengirim pengajuan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] bg-gray-50 font-poppins flex flex-col overflow-hidden">
      {/* 1. Header Section */}
      <div className="relative bg-gradient-to-br from-custom-merah to-custom-gelap h-40 rounded-b-[45px] p-6 pt-2 shadow-xl flex-shrink-0 z-0">
        <div className="flex justify-between items-start mt-1">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl text-white active:scale-95 transition shadow-lg"
          >
            <FiArrowLeft size={22} />
          </button>
          <button
            onClick={() => setShowLemburModal(true)}
            className="bg-white/20 text-white text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest border border-white/10 shadow-lg"
          >
            Riwayat
          </button>
        </div>
        <div className="mt-2">
          <h1 className="text-xl font-black text-white uppercase tracking-widest leading-none">
            Form Lembur
          </h1>
          <p className="text-white/60 text-[9px] font-bold uppercase tracking-[2px] mt-1.5">
            Pengajuan Overtime
          </p>
        </div>

        {/* 2. Floating Info Card - Konsisten & Dinamis */}
        <div className="absolute -bottom-10 left-6 right-6 bg-white rounded-[30px] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] p-4 border border-gray-50 flex items-center justify-center z-10 min-h-[85px]">
          {hasActiveLembur ? (
            <div className="flex flex-col items-center justify-center animate-in fade-in zoom-in duration-500 text-center">
              <p className="text-[10px] text-custom-merah font-black uppercase tracking-[2px] mb-2">
                Lembur Sedang Berjalan
              </p>

              <div className="flex items-center gap-3">
                {/* Kolom Kiri: Badge Status */}
                <div className="flex items-center gap-2 bg-orange-50 px-4 py-1.5 rounded-full border border-orange-100 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse shadow-[0_0_8px_rgba(249,115,22,0.4)]" />
                  <p className="text-[11px] font-black text-orange-700 uppercase tracking-tighter">
                    {activeLembur.nama_lembur} • {activeLembur.status_approval}
                  </p>
                </div>

                {/* Kolom Kanan: Detail Tanggal & Jam */}
                <div className="flex flex-col items-start text-left border-l border-gray-100 pl-3">
                  <p className="text-[9px] font-black text-custom-gelap uppercase tracking-tighter leading-none">
                    {dayjs(activeLembur.tanggal).format("DD MMM YYYY")}
                  </p>
                  <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                    {activeLembur.jam_mulai} - {activeLembur.jam_selesai}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Tampilan Estimasi Normal
            <div className="flex flex-col items-center">
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                Estimasi Durasi Lembur
              </p>
              <p className="text-xl font-black text-custom-merah leading-none">
                {hitungDurasi()}{" "}
                <span className="text-[12px] opacity-60 font-bold ml-0.5">
                  JAM
                </span>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 3. Form Content */}
      <form
        onSubmit={handleSubmit}
        className="mt-14 px-6 flex-1 flex flex-col gap-4 pb-6 overflow-y-auto"
      >
        <div
          className={`bg-white rounded-[40px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 space-y-5 relative ${
            hasActiveLembur ? "pointer-events-none" : ""
          }`}
        >
          {/* Overlay Pesan Jika Terkunci */}
          {hasActiveLembur && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-white/20 backdrop-blur-[1px] rounded-[40px]">
              <div className="bg-custom-merah/10 p-4 rounded-full mb-3 text-custom-merah">
                <FiClock size={32} />
              </div>
              <h4 className="text-sm font-black text-custom-gelap uppercase tracking-widest">
                Form Terkunci
              </h4>
              <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase leading-relaxed">
                Anda memiliki pengajuan lembur <br /> yang sedang diproses hari
                ini.
              </p>
            </div>
          )}
          {/* FIELD BARU: Kategori Lembur */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-4 tracking-[1.5px] flex items-center gap-1">
              Jenis Lembur <span className="text-custom-merah text-xs">*</span>
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-[22px] py-4 px-6 text-sm font-black text-custom-gelap outline-none focus:border-custom-merah/40 focus:bg-white transition-all appearance-none shadow-sm"
                required
              >
                <option value="">Pilih Kategori Lembur</option>
                {listJenisLembur.map((item) => (
                  <option
                    key={item.id_jenis_lembur}
                    value={item.id_jenis_lembur}
                  >
                    {item.nama_jenis}
                  </option>
                ))}
              </select>
              <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
          {/* Tanggal Lembur - FULL WIDTH & TALL */}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase ml-4 tracking-[1.5px] flex items-center gap-1">
                Tanggal Lembur{" "}
                <span className="text-custom-merah text-xs">*</span>
              </label>
              <DatePicker
                value={date}
                onChange={(v) => setDate(v)}
                format="DD-MM-YYYY"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "standard",
                    InputProps: { disableUnderline: true },
                    // py-5 untuk membuat field sangat tinggi dan lega
                    className:
                      "bg-gray-50 py-5 px-6 rounded-[25px] border-2 border-gray-100 font-black text-sm shadow-sm focus-within:border-custom-merah/40 focus-within:bg-white transition-all text-center",
                  },
                }}
              />
            </div>

            {/* Jam Grid - TALL & BIG FONT */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-4 tracking-[1.5px] flex items-center gap-1">
                  Jam Mulai <span className="text-custom-merah text-xs">*</span>
                </label>
                <TimePicker
                  value={startTime}
                  onChange={(v) => setStartTime(v)}
                  ampm={false}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "standard",
                      InputProps: { disableUnderline: true },
                      // py-5 dan text-center untuk visibilitas maksimal
                      className:
                        "bg-gray-50 py-5 px-4 rounded-[22px] border-2 border-gray-100 font-black text-base text-center shadow-sm focus-within:border-custom-merah/40 focus-within:bg-white transition-all",
                    },
                  }}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-4 tracking-[1.5px] flex items-center gap-1">
                  Jam Selesai{" "}
                  <span className="text-custom-merah text-xs">*</span>
                </label>
                <TimePicker
                  value={endTime}
                  onChange={(v) => setEndTime(v)}
                  ampm={false}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "standard",
                      InputProps: { disableUnderline: true },
                      className:
                        "bg-gray-50 py-5 px-4 rounded-[22px] border-2 border-gray-100 font-black text-base text-center shadow-sm focus-within:border-custom-merah/40 focus-within:bg-white transition-all",
                    },
                  }}
                />
              </div>
            </div>
          </LocalizationProvider>

          {/* Alasan - Tetap Bold tapi Lebih Ringkas secara Vertikal */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-4 tracking-[1.5px] flex items-center gap-1">
              Detail Pekerjaan{" "}
              <span className="text-custom-merah text-xs">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-[25px] py-3 px-6 text-sm font-bold text-custom-gelap outline-none focus:border-custom-merah/40 focus:bg-white transition-all shadow-sm placeholder:text-gray-300"
              placeholder="Apa yang dikerjakan?"
              rows="2"
              required
            />
          </div>

          {/* Lampiran - Slim Horizontal Style */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-4 tracking-[1.5px]">
              Lampiran{" "}
              <span className="text-gray-400 text-[8px] ml-1">(OPSIONAL)</span>
            </label>
            <label
              htmlFor="file-upload"
              className={`flex items-center gap-4 py-4 px-6 border-2 border-dashed rounded-[22px] cursor-pointer transition-all ${
                attachment
                  ? "border-green-500 bg-green-50 text-green-600 shadow-inner"
                  : "border-gray-100 bg-gray-50 text-gray-400 shadow-sm"
              }`}
            >
              <FiUploadCloud size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest truncate">
                {attachment ? attachment.name : "Pilih Bukti"}
              </span>
            </label>
            <input
              type="file"
              id="file-upload"
              className="hidden"
              onChange={(e) => setAttachment(e.target.files[0])}
              accept="image/*,application/pdf"
            />
          </div>
        </div>

        {/* Button Action */}
        <div className="mt-auto">
          {!hasActiveLembur ? (
            <PrimaryButton type="submit" isLoading={isLoading}>
              Kirim Pengajuan Lembur
            </PrimaryButton>
          ) : (
            <button
              disabled
              className="w-full py-5 rounded-[25px] bg-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-[3px] cursor-not-allowed border border-gray-200"
            >
              Sudah Ada Lembur Aktif
            </button>
          )}
        </div>
      </form>

      {/* Modal Riwayat Lembur */}
      <LemburHistoryModal
        isOpen={showLemburModal}
        onClose={() => setShowLemburModal(false)}
      />

      {isChecking && (
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

export default FormLembur;

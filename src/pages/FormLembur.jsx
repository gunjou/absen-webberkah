import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiClock, FiUploadCloud, FiInfo } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { IoMdClose } from "react-icons/io";
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
  const [sudahApproved, setSudahApproved] = useState(false);
  const [showLemburModal, setShowLemburModal] = useState(false);

  // Kalkulasi durasi lembur secara otomatis
  const hitungDurasi = () => {
    if (!startTime || !endTime) return "0";
    const diff = endTime.diff(startTime, "hour", true);
    return diff > 0 ? diff.toFixed(1) : "0";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hitungDurasi() <= 0)
      return alert("Waktu selesai harus lebih besar dari waktu mulai!");

    setIsLoading(true);
    // Logika API handleSubmit Anda tetap sama...
    setTimeout(() => {
      setIsLoading(false);
      navigate("/dashboard");
    }, 500);
  };

  const dummyLembur = [
    {
      status: "approved",
      tanggal: "2026-01-02",
      tugas: "Update Database Server Baru",
      durasi: "3",
      upah: "150.000",
      id_lembur: "LMB-001",
    },
    {
      status: "pending",
      tanggal: "2026-01-04",
      tugas: "Revisi Desain Dashboard Pegawai",
      durasi: "2",
      upah: "100.000",
      id_lembur: "LMB-002",
    },
    {
      status: "rejected",
      tanggal: "2026-01-01",
      tugas: "Packing Barang Inventaris",
      durasi: "4",
      upah: "200.000",
      alasan: "Tidak ada instruksi lembur dari atasan pada tanggal merah.",
      id_lembur: "LMB-003",
    },
  ];

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

        {/* 2. Floating Info Card - Durasi Lembur */}
        <div className="absolute -bottom-10 left-6 right-6 bg-white rounded-[30px] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] p-5 border border-gray-50 flex items-center justify-center z-10">
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
        </div>
      </div>

      {/* 3. Form Content */}
      {/* 3. Form Content - Focus on Large Date & Time Inputs */}
      <form
        onSubmit={handleSubmit}
        className="mt-14 px-6 flex-1 flex flex-col gap-4 pb-6 overflow-y-auto"
      >
        <div className="bg-white rounded-[40px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 space-y-5">
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
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-[25px] py-4 px-6 text-sm font-bold text-custom-gelap outline-none focus:border-custom-merah/40 focus:bg-white transition-all shadow-sm placeholder:text-gray-300"
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

        {/* Button Tetap Besar di Bawah */}
        <div className="mt-auto">
          {sudahApproved ? (
            <p className="text-center text-red-600 text-[10px] font-bold mb-3 uppercase tracking-wider bg-red-50 py-2 rounded-xl border border-red-100 animate-pulse">
              Pengajuan tanggal ini sudah disetujui
            </p>
          ) : (
            <PrimaryButton type="submit" isLoading={isLoading}>
              Kirim Pengajuan Lembur
            </PrimaryButton>
          )}
        </div>
      </form>

      {/* Modal Riwayat Lembur */}
      <LemburHistoryModal
        isOpen={showLemburModal}
        onClose={() => setShowLemburModal(false)}
        data={dummyLembur}
      />
    </div>
  );
};

export default FormLembur;

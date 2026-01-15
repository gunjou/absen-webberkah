import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiCalendar, FiUploadCloud } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/id";
import PrimaryButton from "../components/PrimaryButton";
import IzinHistoryModal from "../components/IzinHistoryModal";
import Api from "../Api";

const FormIzinSakit = () => {
  const navigate = useNavigate();
  const [listJenisIzin, setListJenisIzin] = useState([]);
  const [date, setDate] = useState(dayjs());
  const [endDate, setEndDate] = useState(dayjs());
  const [reason, setReason] = useState("");
  const [type, setType] = useState("");
  const [attachment, setAttachment] = useState(null);

  const [activeIzin, setActiveIzin] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [showIzinModal, setShowIzinModal] = useState(false);
  //   const [historyData, setHistoryData] = useState([]);

  const totalHari = endDate.diff(date, "day") + 1;

  // Fetch Izin Aktif Hari Ini
  useEffect(() => {
    const checkActiveIzin = async () => {
      try {
        setIsLoading(true);
        const today = dayjs().format("YYYY-MM-DD");
        const res = await Api.get(`/perizinan/aktif?tanggal=${today}`);

        // Jika data array tidak kosong, berarti ada izin aktif
        if (res.data.data && res.data.data.length > 0) {
          setActiveIzin(res.data.data[0]);
        }
      } catch (err) {
        console.error("Gagal cek izin aktif", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkActiveIzin();
  }, []);

  // 1. Ambil Data Master Jenis Izin
  useEffect(() => {
    const fetchMasterIzin = async () => {
      try {
        const res = await Api.get("/master/jenis-izin");
        setListJenisIzin(res.data.data);
      } catch (err) {
        console.error("Gagal memuat master izin", err);
      }
    };
    fetchMasterIzin();
  }, []);

  // 2. Handle Submit dengan FormData
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!attachment) {
      alert("Harap unggah dokumen lampiran");
      return;
    }

    setIsLoading(true);

    const formData = new FormData();
    formData.append("id_jenis_izin", type);
    formData.append("tanggal_mulai", date.format("YYYY-MM-DD"));
    formData.append("tanggal_selesai", endDate.format("YYYY-MM-DD"));
    formData.append("alasan", reason);
    formData.append("lampiran", attachment);

    try {
      const res = await Api.post("/perizinan/pengajuan-izin", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert("Pengajuan berhasil terkirim!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal mengirim pengajuan");
    } finally {
      setIsLoading(false);
    }
  };

  const hasActiveIzin = !!activeIzin;

  return (
    <div className="h-[100dvh] bg-gray-50 font-poppins flex flex-col overflow-hidden">
      {/* 1. Header Section - Diperbesar kembali (h-48) */}
      <div className="relative bg-gradient-to-br from-custom-merah to-custom-gelap h-40 rounded-b-[45px] p-6 pt-2 shadow-xl flex-shrink-0 z-0">
        <div className="flex justify-between items-start mt-1">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl text-white active:scale-95 transition shadow-lg"
          >
            <FiArrowLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => setShowIzinModal(true)}
            className="bg-white/20 text-white text-[10px] font-black px-5 py-2.5 rounded-xl uppercase tracking-widest border border-white/10 shadow-lg active:scale-95 transition-all"
          >
            Riwayat
          </button>
        </div>
        <div className="mt-2">
          <h1 className="text-xl font-black text-white uppercase tracking-widest leading-none">
            Form Izin & Sakit
          </h1>
          <p className="text-white/60 text-[9px] font-bold uppercase tracking-[2px] mt-1.5">
            Pengajuan Pegawai
          </p>
        </div>

        {/* 2. Floating Info Card - Dinamis berdasarkan status izin */}
        <div className="absolute -bottom-10 left-6 right-6 bg-white rounded-[30px] shadow-[0_15px_40px_-10px_rgba(0,0,0,0.15)] p-5 border border-gray-50 flex items-center justify-between divide-x divide-gray-100 z-10">
          {hasActiveIzin ? (
            // Tampilan Jika Sudah Ada Izin Aktif
            <div className="flex-1 flex flex-col items-center px-2 animate-in fade-in duration-500">
              <p className="text-[10px] text-custom-merah font-black uppercase tracking-[2px]">
                Status Pengajuan Anda
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`w-2 h-2 rounded-full animate-pulse ${
                    activeIzin.status_approval === "pending"
                      ? "bg-orange-500"
                      : "bg-green-500"
                  }`}
                />
                <p className="text-sm font-black text-custom-gelap uppercase tracking-[1px]">
                  {activeIzin.nama_izin} ({activeIzin.status_approval})
                </p>
              </div>
              <p className="text-[9px] font-bold text-gray-400 mt-1 italic uppercase leading-none">
                {dayjs(activeIzin.tgl_mulai).format("DD MMM")} -{" "}
                {dayjs(activeIzin.tgl_selesai).format("DD MMM YYYY")}
              </p>
            </div>
          ) : (
            // Tampilan Normal (Sisa Cuti & Durasi)
            <>
              <div className="flex-1 flex flex-col items-center">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">
                  Sisa Cuti
                </p>
                <p className="text-xl font-black text-custom-gelap leading-none">
                  12{" "}
                  <span className="text-[12px] text-gray-400 font-bold ml-0.5">
                    HARI
                  </span>
                </p>
              </div>
              <div className="flex-1 flex flex-col items-center pl-2">
                <p className="text-[10px] text-custom-merah font-black uppercase tracking-widest mb-1">
                  Durasi Izin
                </p>
                <p className="text-xl font-black text-custom-merah leading-none">
                  {totalHari > 0 ? totalHari : 0}{" "}
                  <span className="text-[12px] opacity-60 font-bold ml-0.5">
                    HARI
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. Form Content */}
      <form
        onSubmit={handleSubmit}
        className={`mt-14 px-6 flex-1 flex flex-col gap-4 pb-6 overflow-y-auto transition-all duration-500 ${
          hasActiveIzin ? "opacity-60 grayscale-[0.5]" : ""
        }`}
      >
        <div
          className={`bg-white rounded-[40px] p-6 pb-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 space-y-4 relative ${
            hasActiveIzin ? "pointer-events-none" : ""
          }`}
        >
          {/* Overlay Pesan Jika Terkunci */}
          {hasActiveIzin && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-center bg-white/10 backdrop-blur-sm rounded-[40px]">
              <div className="bg-custom-merah/10 p-4 rounded-full mb-3 text-custom-merah">
                <FiCalendar size={32} />
              </div>
              <h4 className="text-sm font-black text-custom-gelap uppercase tracking-widest">
                Akses Terkunci
              </h4>
              <p className="text-[10px] font-bold text-gray-500 mt-2 uppercase leading-relaxed">
                Anda sudah memiliki pengajuan {activeIzin.nama_izin} <br /> yang
                sedang aktif hari ini.
              </p>
            </div>
          )}
          {/* Mapping Kategori Izin dari API */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-3 tracking-[1.5px] flex items-center gap-1">
              Kategori Izin <span className="text-custom-merah text-xs">*</span>
            </label>
            <div className="relative">
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-[20px] py-4 px-5 text-sm font-bold text-custom-gelap outline-none focus:border-custom-merah/40 focus:bg-white transition-all appearance-none shadow-sm"
                required
              >
                <option value="">Pilih Jenis</option>
                {listJenisIzin.map((item) => (
                  <option key={item.id_jenis_izin} value={item.id_jenis_izin}>
                    {item.nama_izin}
                  </option>
                ))}
              </select>
              {/* Icon Arrow */}
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
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

          {/* Tanggal Grid */}
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="id">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-3 tracking-[1.5px] flex items-center gap-1">
                  Mulai <span className="text-custom-merah text-xs">*</span>
                </label>
                <DatePicker
                  value={date}
                  onChange={(v) => setDate(v)}
                  format="DD-MM-YYYY" // Format Indonesia
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "standard",
                      InputProps: { disableUnderline: true },
                      className:
                        "bg-gray-50 py-3 px-4 rounded-[18px] border-2 border-gray-100 font-black text-xs text-center shadow-sm focus-within:border-custom-merah/40 focus-within:bg-white transition-all",
                    },
                  }}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-3 tracking-[1.5px] flex items-center gap-1">
                  Selesai <span className="text-custom-merah text-xs">*</span>
                </label>
                <DatePicker
                  value={endDate}
                  onChange={(v) => setEndDate(v)}
                  minDate={date}
                  format="DD-MM-YYYY" // Format Indonesia
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "standard",
                      InputProps: { disableUnderline: true },
                      className:
                        "bg-gray-50 py-3 px-4 rounded-[18px] border-2 border-gray-100 font-black text-xs text-center shadow-sm focus-within:border-custom-merah/40 focus-within:bg-white transition-all",
                    },
                  }}
                />
              </div>
            </div>
          </LocalizationProvider>

          {/* Alasan */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-3 tracking-[1.5px] flex items-center gap-1">
              Alasan Pengajuan{" "}
              <span className="text-custom-merah text-xs">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-[22px] py-3.5 px-5 text-sm font-bold text-custom-gelap outline-none focus:border-custom-merah/40 focus:bg-white transition-all shadow-sm placeholder:text-gray-300 placeholder:font-medium"
              placeholder="Tulis alasan singkat..."
              rows="2"
              required
            />
          </div>

          {/* Lampiran */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-500 uppercase ml-3 tracking-[1.5px] flex items-center gap-1">
              Unggah Dokumen{" "}
              <span className="text-custom-merah text-xs">*</span>
            </label>
            <label
              htmlFor="file-upload"
              className={`flex items-center gap-4 py-3.5 px-5 border-2 border-dashed rounded-[20px] cursor-pointer transition-all ${
                attachment
                  ? "border-green-500 bg-green-50 text-green-600 shadow-inner"
                  : "border-gray-200 bg-gray-50 text-gray-400 hover:border-custom-merah/30 shadow-sm"
              }`}
            >
              <FiUploadCloud
                size={22}
                className={attachment ? "text-green-500" : "text-gray-400"}
              />
              <span className="text-[10px] font-black uppercase tracking-widest truncate">
                {attachment ? attachment.name : "Pilih File (JPG/PDF)"}
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

        {/* Button hanya muncul/aktif jika tidak ada izin aktif */}
        {!hasActiveIzin ? (
          <PrimaryButton type="submit" isLoading={isLoading}>
            Kirim Pengajuan
          </PrimaryButton>
        ) : (
          <button
            disabled
            className="w-full py-5 rounded-[25px] bg-gray-100 text-gray-400 font-black text-[10px] uppercase tracking-[3px] cursor-not-allowed"
          >
            Sudah Ada Izin Aktif
          </button>
        )}
      </form>

      {/* Modal Riwayat Izin */}
      <IzinHistoryModal
        isOpen={showIzinModal}
        onClose={() => setShowIzinModal(false)}
      />

      {isLoading && (
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

export default FormIzinSakit;

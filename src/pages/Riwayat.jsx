import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiClock, FiCalendar, FiActivity } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

// Dayjs Imports & Plugins
import dayjs from "dayjs";
import "dayjs/locale/id";
import localeData from "dayjs/plugin/localeData";
import Api from "../Api";
import { formatTerlambat } from "../utils/Helper";

dayjs.extend(localeData);
dayjs.locale("id");

const Riwayat = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [detailData, setDetailData] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [summaryData, setSummaryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  // Fungsi fetch detail (Tab 0) dengan parameter tanggal
  const fetchDailyDetail = async (date) => {
    setIsLoading(true);
    try {
      // Format tanggal ke YYYY-MM-DD sesuai keinginan backend
      const formattedDate = date.format("YYYY-MM-DD");
      const res = await Api.get(
        `/absensi/detail-basic?tanggal=${formattedDate}`,
      );
      setDetailData(res.data.data);
    } catch (err) {
      console.error("Gagal mengambil detail harian:", err);
      setDetailData(null); // Reset data jika error
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger fetch saat Tab 0 aktif ATAU Tanggal berubah
  useEffect(() => {
    if (activeTab === 0) {
      fetchDailyDetail(tanggalAbsensi);
    }
  }, [activeTab, tanggalAbsensi]);

  const fetchAttendanceList = async () => {
    setIsLoading(true);
    try {
      // Sesuai CURL: ?bulan=1&tahun=2026
      const res = await Api.get(`/absensi/list-basic`, {
        params: {
          bulan: bulan, // Mengambil state bulan (1-12)
          tahun: tahun, // Mengambil state tahun
        },
      });

      setAttendanceList(res.data.data.kehadiran || []);
    } catch (err) {
      console.error("Gagal load list kehadiran", err);
      setAttendanceList([]);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect tetap sama, memantau perubahan tab dan filter
  useEffect(() => {
    if (activeTab === 1) {
      fetchAttendanceList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, bulan, tahun]);

  const fetchSummaryData = async () => {
    setIsLoading(true);
    try {
      const res = await Api.get(`/absensi/rekap-basic`, {
        params: { bulan, tahun },
      });
      setSummaryData(res.data.data.rekap);
    } catch (err) {
      console.error("Gagal load rekap", err);
      setSummaryData(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Panggil fetch saat tab rekap aktif atau filter berubah
  useEffect(() => {
    if (activeTab === 2) fetchSummaryData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, bulan, tahun]);

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
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 grid grid-cols-2 gap-3 animate-in fade-in duration-300">
            <div className="relative">
              <select
                value={bulan}
                onChange={(e) => setBulan(Number(e.target.value))}
                className="w-full bg-gray-50 p-3 rounded-xl font-black text-[11px] text-custom-gelap outline-none border-none shadow-inner appearance-none text-center"
              >
                {listBulan.map((m, i) => (
                  <option key={i} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div className="relative">
              <select
                value={tahun}
                onChange={(e) => setTahun(Number(e.target.value))}
                className="w-full bg-gray-50 p-3 rounded-xl font-black text-[11px] text-custom-gelap outline-none border-none shadow-inner appearance-none text-center"
              >
                {listTahun.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* 4. Content Area */}
      <div className="mt-4 px-6 flex-1 overflow-y-auto pb-10 custom-scrollbar">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-500 ease-out">
          {/* Tampilkan Detail Harian hanya jika tab 0 aktif */}
          {activeTab === 0 && (
            <DailyDetailContent detail={detailData} loading={isLoading} />
          )}
          {/* Tab 1: Kehadiran (Pastikan props 'data' diisi) */}
          {activeTab === 1 && (
            <AttendanceListContent data={attendanceList} loading={isLoading} />
          )}
          {activeTab === 2 && (
            <SummaryHistoryContent data={summaryData} loading={isLoading} />
          )}
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---

// 1. DETAIL HARIAN (TAB 0)
const DailyDetailContent = ({ detail, loading }) => {
  if (loading)
    return (
      <div className="p-10 text-center animate-pulse uppercase font-black text-gray-300 text-[10px] tracking-widest">
        Memuat Detail...
      </div>
    );
  if (!detail || !detail.presensi)
    return (
      <div className="p-10 text-center text-gray-400 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
        Data absensi tidak ditemukan <br /> pada tanggal ini
      </div>
    );

  const { presensi } = detail;
  const istirahat = presensi?.istirahat?.[0] || null;

  // Fungsi Helper untuk format durasi menit ke Jam & Menit
  const formatDuration = (totalMenit) => {
    if (!totalMenit) return "0m";
    const jam = Math.floor(totalMenit / 60);
    const menit = totalMenit % 60;
    return jam > 0 ? `${jam}j ${menit}m` : `${menit}m`;
  };

  return (
    <div className="bg-white rounded-[40px] p-7 shadow-sm border border-gray-100 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 1. Dashboard Stats Mini */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-3xl">
          <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest mb-1">
            Total Kerja
          </p>
          <h5 className="text-xl font-black text-custom-gelap tracking-tight">
            {formatDuration(presensi.total_menit_kerja)}
          </h5>
        </div>
        <div className="bg-orange-50/50 border border-orange-100 p-4 rounded-3xl">
          <p className="text-[8px] font-black text-orange-600 uppercase tracking-widest mb-1">
            Istirahat
          </p>
          <h5 className="text-xl font-black text-custom-gelap tracking-tight">
            {formatDuration(istirahat?.durasi_menit)}
          </h5>
        </div>
      </div>

      {/* 2. Timeline Activity */}
      <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[7px] before:-z-10 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-green-500 before:via-orange-400 before:to-custom-merah before:opacity-10">
        {/* TITIK MASUK */}
        <ActivityTimelineItem
          label="Check-In"
          time={presensi.jam_masuk}
          location={presensi.lokasi_masuk}
          color="bg-green-500 shadow-green-100"
          isLate={presensi.menit_terlambat > 0}
          lateTime={presensi.menit_terlambat}
        />

        {/* TITIK ISTIRAHAT MULAI */}
        {istirahat?.jam_mulai && (
          <ActivityTimelineItem
            label="Istirahat"
            time={istirahat.jam_mulai}
            color="bg-orange-400 shadow-orange-100"
          />
        )}

        {/* TITIK KEMBALI ISTIRAHAT */}
        {istirahat?.jam_selesai && (
          <ActivityTimelineItem
            label="Kembali"
            time={istirahat.jam_selesai}
            location={istirahat.lokasi_balik}
            color="bg-blue-500 shadow-blue-100"
            isLate={istirahat.terlambat_istirahat > 0}
            lateTime={istirahat.terlambat_istirahat}
          />
        )}

        {/* TITIK PULANG */}
        <ActivityTimelineItem
          label="Check-Out"
          time={presensi.jam_keluar}
          location={presensi.lokasi_keluar}
          color="bg-custom-merah shadow-red-100"
        />
      </div>

      {/* 3. Footer Info */}
      <div className="pt-4 border-t border-gray-50 flex items-center justify-between opacity-50">
        <div className="flex items-center gap-2">
          <FiActivity size={12} />
          <p className="text-[8px] font-bold uppercase tracking-widest">
            Data Terverifikasi
          </p>
        </div>
        <p className="text-[8px] font-bold">{detail.tanggal}</p>
      </div>
    </div>
  );
};

// Sub-komponen Activity Item
const ActivityTimelineItem = ({
  label,
  time,
  location,
  color,
  isLate,
  lateTime,
}) => (
  <div className="relative flex items-start gap-5">
    {/* Dot Indikator dengan Ring */}
    <div
      className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 border-4 border-white shadow-lg ${
        time ? color : "bg-gray-200 shadow-none"
      }`}
    />

    <div className="flex-1 flex flex-col -mt-1">
      <div className="flex justify-between items-center mb-0.5">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">
          {label}
        </p>
        {isLate && (
          <span className="text-[7px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded border border-red-100 uppercase">
            {formatTerlambat(lateTime)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <h4
          className={`text-xl font-black tracking-tighter ${
            time ? "text-custom-gelap" : "text-gray-200"
          }`}
        >
          {time ? time.slice(0, 5) : "--:--"}
        </h4>

        {location && (
          <div className="flex items-center gap-1 overflow-hidden">
            <div className="w-1 h-1 rounded-full bg-custom-merah" />
            <p className="text-[9px] font-bold text-gray-400 truncate uppercase tracking-tighter">
              {location}
            </p>
          </div>
        )}
      </div>
    </div>
  </div>
);

// 2. DAFTAR KEHADIRAN TIAP HARI (TAB 1)
const AttendanceListContent = ({ data, loading }) => {
  if (loading)
    return (
      <div className="py-10 text-center animate-pulse text-[10px] font-black text-gray-300 uppercase tracking-widest">
        Menyusun Riwayat...
      </div>
    );

  if (!data || data.length === 0)
    return (
      <div className="py-10 text-center text-gray-400 text-[10px] uppercase font-bold">
        Data tidak ditemukan
      </div>
    );

  return (
    <div className="space-y-4 pb-10">
      {data.map((item, i) => {
        const isFuture = dayjs(item.tanggal).isAfter(dayjs(), "day");
        const hasPresensi = !!item.presensi;
        const isCheckOut = !!item.presensi?.jam_keluar;

        // Logika Status Hari
        const isMinggu = item.hari?.is_minggu;
        const isLibur = item.hari?.is_libur;
        const isOffDay = isMinggu || isLibur;
        const keteranganHari = item.hari?.keterangan || "Hari Kerja";
        const hariText = dayjs(item.tanggal).locale("id").format("dddd");

        // Konfigurasi Warna Card Berdasarkan Jenis Hari
        let cardBgColor = "bg-white border-gray-100";
        if (isOffDay) {
          if (isMinggu)
            cardBgColor = "bg-blue-100/40 border-blue-100 border-dashed"; // Soft Orange untuk Minggu
          if (isLibur)
            cardBgColor = "bg-blue-100/40 border-blue-100 border-dashed"; // Soft Blue untuk Libur Nasional
        }

        // Data Stats
        const terlambat = item.presensi?.menit_terlambat || 0;
        const istirahat = item.presensi?.total_menit_istirahat || 0;
        const totalKerja = item.presensi?.total_menit_kerja || 0;

        return (
          <div
            key={i}
            className={`rounded-[35px] p-5 shadow-sm border transition-all ${cardBgColor} ${
              isFuture ? "opacity-30 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* Kalender Mini */}
                <div className="flex flex-col items-center">
                  <p
                    className={`text-[7px] font-black uppercase mb-1 tracking-tighter ${isOffDay ? "text-custom-merah" : "text-gray-400"}`}
                  >
                    {hariText}
                  </p>
                  <div
                    className={`w-12 h-14 rounded-2xl flex flex-col items-center justify-center border transition-colors ${
                      hasPresensi
                        ? "bg-custom-merah border-custom-merah shadow-lg shadow-red-100"
                        : isOffDay
                          ? "bg-white border-gray-200"
                          : "bg-gray-50 border-gray-100"
                    }`}
                  >
                    <span
                      className={`text-[8px] font-black uppercase leading-none ${hasPresensi ? "text-white/70" : "text-gray-400"}`}
                    >
                      {dayjs(item.tanggal).format("MMM")}
                    </span>
                    <span
                      className={`text-lg font-black leading-none mt-1 ${hasPresensi ? "text-white" : "text-custom-gelap"}`}
                    >
                      {dayjs(item.tanggal).format("DD")}
                    </span>
                  </div>
                </div>

                {/* Info Utama */}
                <div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {/* DAFTAR BADGE: Mendahulukan Keterangan Hari */}
                    {isOffDay && (
                      <span
                        className={`text-[7px] font-black px-2 py-0.5 rounded uppercase border ${
                          isMinggu
                            ? "bg-blue-100 text-blue-600 border-blue-200"
                            : "bg-blue-100 text-blue-600 border-blue-200"
                        }`}
                      >
                        {keteranganHari}
                      </span>
                    )}

                    {hasPresensi ? (
                      <span
                        className={`text-[7px] font-black px-2 py-0.5 rounded uppercase ${isCheckOut ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"}`}
                      >
                        {isCheckOut ? "Hadir" : "Aktif"}
                      </span>
                    ) : (
                      !isOffDay &&
                      !isFuture && (
                        <span className="text-[7px] font-black bg-red-50 text-red-500 px-2 py-0.5 rounded uppercase border border-red-100">
                          Alpha
                        </span>
                      )
                    )}
                  </div>

                  <h4 className="text-xs font-black text-custom-gelap uppercase tracking-tighter mt-1.5">
                    {item.jam_kerja.jam_mulai} - {item.jam_kerja.jam_selesai}
                  </h4>

                  {/* Jam Masuk & Keluar Real */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded-lg border border-gray-100">
                      <FiClock
                        size={10}
                        className={
                          hasPresensi ? "text-green-500" : "text-gray-300"
                        }
                      />
                      <p className="text-[10px] font-black text-custom-gelap tracking-tight">
                        {item.presensi?.jam_masuk || "--:--"}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/50 px-2 py-1 rounded-lg border border-gray-100">
                      <FiArrowLeft
                        size={10}
                        className={`rotate-180 ${isCheckOut ? "text-red-500" : "text-gray-300"}`}
                      />
                      <p className="text-[10px] font-black text-custom-gelap tracking-tight">
                        {item.presensi?.jam_keluar || "--:--"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="flex flex-col items-end gap-2 min-w-[80px]">
                <div className="text-right">
                  <p className="text-[7px] font-black text-gray-300 uppercase leading-none mb-1.5">
                    Total Kerja
                  </p>
                  <p
                    className={`text-[13px] font-black leading-none ${totalKerja > 0 ? "text-custom-gelap" : "text-gray-200"}`}
                  >
                    {totalKerja}{" "}
                    <span className="text-[8px] text-gray-400 font-bold">
                      Min
                    </span>
                  </p>
                </div>

                <div className="flex gap-1 justify-end">
                  {terlambat > 0 && (
                    <div className="bg-orange-50 text-orange-600 text-[6.5px] font-black px-1.5 py-0.5 rounded-md border border-orange-100 uppercase flex items-center gap-0.5">
                      T: {terlambat}m
                    </div>
                  )}
                  {istirahat > 0 && (
                    <div className="bg-blue-50 text-blue-600 text-[6.5px] font-black px-1.5 py-0.5 rounded-md border border-blue-100 uppercase flex items-center gap-0.5">
                      B: {istirahat}m
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* FOOTER LEGEND */}
      {!loading && data.length > 0 && (
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 border-t border-gray-100 pt-6 opacity-60">
          <LegendItem
            color="bg-blue-100 border border-blue-200"
            label="Minggu"
          />
          <LegendItem
            color="bg-blue-100 border border-blue-200"
            label="Hari Libur"
          />
          <LegendItem
            color="bg-red-50 border border-red-100"
            label="Alpha / Tanpa Ket"
          />
        </div>
      )}
    </div>
  );
};

const LegendItem = ({ color, label }) => (
  <div className="flex items-center gap-2">
    <div className={`w-3 h-3 ${color} rounded-md`} />
    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">
      {label}
    </p>
  </div>
);

// 3. REKAP BULANAN (TAB 2)
const SummaryHistoryContent = ({ data, loading }) => {
  if (loading)
    return (
      <div className="py-10 text-center animate-pulse text-[10px] font-black text-gray-300 uppercase tracking-widest">
        Menghitung Rekap...
      </div>
    );
  if (!data)
    return (
      <div className="py-10 text-center text-gray-400 text-[10px] uppercase font-bold">
        Data rekap tidak tersedia
      </div>
    );

  // Helper format menit ke jam
  const toHours = (minutes) => (minutes / 60).toFixed(1);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-500">
      {/* Container Utama */}
      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-gray-100 space-y-8">
        {/* Section 1: Hari Kehadiran */}
        <div className="grid grid-cols-2 gap-4">
          <SummaryItem
            label="Hadir"
            value={data.hadir}
            unit="Hari"
            color="text-green-600"
          />
          <SummaryItem
            label="Alpha"
            value={data.alpha}
            unit="Hari"
            color="text-red-500"
          />
          <SummaryItem
            label="Izin"
            value={data.izin}
            unit="Hari"
            color="text-orange-500"
          />
          <SummaryItem
            label="Sakit"
            value={data.sakit}
            unit="Hari"
            color="text-blue-500"
          />
        </div>

        {/* Section 2: Durasi & Kedisiplinan */}
        <div className="pt-6 border-t border-gray-50 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1">
              Total Kerja
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black text-custom-gelap">
                {toHours(data.total_menit_kerja)}
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase">
                Jam
              </span>
            </div>
          </div>
          <div className="flex flex-col text-right">
            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1 text-right">
              Total Telat
            </p>
            <div className="flex items-baseline gap-1 justify-end">
              <span className="text-xl font-black text-custom-merah">
                {data.total_menit_terlambat}
              </span>
              <span className="text-[9px] font-bold text-gray-400 uppercase">
                Min
              </span>
            </div>
          </div>
        </div>

        {/* Button Unduh */}
        {/* <button className="w-full py-5 bg-custom-gelap text-white rounded-[25px] font-black text-[10px] uppercase tracking-[3px] shadow-xl shadow-gray-200 active:scale-95 transition-all">
          Unduh Slip Gaji (PDF)
        </button> */}
      </div>

      {/* Info Tambahan */}
      <p className="px-6 text-[8px] text-gray-400 font-bold uppercase tracking-widest text-center leading-loose opacity-60">
        Data rekapitulasi dihitung secara otomatis <br /> berdasarkan log
        absensi harian
      </p>
    </div>
  );
};

const SummaryItem = ({ label, value, unit, color }) => (
  <div className="bg-gray-50/50 p-5 rounded-[30px] text-center border border-gray-100 group hover:border-custom-merah/20 transition-all">
    <p className="text-[8px] font-black text-gray-400 uppercase mb-2 tracking-widest">
      {label}
    </p>
    <div className="flex items-baseline justify-center gap-1">
      <p className={`text-2xl font-black ${color} tracking-tighter`}>{value}</p>
      <p className="text-[8px] font-bold text-gray-300 uppercase">{unit}</p>
    </div>
  </div>
);

export default Riwayat;

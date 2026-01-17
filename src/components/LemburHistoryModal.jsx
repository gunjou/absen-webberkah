import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import { FiTrash2, FiTrendingUp, FiImage } from "react-icons/fi";
import dayjs from "dayjs";
import Api from "../Api";
import ImagePreviewModal from "./ImagePreviewModal";

const LemburHistoryModal = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  const [previewData, setPreviewData] = useState({ isOpen: false, url: "" });

  useEffect(() => {
    if (isOpen) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          const bulan = dayjs().month() + 1;
          const tahun = dayjs().year();
          const res = await Api.get(
            `/lembur/history?bulan=${bulan}&tahun=${tahun}`,
          );
          setHistory(res.data.data || []);
        } catch (err) {
          console.error("Gagal load history lembur:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen]);

  const handleDelete = async (id_lembur) => {
    if (
      !window.confirm(
        "Apakah Anda yakin ingin membatalkan pengajuan lembur ini?",
      )
    )
      return;

    setDeleteLoading(id_lembur);
    try {
      const res = await Api.delete(`/lembur/${id_lembur}`);
      if (res.data.success) {
        // Filter out data dari state lokal agar langsung hilang dari UI
        setHistory((prev) =>
          prev.filter((item) => item.id_lembur !== id_lembur),
        );
        alert("Pengajuan berhasil dibatalkan");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal membatalkan pengajuan";
      alert(msg);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[45px] h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500">
        {/* Header - Lebih Slim */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-black text-custom-gelap uppercase tracking-widest leading-none">
              Riwayat Lembur
            </h2>
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
              Klik Lampiran untuk melihat bukti
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-100 p-2 rounded-full text-gray-500 active:scale-90 transition-all"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        {/* List Content - Area Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gray-50/30 custom-scrollbar">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <div className="w-10 h-10 border-4 border-custom-merah/10 border-t-custom-merah rounded-full animate-spin" />
            </div>
          ) : history.length > 0 ? (
            history.map((item, index) => {
              const status = item.status_approval?.toLowerCase();
              const isApproved = status === "approved";
              const isPending = status === "pending";
              // const isRejected = status === "rejected";

              return (
                <div
                  key={item.id_lembur || index}
                  className="bg-white p-4 rounded-[30px] border border-gray-100 shadow-sm relative overflow-hidden flex flex-col gap-3"
                >
                  {/* Status Strip Samping */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1.5 ${isApproved ? "bg-green-500" : isPending ? "bg-orange-400" : "bg-red-500"}`}
                  />

                  <div className="flex justify-between items-start pl-2">
                    <div className="flex-1">
                      {/* Badge & Tanggal */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-[8px] font-black px-2 py-1 rounded-lg uppercase border ${
                            isApproved
                              ? "bg-green-50 text-green-600 border-green-100"
                              : isPending
                                ? "bg-orange-50 text-orange-600 border-orange-100"
                                : "bg-red-50 text-red-600 border-red-100"
                          }`}
                        >
                          {item.status_approval}
                        </span>
                        <span className="text-[9px] font-black text-gray-300 uppercase">
                          {dayjs(item.tanggal).format("DD/MM/YYYY")}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-custom-gelap uppercase leading-tight">
                        {item.nama_jenis_lembur}
                      </h4>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5 truncate max-w-[200px]">
                        {item.keterangan || "Tanpa keterangan"}
                      </p>
                    </div>

                    {/* Durasi Info */}
                    <div className="text-right">
                      <p className="text-[8px] font-black text-gray-300 uppercase leading-none">
                        Durasi
                      </p>
                      <p className="text-sm font-black text-custom-gelap mt-1">
                        {(item.menit_lembur / 60).toFixed(1)}{" "}
                        <span className="text-[8px] opacity-50 uppercase">
                          Jam
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Footer Card: Lampiran & Action */}
                  <div className="pl-2 pt-3 border-t border-gray-50 flex items-center justify-between">
                    {item.path_lampiran ? (
                      <button
                        onClick={() =>
                          setPreviewData({
                            isOpen: true,
                            url: item.path_lampiran,
                          })
                        }
                        className="flex items-center gap-2 text-blue-600"
                      >
                        <FiImage size={14} />
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          Lihat Lampiran
                        </span>
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-300 italic">
                        <FiImage size={14} />
                        <span className="text-[9px] font-bold uppercase tracking-widest leading-none">
                          No File
                        </span>
                      </div>
                    )}

                    {isPending && (
                      <button
                        onClick={() => handleDelete(item.id_lembur)}
                        disabled={deleteLoading === item.id_lembur}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all ${
                          deleteLoading === item.id_lembur
                            ? "bg-gray-100 text-gray-400"
                            : "text-red-500 hover:bg-red-50"
                        }`}
                      >
                        {deleteLoading === item.id_lembur ? (
                          <div className="w-3 h-3 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin" />
                        ) : (
                          <FiTrash2 size={12} />
                        )}
                        <span className="text-[9px] font-black uppercase tracking-widest">
                          {deleteLoading === item.id_lembur
                            ? "Proses..."
                            : "Batal"}
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-20">
              <FiTrendingUp size={48} />
              <p className="text-[10px] font-black uppercase mt-4 tracking-[3px]">
                Belum Ada Data
              </p>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-6 bg-white border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-4 bg-custom-gelap text-white rounded-[20px] font-black text-[10px] uppercase tracking-[3px] active:scale-95 transition-all"
          >
            Tutup Riwayat
          </button>
        </div>
      </div>

      {/* Panggil Modal Universal di paling bawah */}
      <ImagePreviewModal
        isOpen={previewData.isOpen}
        onClose={() => setPreviewData({ ...previewData, isOpen: false })}
        imageUrl={previewData.url}
        title="Bukti Lembur"
      />
    </div>
  );
};

export default LemburHistoryModal;

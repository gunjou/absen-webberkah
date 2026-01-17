import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTrash2,
  FiFileText,
  FiAlertCircle,
  FiImage,
} from "react-icons/fi";
import dayjs from "dayjs";
import Api from "../Api";
import ImagePreviewModal from "./ImagePreviewModal"; // Import modal universal

const IzinHistoryModal = ({ isOpen, onClose }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [previewData, setPreviewData] = useState({ isOpen: false, url: "" });

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const bulan = dayjs().month() + 1;
      const tahun = dayjs().year();
      const res = await Api.get(
        `/perizinan/history?bulan=${bulan}&tahun=${tahun}`,
      );
      setHistory(res.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil riwayat izin", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchHistory();
  }, [isOpen]);

  const handleDelete = async (id_izin) => {
    if (!window.confirm("Batalkan pengajuan izin ini?")) return;

    setDeleteLoading(id_izin);
    try {
      const res = await Api.delete(`/perizinan/${id_izin}`);
      if (res.data.success) {
        setHistory((prev) => prev.filter((item) => item.id_izin !== id_izin));
        alert("Pengajuan izin berhasil dibatalkan");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Gagal membatalkan izin");
    } finally {
      setDeleteLoading(null);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
        <div className="bg-white w-full max-w-lg rounded-[45px] h-[80vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500">
          {/* Header */}
          <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
            <div>
              <h2 className="text-lg font-black text-custom-gelap uppercase tracking-widest leading-none">
                Status Pengajuan
              </h2>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">
                Riwayat Izin & Sakit
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-gray-100 p-2 rounded-full text-gray-500 active:scale-90 transition-all"
            >
              <IoMdClose size={20} />
            </button>
          </div>

          {/* List Content */}
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
                const isRejected = status === "rejected";

                return (
                  <div
                    key={item.id_izin || index}
                    className="bg-white p-4 rounded-[30px] border border-gray-100 shadow-sm relative overflow-hidden flex flex-col gap-3"
                  >
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 ${isApproved ? "bg-green-500" : isPending ? "bg-orange-400" : "bg-red-500"}`}
                    />

                    <div className="flex justify-between items-start pl-2">
                      <div className="flex-1">
                        {/* Badge & ID */}
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
                            #{item.id_izin}
                          </span>
                        </div>

                        {/* Nama Izin & Keterangan */}
                        <h4 className="text-sm font-black text-custom-gelap uppercase leading-tight">
                          {item.nama_izin}
                        </h4>

                        {/* BAGIAN KETERANGAN (DIKEMBALIKAN) */}
                        <p className="text-[10px] font-bold text-gray-400 mt-1 italic leading-relaxed">
                          "{item.keterangan || "Tanpa keterangan"}"
                        </p>

                        <p className="text-[9px] font-black text-custom-merah mt-2 uppercase tracking-tighter flex items-center gap-1">
                          <FiClock size={10} />
                          {dayjs(item.tgl_mulai).format("DD MMM")} —{" "}
                          {dayjs(item.tgl_selesai).format("DD MMM YYYY")}
                        </p>
                      </div>

                      <div className="text-right flex flex-col items-end gap-1">
                        {isApproved ? (
                          <FiCheckCircle className="text-green-500" size={18} />
                        ) : isPending ? (
                          <FiClock className="text-orange-400" size={18} />
                        ) : (
                          <FiXCircle className="text-red-500" size={18} />
                        )}
                      </div>
                    </div>

                    {/* Footer: Lampiran & Delete */}
                    <div className="pl-2 pt-3 border-t border-gray-50 flex items-center justify-between">
                      {item.lampiran ? (
                        <button
                          onClick={() =>
                            setPreviewData({ isOpen: true, url: item.lampiran })
                          }
                          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <FiImage size={14} />
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            Lihat Lampiran
                          </span>
                        </button>
                      ) : (
                        <span className="text-[9px] font-bold text-gray-300 uppercase italic">
                          No File
                        </span>
                      )}

                      {isPending && (
                        <button
                          onClick={() => handleDelete(item.id_izin)}
                          disabled={deleteLoading === item.id_izin}
                          className="flex items-center gap-1.5 text-red-500 px-3 py-1.5 rounded-xl hover:bg-red-50 transition-all"
                        >
                          {deleteLoading === item.id_izin ? (
                            <div className="w-3 h-3 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
                          ) : (
                            <FiTrash2 size={12} />
                          )}
                          <span className="text-[9px] font-black uppercase tracking-widest">
                            {deleteLoading === item.id_izin ? "..." : "Batal"}
                          </span>
                        </button>
                      )}
                    </div>

                    {isRejected && item.alasan_penolakan && (
                      <div className="mt-1 p-3 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-2">
                        <FiAlertCircle
                          className="text-red-500 mt-0.5 flex-shrink-0"
                          size={14}
                        />
                        <p className="text-[10px] font-bold text-red-700 leading-tight italic">
                          "{item.alasan_penolakan}"
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-20 py-20">
                <FiFileText size={48} />
                <p className="text-[10px] font-black uppercase mt-4 tracking-[3px]">
                  Data Kosong
                </p>
              </div>
            )}
          </div>

          <div className="p-6 bg-white border-t border-gray-100">
            <button
              onClick={onClose}
              className="w-full py-4 bg-gray-100 text-gray-500 rounded-[20px] font-black text-[10px] uppercase tracking-[3px] active:scale-95 transition-all"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>

      {/* Modal Preview Lampiran Universal */}
      <ImagePreviewModal
        isOpen={previewData.isOpen}
        onClose={() => setPreviewData({ ...previewData, isOpen: false })}
        imageUrl={previewData.url}
        title="Lampiran Izin"
      />
    </>
  );
};

export default IzinHistoryModal;

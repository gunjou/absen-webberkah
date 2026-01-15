import React, { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiFileText,
  FiAlertCircle,
} from "react-icons/fi";
import dayjs from "dayjs";
import Api from "../Api";

const IzinHistoryModal = ({ isOpen, onClose, data = [] }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch data saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      const fetchHistory = async () => {
        setLoading(true);
        try {
          // Default mengambil bulan & tahun saat ini
          const bulan = dayjs().month() + 1;
          const tahun = dayjs().year();
          const res = await Api.get(
            `/perizinan/history?bulan=${bulan}&tahun=${tahun}`
          );
          setHistory(res.data.data);
        } catch (err) {
          console.error("Gagal mengambil riwayat izin", err);
        } finally {
          setLoading(false);
        }
      };
      fetchHistory();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[45px] max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500">
        {/* Header Modal */}
        <div className="p-7 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-custom-gelap uppercase tracking-widest leading-none">
              Status Pengajuan
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
              Riwayat Izin & Sakit Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="bg-gray-100 p-2.5 rounded-full text-gray-500 active:scale-90 transition-all shadow-sm"
          >
            <IoMdClose size={24} />
          </button>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50/30 custom-scrollbar">
          {loading ? (
            /* 1. Tampilan Spinner Saat Loading */
            <div className="flex-1 flex flex-col items-center justify-center py-20">
              <div className="relative w-12 h-12 mb-4">
                {/* Outer Ring */}
                <div className="absolute inset-0 border-4 border-custom-merah/10 rounded-full"></div>
                {/* Spinning Ring */}
                <div className="absolute inset-0 border-4 border-transparent border-t-custom-merah rounded-full animate-spin"></div>
              </div>
              <p className="text-[10px] font-black text-custom-gelap uppercase tracking-[3px] animate-pulse">
                Menarik Data...
              </p>
            </div>
          ) : history && history.length > 0 ? (
            history.map((item, index) => {
              // Menyesuaikan dengan status_approval dari API
              const status = item.status_approval?.toLowerCase();
              const isApproved = status === "approved";
              const isPending = status === "pending";
              const isRejected = status === "rejected";

              return (
                <div
                  key={index}
                  className="bg-white p-5 rounded-[35px] border border-gray-100 shadow-sm relative overflow-hidden transition-all active:scale-[0.98]"
                >
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-2 ${
                      isApproved
                        ? "bg-green-500"
                        : isPending
                        ? "bg-orange-400"
                        : "bg-red-500"
                    }`}
                  />

                  <div className="flex justify-between items-start pl-2">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-black px-3 py-1.5 rounded-xl uppercase border ${
                            isApproved
                              ? "bg-green-50 text-green-600 border-green-100"
                              : isPending
                              ? "bg-orange-50 text-orange-600 border-orange-100"
                              : "bg-red-50 text-red-600 border-red-100"
                          }`}
                        >
                          {item.status_approval}
                        </span>
                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-tighter">
                          #{item.id_izin}
                        </span>
                      </div>

                      <div>
                        {/* Nama Izin dari API */}
                        <h4 className="text-base font-black text-custom-gelap tracking-tight leading-tight uppercase">
                          {item.nama_izin}
                        </h4>
                        <p className="text-[11px] font-bold text-gray-400 mt-0.5 italic">
                          {item.keterangan}
                        </p>
                        <p className="text-[10px] font-black text-custom-merah mt-2 uppercase tracking-widest">
                          {dayjs(item.tgl_mulai).format("DD MMM")} —{" "}
                          {dayjs(item.tgl_selesai).format("DD MMM YYYY")}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-2xl flex-shrink-0 ${
                        isApproved
                          ? "bg-green-50 text-green-600"
                          : isPending
                          ? "bg-orange-50 text-orange-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {isApproved ? (
                        <FiCheckCircle size={26} />
                      ) : isPending ? (
                        <FiClock size={26} />
                      ) : (
                        <FiXCircle size={26} />
                      )}
                    </div>
                  </div>

                  {isRejected && item.alasan_penolakan && (
                    <div className="mt-4 p-4 bg-red-50/50 rounded-2xl border border-red-100 flex items-start gap-3">
                      <FiAlertCircle
                        className="text-red-500 mt-0.5 flex-shrink-0"
                        size={16}
                      />
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-red-400 uppercase tracking-widest">
                          Alasan Penolakan:
                        </p>
                        <p className="text-[11px] font-bold text-red-700 leading-tight italic">
                          "{item.alasan_penolakan}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* {isPending && (
                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                      <button className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2 px-5 py-2.5 rounded-2xl hover:bg-red-50 active:scale-90 transition-all bg-red-50/30">
                        <FiTrash2 size={14} /> Batalkan
                      </button>
                    </div>
                  )} */}
                </div>
              );
            })
          ) : (
            <div className="py-24 text-center opacity-30 flex flex-col items-center">
              <FiFileText size={64} className="text-gray-400" />
              <p className="text-sm font-black uppercase mt-4 tracking-[4px]">
                Data Kosong
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-7 bg-white border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-5 bg-gray-100 text-gray-500 rounded-[25px] font-black text-xs uppercase tracking-[3px] active:scale-95 transition-all shadow-inner border border-gray-100"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default IzinHistoryModal;

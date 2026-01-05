import React from "react";
import { IoMdClose } from "react-icons/io";
import {
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiTrash2,
  FiTrendingUp,
  FiAlertCircle,
} from "react-icons/fi";
import dayjs from "dayjs";

const LemburHistoryModal = ({ isOpen, onClose, data = [] }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-end justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-lg rounded-[45px] max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-500">
        {/* Header Modal */}
        <div className="p-7 border-b border-gray-50 flex items-center justify-between bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-black text-custom-gelap uppercase tracking-widest leading-none">
              Riwayat Lembur
            </h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">
              Pantau jam lembur & upah
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
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50/30">
          {data && data.length > 0 ? (
            data.map((item, index) => {
              const isApproved = item.status?.toLowerCase() === "approved";
              const isPending = item.status?.toLowerCase() === "pending";
              const isRejected = item.status?.toLowerCase() === "rejected";

              return (
                <div
                  key={index}
                  className="bg-white p-5 rounded-[35px] border border-gray-100 shadow-sm relative overflow-hidden transition-all active:scale-[0.98]"
                >
                  {/* Status Indicator Bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-2 ${
                      isApproved
                        ? "bg-blue-500"
                        : isPending
                        ? "bg-orange-400"
                        : "bg-red-500"
                    }`}
                  ></div>

                  <div className="flex justify-between items-start pl-2">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase border ${
                            isApproved
                              ? "bg-blue-50 text-blue-600 border-blue-100"
                              : isPending
                              ? "bg-orange-50 text-orange-600 border-orange-100"
                              : "bg-red-50 text-red-600 border-red-100"
                          }`}
                        >
                          {item.status}
                        </span>
                        <span className="text-[10px] font-black text-gray-300 uppercase">
                          {dayjs(item.tanggal).format("DD MMM YYYY")}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-base font-black text-custom-gelap tracking-tight uppercase">
                          {item.tugas || "Pekerjaan Tambahan"}
                        </h4>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex flex-col">
                            <p className="text-[8px] font-black text-gray-400 uppercase">
                              Durasi
                            </p>
                            <p className="text-xs font-black text-custom-gelap">
                              {item.durasi} Jam
                            </p>
                          </div>
                          <div className="w-px h-6 bg-gray-100"></div>
                          <div className="flex flex-col">
                            <p className="text-[8px] font-black text-gray-400 uppercase">
                              Estimasi Upah
                            </p>
                            <p className="text-xs font-black text-blue-600">
                              Rp {item.upah}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`p-3 rounded-2xl ${
                        isApproved
                          ? "bg-blue-50 text-blue-600"
                          : isPending
                          ? "bg-orange-50 text-orange-600"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      <FiTrendingUp size={24} />
                    </div>
                  </div>

                  {/* Alasan Penolakan */}
                  {isRejected && item.alasan && (
                    <div className="mt-4 p-4 bg-red-50/50 rounded-2xl border border-red-100 flex items-start gap-3 text-red-700">
                      <FiAlertCircle
                        size={16}
                        className="mt-0.5 flex-shrink-0"
                      />
                      <p className="text-[11px] font-bold italic">
                        "{item.alasan}"
                      </p>
                    </div>
                  )}

                  {/* Tombol Batalkan */}
                  {isPending && (
                    <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                      <button className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 transition-all">
                        <FiTrash2 size={14} /> Batalkan
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-20 text-center opacity-30 flex flex-col items-center">
              <FiTrendingUp size={64} className="text-gray-400" />
              <p className="text-sm font-black uppercase mt-4 tracking-[4px]">
                Belum ada lembur
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-7 bg-white border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-5 bg-gray-900 text-white rounded-[25px] font-black text-xs uppercase tracking-[3px] active:scale-95 transition-all shadow-lg shadow-gray-200"
          >
            Tutup Riwayat
          </button>
        </div>
      </div>
    </div>
  );
};

export default LemburHistoryModal;

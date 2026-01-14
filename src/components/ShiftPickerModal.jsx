import React, { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCheckCircle } from "react-icons/fa";
import Api from "../Api";

const ShiftPickerModal = ({ isOpen, onClose, onConfirm }) => {
  const [listShift, setListShift] = useState([]);
  const [tempSelectedShift, setTempSelectedShift] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ref untuk mendeteksi klik di luar konten modal
  const modalContentRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      const fetchShifts = async () => {
        setLoading(true);
        try {
          const res = await Api.get("/master/jam-kerja/pegawai");
          setListShift(res.data.data);
        } catch (err) {
          console.error("Gagal memuat list shift", err);
        } finally {
          setLoading(false);
        }
      };
      fetchShifts();
    }
  }, [isOpen]);

  // Fungsi untuk handle klik overlay (diluar modal)
  const handleOverlayClick = (e) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(e.target)
    ) {
      setTempSelectedShift(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleContinue = () => {
    if (tempSelectedShift) {
      onConfirm(tempSelectedShift.id);
      setTempSelectedShift(null);
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-300"
    >
      <div
        ref={modalContentRef}
        className="bg-white w-full max-w-sm rounded-[45px] p-8 shadow-2xl animate-in zoom-in duration-200 flex flex-col min-h-[400px] relative overflow-hidden"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-black text-custom-gelap uppercase tracking-widest">
            Pilih Shift
          </h3>
          <button
            onClick={() => {
              setTempSelectedShift(null);
              onClose();
            }}
            className="text-gray-400 p-2 active:scale-90 transition-transform"
          >
            <IoMdClose size={24} />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-6 italic">
          Silahkan pilih salah satu jadwal
        </p>

        {/* List Content dengan Padding Horizontal Ekstra untuk menampung efek Grow */}
        <div className="space-y-4 max-h-[45vh] overflow-y-auto px-2 py-4 -mx-2 custom-scrollbar">
          {loading ? (
            <div className="py-10 text-center text-[10px] font-black text-gray-400 uppercase animate-pulse">
              Mengambil data...
            </div>
          ) : (
            listShift.map((s) => {
              const currentId = s.id_jam_kerja;
              const isSelected = tempSelectedShift?.id === currentId;

              return (
                <button
                  type="button"
                  key={currentId}
                  onClick={() =>
                    setTempSelectedShift({ id: currentId, nama: s.nama_shift })
                  }
                  className={`w-full p-5 rounded-[30px] border-2 transition-all duration-300 text-left flex justify-between items-center relative group ${
                    isSelected
                      ? "border-custom-merah bg-red-50/50 shadow-xl shadow-red-100 scale-[1.05] z-10"
                      : "border-gray-50 bg-white hover:border-gray-200 z-0 opacity-90"
                  }`}
                >
                  <div className="flex flex-col gap-1">
                    <p
                      className={`text-xs font-black uppercase tracking-wider transition-colors ${
                        isSelected ? "text-custom-merah" : "text-custom-gelap"
                      }`}
                    >
                      {s.nama_shift}
                    </p>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full transition-all ${
                          isSelected
                            ? "bg-custom-merah scale-125"
                            : "bg-gray-300"
                        }`}
                      />
                      <p
                        className={`text-[10px] font-bold uppercase italic transition-colors ${
                          isSelected ? "text-custom-merah/60" : "text-gray-400"
                        }`}
                      >
                        {s.jam_mulai.slice(0, 5)} - {s.jam_selesai.slice(0, 5)}
                      </p>
                    </div>
                  </div>

                  {/* Indikator Centang yang juga ikut membesar */}
                  <div
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                      isSelected
                        ? "bg-custom-merah border-custom-merah text-white rotate-[360deg] scale-110"
                        : "border-gray-100 text-transparent"
                    }`}
                  >
                    <FaCheckCircle size={14} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Action Button */}
        <div className="mt-8 pt-4 border-t border-gray-50 bg-white">
          <button
            disabled={!tempSelectedShift || loading}
            onClick={handleContinue}
            className={`w-full py-5 rounded-[25px] font-black text-[11px] uppercase tracking-[3px] transition-all duration-300 ${
              tempSelectedShift
                ? "bg-gradient-to-r from-custom-merah to-custom-gelap text-white shadow-lg shadow-custom-merah/30 active:scale-95 translate-y-0"
                : "bg-gray-100 text-gray-300 cursor-not-allowed translate-y-2 opacity-50"
            }`}
          >
            {tempSelectedShift
              ? `Lanjutkan (${tempSelectedShift.nama})`
              : "Pilih Shift Dahulu"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShiftPickerModal;

import React, { useState, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";
import { FaCheckCircle, FaUndo } from "react-icons/fa";
import CameraComponent from "./CameraComponent";
import LoadingOverlay from "./LoadingOverlay";
import Api from "../Api";

const CameraAttendance = ({ isOpen, onClose, mode, onAttendanceSuccess }) => {
  const [image, setImage] = useState(null);
  const [showCamera, setShowCamera] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const cameraRef = useRef(); // Ref untuk memicu capture

  useEffect(() => {
    if (isOpen) {
      setImage(null);
      setShowCamera(true);
    }
  }, [isOpen]);

  const handleCapture = (imageSrc) => {
    setImage(imageSrc);
    setShowCamera(false);
  };

  const triggerCapture = () => {
    if (cameraRef.current) {
      cameraRef.current.capture();
    }
  };

  const resizeImage = (base64Str) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let canvas = document.createElement("canvas");
        const MAX_SIZE = 640;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
    });
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const resizedImage = await resizeImage(image);

          // Ubah base64 ke Blob
          const fetchResponse = await fetch(resizedImage);
          const blob = await fetchResponse.blob();

          const formData = new FormData();
          // Pastikan key 'file' sesuai dengan yang diharapkan backend (bisa 'image' atau 'file')
          formData.append("file", blob, "absensi.jpg");
          formData.append("latitude", latitude);
          formData.append("longitude", longitude);

          try {
            let response;

            // PENTING: Hapus header Content-Type agar browser otomatis mengaturnya ke multipart/form-data
            const config = {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            };

            if (mode === "masuk") {
              response = await Api.post("/absensi/check-in", formData, config);
            } else if (mode === "selesai_istirahat") {
              response = await Api.put(
                "/absensi/istirahat-selesai",
                formData,
                config
              );
            } else if (mode === "pulang") {
              response = await Api.put("/absensi/check-out", formData, config);
            }

            if (response.data.success) {
              onAttendanceSuccess();
              onClose();
            }
          } catch (apiError) {
            // Menampilkan pesan error detail dari backend jika ada
            const errorMsg =
              apiError.response?.data?.message || "Gagal mengirim data absensi";
            alert(`Error: ${errorMsg}`);
          } finally {
            setIsLoading(false);
          }
        },
        (err) => {
          alert("Izin lokasi diperlukan untuk absen!");
          setIsLoading(false);
        },
        { enableHighAccuracy: true } // Akurasi tinggi untuk koordinat
      );
    } catch (error) {
      alert("Terjadi kesalahan teknis.");
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-300">
      {isLoading && <LoadingOverlay message="Memproses Absensi..." />}

      <div className="bg-white w-full max-w-sm rounded-[45px] overflow-hidden shadow-2xl relative flex flex-col items-center p-6 pt-12 animate-in slide-in-from-bottom-10">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-custom-merah transition-colors"
        >
          <IoMdClose size={28} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-xl font-black text-custom-gelap uppercase tracking-widest">
            Konfirmasi Kehadiran
          </h2>
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
            {mode.replace("_", " ")}
          </p>
        </div>

        {/* Camera Area */}
        <div className="relative w-full aspect-[3/4] bg-gray-900 rounded-[35px] overflow-hidden shadow-2xl border-4 border-white">
          {showCamera ? (
            <CameraComponent ref={cameraRef} onCapture={handleCapture} />
          ) : (
            <img
              src={image}
              alt="Preview"
              className="w-full h-full object-cover scale-x-[-1]"
            />
          )}

          {/* Frame Face Overlay (Hanya saat kamera aktif) */}
          {showCamera && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
              <div className="w-64 h-80 border-2 border-dashed border-white/50 rounded-[100px]"></div>
              <p className="text-white/70 text-[10px] mt-4 font-medium bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
                Posisikan wajah di tengah oval
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 w-full flex flex-col items-center">
          {showCamera ? (
            /* Tombol Shutter (Ambil Foto) */
            <button
              onClick={triggerCapture}
              className="w-16 h-16 rounded-full border-4 border-gray-200 p-1 active:scale-90 transition-transform"
            >
              <div className="w-full h-full bg-custom-merah rounded-full shadow-inner"></div>
            </button>
          ) : (
            /* Tombol Konfirmasi */
            <div className="flex gap-4 w-full px-4">
              <button
                onClick={() => setShowCamera(true)}
                className="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <FaUndo /> Ulangi
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-4 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-green-200 flex items-center justify-center gap-2 active:scale-95 transition"
              >
                <FaCheckCircle /> Kirim
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraAttendance;

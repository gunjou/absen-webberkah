import React from "react";
import { IoMdClose } from "react-icons/io";
import { FiDownload } from "react-icons/fi";

const ImagePreviewModal = ({
  isOpen,
  onClose,
  imageUrl,
  title = "Preview Lampiran",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-300">
        {/* Header Preview */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-10">
          <h3 className="text-white text-[10px] font-black uppercase tracking-[3px]">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white active:scale-90 transition-all"
          >
            <IoMdClose size={20} />
          </button>
        </div>

        {/* Image Container */}
        <div className="w-full h-[70vh] bg-gray-900 flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-full object-contain"
          />
        </div>

        {/* Bottom Action */}
        <div className="p-6 bg-white flex justify-center">
          <a
            href={imageUrl}
            download
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 bg-custom-gelap text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[2px] active:scale-95 transition-all"
          >
            <FiDownload size={16} /> Buka Original / Download
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;

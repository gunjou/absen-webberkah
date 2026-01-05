import React from "react";

const PrimaryButton = ({
  onClick,
  type = "button",
  isLoading = false,
  children,
  className = "",
}) => {
  return (
    <button
      type={type}
      disabled={isLoading}
      onClick={onClick}
      className={`w-full bg-gradient-to-br from-custom-merah to-custom-gelap text-white py-5 rounded-[25px] font-black text-sm uppercase tracking-[4px] shadow-xl transition-all flex items-center justify-center relative active:scale-95
        ${
          isLoading
            ? "opacity-80 cursor-not-allowed scale-[0.98]"
            : "shadow-custom-merah/30 hover:shadow-2xl hover:-translate-y-0.5"
        } ${className}`}
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-3">
          {/* Spinner Animasi */}
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="tracking-[2px]">Memproses...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default PrimaryButton;

import React, { useState } from "react";
import {
  FiArrowLeft,
  FiLock,
  FiMail,
  FiEye,
  FiEyeOff,
  FiShield,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";

const Settings = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulasi API call
    setTimeout(() => {
      setIsLoading(false);
      alert("Password berhasil diperbarui!");
    }, 2000);
  };

  return (
    <div className="h-[100dvh] bg-gray-50 font-poppins flex flex-col overflow-hidden text-custom-gelap">
      {/* 1. Header Section - Slim Style */}
      <div className="relative bg-gradient-to-br from-custom-merah to-custom-gelap h-36 rounded-b-[45px] p-6 pt-2 shadow-xl flex-shrink-0 z-0">
        <div className="flex justify-between items-start mt-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl text-white active:scale-95 transition shadow-lg"
          >
            <FiArrowLeft size={22} />
          </button>
        </div>
        <div className="mt-2">
          <h1 className="text-xl font-black text-white uppercase tracking-widest leading-none">
            Keamanan
          </h1>
          <p className="text-white/60 text-[9px] font-bold uppercase tracking-[2px] mt-1.5">
            Informasi Akun & Password
          </p>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="pt-3 px-6 flex-1 overflow-y-auto pb-10 z-10 space-y-5">
        {/* Card: Informasi Akun (Read Only) */}
        <section className="bg-white rounded-[35px] p-7 shadow-sm border border-gray-100">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-5 flex items-center gap-2">
            <FiShield className="text-custom-merah" /> Detail Login
          </h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <FiMail className="text-gray-400" />
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                  Email Terdaftar
                </p>
                <p className="text-xs font-black text-custom-gelap uppercase tracking-tight">
                  ahmad.bagus@company.com
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <FiLock className="text-gray-400" />
              <div>
                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
                  Username
                </p>
                <p className="text-xs font-black text-custom-gelap uppercase tracking-tight">
                  ahmad_bagus95
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Card: Form Ganti Password */}
        <section className="bg-white rounded-[35px] p-7 shadow-sm border border-gray-100">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-6 flex items-center gap-2 text-center justify-center">
            Ganti Password Baru
          </h3>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {/* Password Lama */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-3 tracking-widest">
                Password Lama
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold text-custom-gelap outline-none focus:border-custom-merah/20 focus:bg-white transition-all shadow-sm"
                  placeholder="••••••••"
                  required
                  value={formData.oldPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, oldPassword: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Password Baru */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-3 tracking-widest">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold text-custom-gelap outline-none focus:border-custom-merah/20 focus:bg-white transition-all shadow-sm"
                  placeholder="Min. 8 Karakter"
                  required
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, newPassword: e.target.value })
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPass ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password */}
            <div className="space-y-1.5">
              <label className="text-[9px] font-black text-gray-400 uppercase ml-3 tracking-widest">
                Konfirmasi Password
              </label>
              <input
                type={showPass ? "text" : "password"}
                className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold text-custom-gelap outline-none focus:border-custom-merah/20 focus:bg-white transition-all shadow-sm"
                placeholder="Ulangi Password Baru"
                required
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
              />
            </div>

            <div className="pt-4">
              <PrimaryButton type="submit" isLoading={isLoading}>
                Perbarui Password
              </PrimaryButton>
            </div>
          </form>
        </section>

        <p className="text-[9px] font-bold text-gray-300 text-center uppercase tracking-widest">
          Terakhir diperbarui: 01 Januari 2026
        </p>
      </div>
    </div>
  );
};

export default Settings;

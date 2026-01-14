import React, { useState, useEffect } from "react";
import {
  FiArrowLeft,
  FiMail,
  FiEye,
  FiEyeOff,
  FiShield,
  FiUser,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";
import Api from "../Api"; // Pastikan path Api sesuai

const Settings = () => {
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [account, setAccount] = useState(null);

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 1. Fetch Data Akun
  useEffect(() => {
    const fetchAccountInfo = async () => {
      setIsLoading(true);
      try {
        const res = await Api.get("/pegawai/account-info");
        setAccount(res.data.data);
      } catch (err) {
        console.error("Gagal mengambil data akun", err);
      }
      setIsLoading(false);
    };
    fetchAccountInfo();
  }, []);

  // 2. Handle Update Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      alert("Konfirmasi password tidak cocok!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await Api.put("/auth/change-password", {
        old_password: formData.oldPassword,
        new_password: formData.newPassword,
      });

      if (response.data.success) {
        alert("Password berhasil diperbarui!");
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
        navigate("/dashboard");
      }
    } catch (err) {
      // CEK DISINI: Jangan biarkan interceptor melakukan redirect jika ini hanya salah password
      const errorMsg =
        err.response?.data?.message || "Terjadi kesalahan server";

      if (err.response?.status === 401 && !err.config._isRetry) {
        // Jika backend Anda mengirim 401 untuk 'Password Salah',
        // Anda perlu menampilkan alert alih-alih membiarkan sistem logout.
        alert("Password lama yang Anda masukkan salah!");
      } else {
        alert(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] bg-gray-50 font-poppins flex flex-col overflow-hidden text-custom-gelap">
      {isLoading && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-4">
            {/* Outer Ring */}
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 border-4 border-custom-merah/20 rounded-full"></div>
              {/* Spinning Ring */}
              <div className="absolute inset-0 border-4 border-transparent border-t-custom-merah rounded-full animate-spin"></div>
            </div>
            <p className="text-[10px] font-black text-custom-gelap uppercase tracking-[3px] animate-pulse">
              Memuat Data...
            </p>
          </div>
        </div>
      )}

      {/* 1. Header Section */}
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
      <div className="pt-3 px-6 flex-1 overflow-y-auto pb-10 z-10 space-y-5 custom-scrollbar">
        {/* Card: Informasi Akun (Dinamis dari API) */}
        <section className="bg-white rounded-[35px] p-7 shadow-sm border border-gray-100 animate-in fade-in duration-500">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-5 flex items-center gap-2">
            <FiShield className="text-custom-merah" /> Detail Login
          </h3>
          <div className="space-y-4">
            <AccountInfoRow
              icon={<FiMail className="text-gray-400" />}
              label="Email Terdaftar"
              value={account?.email || "Loading..."}
            />
            <AccountInfoRow
              icon={<FiUser className="text-gray-400" />}
              label="Username"
              value={account?.username || "Loading..."}
            />
          </div>
        </section>

        {/* Card: Form Ganti Password */}
        <section className="bg-white rounded-[35px] p-7 shadow-sm border border-gray-100">
          <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[3px] mb-6 text-center">
            Ganti Password Baru
          </h3>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <InputField
              label="Password Lama"
              type={showPass ? "text" : "password"}
              value={formData.oldPassword}
              onChange={(v) => setFormData({ ...formData, oldPassword: v })}
              placeholder="••••••••"
              showToggle
              isToggled={showPass}
              onToggle={() => setShowPass(!showPass)}
            />

            <InputField
              label="Password Baru"
              type={showPass ? "text" : "password"}
              value={formData.newPassword}
              onChange={(v) => setFormData({ ...formData, newPassword: v })}
              placeholder="Masukkan Password Baru"
              showToggle
              isToggled={showPass}
              onToggle={() => setShowPass(!showPass)}
            />

            <InputField
              label="Konfirmasi Password"
              type={showPass ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(v) => setFormData({ ...formData, confirmPassword: v })}
              placeholder="Ulangi Password Baru"
              showToggle
              isToggled={showPass}
              onToggle={() => setShowPass(!showPass)}
            />

            <div className="pt-4">
              <PrimaryButton type="submit" isLoading={isLoading}>
                Perbarui Password
              </PrimaryButton>
            </div>
          </form>
        </section>

        <p className="text-[9px] font-bold text-gray-300 text-center uppercase tracking-widest">
          Pastikan password Anda sulit ditebak
        </p>
      </div>
    </div>
  );
};

// Sub-komponen agar kode bersih
const AccountInfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100">
    {icon}
    <div>
      <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
        {label}
      </p>
      <p className="text-xs font-black text-custom-gelap">{value}</p>
    </div>
  </div>
);

const InputField = ({
  label,
  type,
  value,
  onChange,
  placeholder,
  showToggle,
  isToggled,
  onToggle,
}) => (
  <div className="space-y-1.5">
    <label className="text-[9px] font-black text-gray-400 uppercase ml-3 tracking-widest">
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl py-4 px-5 text-sm font-bold text-custom-gelap outline-none focus:border-custom-merah/20 focus:bg-white transition-all"
        placeholder={placeholder}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {showToggle && (
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400"
        >
          {isToggled ? <FiEyeOff size={18} /> : <FiEye size={18} />}
        </button>
      )}
    </div>
  </div>
);

export default Settings;

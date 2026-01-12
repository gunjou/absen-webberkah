import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MdOutlineAccountCircle,
  MdOutlineVisibility,
  MdOutlineVisibilityOff,
} from "react-icons/md";
import { RiLockPasswordLine } from "react-icons/ri";

// Import Local Compontnts
import LoadingOverlay from "../components/LoadingOverlay";
import Api from "../Api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleToggle = () => setShowPassword(!showPassword);

  useEffect(() => {
    // Jika masuk ke halaman login, bersihkan semua sesi lama
    localStorage.clear();
    window.isLoggingOut = false; // Reset flag logout
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }

    setIsLoading(true);

    try {
      const response = await Api.post("/auth/pegawai/login", {
        username: username,
        password: password,
      });

      if (response.data.success) {
        const { access_token, refresh_token, user } = response.data.data;

        localStorage.setItem("token", access_token);
        localStorage.setItem("refresh_token", refresh_token);

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: user.id_pegawai,
            username: user.username,
            account_type: "pegawai",
          })
        );

        setIsLoading(false);

        navigate("/dashboard");
      }
    } catch (error) {
      setIsLoading(false);

      if (error.response) {
        const message =
          error.response.data?.status || error.response.data?.message;
        setError(message || "Gagal Login: Kredensial tidak valid");
      } else if (error.request) {
        setError("Tidak ada respon dari server. Pastikan koneksi aktif.");
      } else {
        setError("Terjadi kesalahan sistem saat mencoba login.");
      }
    }
  };

  return (
    <>
      {/* Tampilkan Spinner jika isLoading true */}
      {isLoading && <LoadingOverlay message="Memverifikasi Akun..." />}

      <div className="flex items-center justify-center min-h-[100dvh] bg-gradient-to-br from-custom-merah via-custom-gelap to-black font-poppins px-4">
        {/* Card Container dengan Efek Soft Glassmorphism */}
        <div className="relative bg-white/95 backdrop-blur-sm rounded-[40px] shadow-2xl p-8 md:p-10 max-w-sm w-full border border-white/20">
          {/* Logo */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-custom-cerah/40 blur-2xl rounded-2xl" />
              <img
                src={process.env.PUBLIC_URL + "/images/logo_large.png"}
                className="relative w-24 h-24 rounded-2xl bg-white p-3 shadow-xl"
                alt="berkahangsana-logo"
              />
            </div>
          </div>

          <div className="mt-4 mb-8 text-center">
            <h2 className="text-2xl font-bold text-custom-gelap tracking-tight">
              Selamat Datang
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Silahkan login ke sistem absensi
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-custom-merah transition-colors">
                <MdOutlineAccountCircle className="h-5 w-5" />
              </span>
              <input
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl block w-full pl-11 p-3.5 outline-none transition-all focus:ring-2 focus:ring-custom-cerah/50 focus:border-custom-merah focus:bg-white"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="relative group">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 group-focus-within:text-custom-merah transition-colors">
                <RiLockPasswordLine className="h-5 w-5" />
              </span>
              <input
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-2xl block w-full pl-11 pr-11 p-3.5 outline-none transition-all focus:ring-2 focus:ring-custom-cerah/50 focus:border-custom-merah focus:bg-white"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-custom-gelap transition-colors"
                onClick={handleToggle}
              >
                {showPassword ? (
                  <MdOutlineVisibilityOff className="h-5 w-5" />
                ) : (
                  <MdOutlineVisibility className="h-5 w-5" />
                )}
              </button>
            </div>

            <div
              className={`text-center transition-all duration-300 ${
                error ? "opacity-100 h-5" : "opacity-0 h-0 overflow-hidden"
              }`}
            >
              <span className="text-xs font-semibold text-red-500 bg-red-50 px-3 py-1 rounded-full">
                {error}
              </span>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-gradient-to-r from-custom-merah to-custom-gelap hover:from-custom-gelap hover:to-custom-merah focus:ring-4 focus:outline-none focus:ring-custom-cerah/50 font-bold rounded-2xl text-sm px-5 py-4 text-center transition-all duration-500 shadow-lg active:scale-95"
            >
              LOGIN
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[10px] uppercase tracking-[2px] text-gray-400 font-medium">
              © 2026 • Outlook Project
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

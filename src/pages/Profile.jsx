import React from "react";
import {
  FiArrowLeft,
  FiUser,
  FiMapPin,
  FiBookOpen,
  FiCreditCard,
  FiCheckCircle,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const user = {
    nama: "Ahmad Bagus Prasetyo",
    nik: "202409010042",
    jabatan: "Senior Web Developer",
    data_pribadi: {
      email: "ahmad.bagus@company.com",
      telepon: "0812-3456-7890",
      alamat: "Jl. Merdeka No. 123, Mataram",
      tgl_lahir: "12 Mei 1995",
    },
    pendidikan: {
      jenjang: "S1 Teknik Informatika",
      institusi: "Universitas Mataram",
    },
    rekening: {
      bank: "Bank Central Asia (BCA)",
      nomor: "8720441230",
    },
    lokasi_izin: ["Kantor Pusat Mataram", "Gudang Cakranegara"],
  };

  return (
    <div className="h-[100dvh] bg-gray-50 font-poppins flex flex-col overflow-hidden text-custom-gelap">
      {/* 1. Slim Header Profile - Tinggi dikurangi (h-48) */}
      <div className="relative bg-gradient-to-br from-custom-merah to-custom-gelap h-40 rounded-b-[45px] p-6 pt-2 shadow-xl flex-shrink-0 z-0">
        <div className="flex justify-between items-start mt-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl text-white active:scale-95 transition"
          >
            <FiArrowLeft size={22} />
          </button>
        </div>

        {/* Info Pegawai yang lebih compact */}
        <div className="flex items-center gap-5 mt-4 px-2">
          <div className="w-16 h-16 bg-white rounded-[22px] shadow-2xl flex items-center justify-center flex-shrink-0 border-2 border-white/20">
            <FiUser size={32} className="text-gray-300" />
          </div>
          <div className="overflow-hidden">
            <h1 className="text-lg font-black text-white uppercase tracking-tight truncate">
              {user.nama}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/20 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">
                {user.nik}
              </span>
              <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest italic truncate">
                {user.jabatan}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Content Area - Margin top disesuaikan */}
      <div className="pt-5 px-6 flex-1 overflow-y-auto pb-10 z-10">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Section: Data Pribadi */}
          <section className="bg-white rounded-[30px] p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[2px]">
                Data Pribadi
              </h3>
              <FiUser className="text-custom-merah" size={14} />
            </div>
            <div className="grid grid-cols-1 gap-4">
              <InfoBox
                label="Email Perusahaan"
                value={user.data_pribadi.email}
              />
              <InfoBox
                label="Nomor Telepon"
                value={user.data_pribadi.telepon}
              />
              <InfoBox
                label="Tanggal Lahir"
                value={user.data_pribadi.tgl_lahir}
              />
            </div>
          </section>

          {/* Section: Rekening (Style Kartu) */}
          <section className="bg-white rounded-[30px] p-6 shadow-sm border border-gray-100">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] mb-4">
              Informasi Payroll
            </h3>
            <div className="bg-gradient-to-r from-gray-900 to-custom-gelap p-5 rounded-2xl text-white relative overflow-hidden">
              <FiCreditCard
                className="absolute -right-4 -bottom-4 opacity-10"
                size={100}
              />
              <p className="text-[8px] font-black text-white/40 uppercase mb-1">
                {user.rekening.bank}
              </p>
              <p className="text-base font-black tracking-[3px]">
                {user.rekening.nomor}
              </p>
              <p className="text-[9px] font-bold text-white/60 mt-2 uppercase">
                {user.nama}
              </p>
            </div>
          </section>

          {/* Section: Pendidikan & Lokasi (Compact Row) */}
          <div className="grid grid-cols-1 gap-4">
            <section className="bg-white rounded-[30px] p-6 shadow-sm border border-gray-100">
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] mb-3">
                Pendidikan Terakhir
              </h3>
              <p className="text-xs font-black text-custom-gelap uppercase">
                {user.pendidikan.jenjang}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                {user.pendidikan.institusi}
              </p>
            </section>

            <section className="bg-white rounded-[30px] p-6 shadow-sm border border-gray-100">
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] mb-3">
                Wilayah Absensi
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.lokasi_izin.map((lokasi, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100"
                  >
                    <FiMapPin className="text-custom-merah" size={10} />
                    <span className="text-[9px] font-black text-custom-gelap uppercase tracking-tighter">
                      {lokasi}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <button className="w-full py-4 mt-2 bg-gray-100 text-gray-400 rounded-2xl font-black text-[10px] uppercase tracking-[2px] cursor-not-allowed">
            Update Data via HRD
          </button>
        </div>
      </div>
    </div>
  );
};

const InfoBox = ({ label, value }) => (
  <div className="flex flex-col border-b border-gray-50 pb-2">
    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">
      {label}
    </p>
    <p className="text-xs font-black text-custom-gelap uppercase mt-0.5">
      {value || "-"}
    </p>
  </div>
);

export default Profile;

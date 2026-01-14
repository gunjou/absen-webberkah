import React, { useState, useEffect } from "react";
import { FiArrowLeft, FiUser, FiMapPin, FiCreditCard } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import Api from "../Api"; // Pastikan path import benar
import dayjs from "dayjs";

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await Api.get("/pegawai/profile-absen");
        setProfile(res.data.data);
      } catch (err) {
        console.error("Gagal memuat profil:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (!profile && loading) {
    return (
      <div className="h-[100dvh] bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 border-4 border-custom-merah/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-custom-merah rounded-full animate-spin"></div>
          </div>
          <p className="text-[10px] font-black text-custom-gelap uppercase tracking-[3px]">
            Memuat Data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] bg-gray-50 font-poppins flex flex-col overflow-hidden text-custom-gelap">
      {/* 1. Header Section */}
      <div className="relative bg-gradient-to-br from-custom-merah to-custom-gelap h-40 rounded-b-[45px] p-6 pt-2 shadow-xl flex-shrink-0 z-0">
        <div className="flex justify-between items-start mt-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 backdrop-blur-md p-2.5 rounded-2xl text-white active:scale-95 transition"
          >
            <FiArrowLeft size={22} />
          </button>
        </div>

        <div className="flex items-center gap-5 mt-4 px-2">
          <div className="w-16 h-16 bg-white rounded-[22px] shadow-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-white/20">
            {profile.image_path ? (
              <img
                src={profile.image_path}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <FiUser size={32} className="text-gray-300" />
            )}
          </div>
          <div className="overflow-hidden">
            <h1 className="text-lg font-black text-white uppercase tracking-tight truncate">
              {profile.nama_lengkap}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="bg-white/20 text-white text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest">
                {profile.nip}
              </span>
              <p className="text-white/60 text-[9px] font-bold uppercase tracking-widest italic truncate">
                {profile.jabatan} • {profile.departemen}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="pt-5 px-6 flex-1 overflow-y-auto pb-10 z-10 custom-scrollbar">
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Data Pribadi */}
          <section className="bg-white rounded-[30px] p-6 shadow-sm border border-gray-100">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] mb-4">
              Data Pribadi
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <InfoBox label="Email" value={profile.email} />
              <InfoBox label="Nomor Telepon" value={profile.no_telepon} />
              <InfoBox
                label="Tanggal Lahir"
                value={dayjs(profile.tanggal_lahir).format("DD MMMM YYYY")}
              />
            </div>
          </section>

          {/* Informasi Payroll */}
          <section className="bg-white rounded-[30px] p-6 shadow-sm border border-gray-100">
            <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] mb-4">
              Informasi Payroll
            </h3>
            <div className="bg-gradient-to-r from-gray-900 to-custom-gelap p-5 rounded-2xl text-white relative overflow-hidden shadow-lg shadow-gray-200">
              <FiCreditCard
                className="absolute -right-4 -bottom-4 opacity-10"
                size={100}
              />
              <p className="text-[8px] font-black text-white/40 uppercase mb-1">
                {profile.rekening.nama_bank}
              </p>
              <p className="text-base font-black tracking-[3px]">
                {profile.rekening.no_rekening}
              </p>
              <p className="text-[9px] font-bold text-white/60 mt-2 uppercase">
                {profile.rekening.atas_nama}
              </p>
            </div>
          </section>

          {/* Pendidikan & Wilayah */}
          <div className="grid grid-cols-1 gap-4">
            <section className="bg-white rounded-[30px] p-6 shadow-sm border border-gray-100">
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] mb-3">
                Pendidikan Terakhir
              </h3>
              <p className="text-xs font-black text-custom-gelap uppercase">
                {profile.pendidikan.jenjang} - {profile.pendidikan.jurusan}
              </p>
              <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">
                {profile.pendidikan.institusi}
              </p>
            </section>

            <section className="bg-white rounded-[30px] p-6 shadow-sm border border-gray-100">
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[2px] mb-3">
                Wilayah Absensi
              </h3>
              <div className="flex flex-wrap gap-2">
                {profile.wilayah_absensi.map((lokasi, idx) => (
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
    <p className="text-xs font-black text-custom-gelap mt-0.5">
      {value || "-"}
    </p>
  </div>
);

export default Profile;

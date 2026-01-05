import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");

  // Jika tidak ada token, arahkan kembali ke login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, tampilkan halaman yang diminta (melalui Outlet)
  return <Outlet />;
};

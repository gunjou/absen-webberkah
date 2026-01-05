import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// Import Pages (Pastikan folder & file ini sudah Anda buat)
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import FormIzinSakit from "./pages/FormIzinSakit";
import FormLembur from "./pages/FormLembur";
import Riwayat from "./pages/Riwayat";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";

const ProtectedRoute = () => {
  const token = localStorage.getItem("token");
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* === ROUTE PUBLIC === */}
        <Route path="/login" element={<Login />} />

        {/* === ROUTE PROTECTED (Hanya untuk yang sudah login) === */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/riwayat" element={<Riwayat />} />
          <Route path="/izin-sakit" element={<FormIzinSakit />} />
          <Route path="/form-lembur" element={<FormLembur />} />
          {/* Anda bisa menambah rute lain di sini nantinya */}
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Route>

        {/* Redirect otomatis jika akses root (/) */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Fallback jika rute tidak ditemukan */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;

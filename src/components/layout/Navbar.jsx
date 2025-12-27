import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-xl border-b border-white/10">
      {/* Logo */}
      <Link to="/" className="text-xl font-extrabold tracking-tight text-white">
        Meet<span className="text-cyan-400">Pro</span>
      </Link>

      {/* Right Actions */}
      <div className="flex items-center gap-6 text-sm">
        <Link to="/" className="text-gray-300 hover:text-cyan-400 transition">
          Dashboard
        </Link>

        <button
          onClick={handleLogout}
          className="
            text-gray-300
            hover:text-red-400
            transition
            font-medium
          "
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

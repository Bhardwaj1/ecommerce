import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // clears user from context and localStorage
    navigate("/login"); // redirect to login page
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-800">
      <Link to="/" className="text-xl font-bold text-white">
        MeetPro
      </Link>
      <div className="flex gap-4">
        <Link to="/" className="hover:text-blue-400 text-white">
          Dashboard
        </Link>
        <button
          onClick={handleLogout}
          className="hover:text-blue-400 text-white"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

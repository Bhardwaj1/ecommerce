import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-gray-800">
      <Link to="/" className="text-xl font-bold">
        MeetPro
      </Link>
      <div className="flex gap-4">
        <Link to="/" className="hover:text-blue-400">
          Dashboard
        </Link>
        <Link to="/login" className="hover:text-blue-400">
          Logout
        </Link>
      </div>
    </nav>
  );
}

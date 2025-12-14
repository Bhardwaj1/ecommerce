import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-800 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold">Menu</h2>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="block py-2 px-3 rounded hover:bg-gray-700">
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/create-meeting" className="block py-2 px-3 rounded hover:bg-gray-700">
              Create Meeting
            </Link>
          </li>
          <li>
            <Link to="/join-meeting" className="block py-2 px-3 rounded hover:bg-gray-700">
              Join Meeting
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

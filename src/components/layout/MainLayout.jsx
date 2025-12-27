import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function MainLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#020617]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Sticky Navbar */}
        <div className="sticky top-0 z-40">
          <Navbar />
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#020617] p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

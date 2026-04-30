import { Outlet } from "react-router-dom";
import DashSidebar from "./DashSidebar";

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-white md:flex">
      <div className="flex-none">
        <DashSidebar />
      </div>
      <Outlet />
    </div>
  );
}

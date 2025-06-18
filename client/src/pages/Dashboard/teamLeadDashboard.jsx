import  Sidebar  from "../../components/TeamLead/Sidebar.jsx";
import Notifications from "../../components/TeamLead/Notifications";
import { Outlet } from "react-router-dom";

export default function TeamLeadDashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-grow relative bg-gray-50 p-6">
        <div className="absolute top-4 right-4">
          <Notifications />
        </div>
        <div className="bg-white p-6 rounded shadow">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

import { Sidebar } from '../../components/employee/Sidebar.jsx';
import { Outlet } from "react-router-dom";

function EmployeeDashboard() {
  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-grow p-6 bg-gray-50 relative r-19">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;

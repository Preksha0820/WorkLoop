import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const baseClass = "block px-4 py-2 rounded-lg font-semibold transition duration-200";
  const activeClass = "bg-white text-purple-900";
  const inactiveClass = "text-white hover:bg-white hover:text-purple-900";

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-400 to-blue-700 p-4 shadow-lg flex flex-col">
      <div className="mb-6 flex justify-center">
        <img src="/logos/logo2.png" alt="Logo" className="h-20 w-auto" />
      </div>

      <div className="w-full h-0.5 bg-white mb-6"></div>

      <nav className="flex flex-col gap-3">
        <NavLink to="/teamLeadDashboard/quick-stats" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
          Quick Stats
        </NavLink>

        <NavLink to="/teamLeadDashboard/manage-tasks" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
          Manage Tasks
        </NavLink>

        <NavLink to="/teamLeadDashboard/assign-task" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
          Assign Task
        </NavLink>

        <NavLink to="/teamLeadDashboard/team-reports" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
          Team Reports
        </NavLink>

        <NavLink to="/teamLeadDashboard/manage-employees" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
          Manage Employees
        </NavLink>
        <NavLink to="/teamLeadDashboard/chat" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
          Chat With Employees
        </NavLink>
        <NavLink to="/teamLeadDashboard/notifications" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
          Notifications
        </NavLink>
      </nav>
    </aside>
  );
}

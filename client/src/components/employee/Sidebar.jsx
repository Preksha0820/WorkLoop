import { NavLink } from "react-router-dom";
import React from "react";

export const Sidebar = () => {
  const baseClass = "block px-4 py-2 rounded-lg font-semibold transition duration-200";
  const activeClass = "bg-white text-purple-900";
  const inactiveClass = "text-white hover:bg-white hover:text-purple-900";

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-400 to-blue-700 p-4 shadow-lg flex flex-col">
      {/* Logo */}
      <div className="mb-6 flex justify-center">
        <img src="/logos/logo2.png" alt="Logo" className="h-20 w-auto" />
      </div>
      <div className="w-full h-0.5 bg-white mb-6"></div>

      {/* Navigation */}
      <nav className="flex flex-col gap-3">
      <NavLink
          to="/employeeDashboard"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Quick Stats
        </NavLink>
      <NavLink
          to="/employeeDashboard/my-tasks"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          My Tasks
        </NavLink>
        <NavLink
          to="/employeeDashboard/my-reports"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          My Reports
        </NavLink>
      
        <NavLink
          to="/employeeDashboard/notifications"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Notifications
        </NavLink>
        <NavLink
          to="/employeeDashboard/submit-report"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Submit Report
        </NavLink>
        <NavLink
          to="/employeeDashboard/chat"
          className={({ isActive }) =>
            `${baseClass} ${isActive ? activeClass : inactiveClass}`
          }
        >
          Chat With Team Lead
        </NavLink>
      </nav>
    </aside>
  );
};

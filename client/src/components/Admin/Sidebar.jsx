import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const baseClass = "block px-4 py-2 rounded-lg font-semibold transition duration-200";
  const activeClass = "bg-white text-purple-900";
  const inactiveClass = "text-white hover:bg-white hover:text-purple-900";
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-400 to-blue-700 p-4 shadow-lg flex flex-col">
      {/* Logo */}
      <div className="mb-6 flex justify-center">
        <img src="/logos/logo2.png" alt="Logo"  className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")} />
      </div>
      <div className="w-full h-0.5 bg-white mb-6"></div>

      <nav className="flex flex-col gap-3">
        <NavLink
          to="/adminDashboard"
          className={({ isActive }) => `${baseClass} ${inactiveClass}`}>
          My Employees
        </NavLink>

        <NavLink to="/adminDashboard/team-groups" className={({ isActive }) => `${baseClass} ${isActive ? activeClass : inactiveClass}`}>
          Team Groups
        </NavLink>

      </nav>
    </aside>
  );
}



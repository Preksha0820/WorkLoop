import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import {
  User, Settings, LogOut, CheckSquare, Shield, Users,
  BarChart3, ChevronDown, UserCheck, ClipboardList,
  Activity, Crown, FileText
} from "lucide-react";
import { HashLink } from "react-router-hash-link";
import NavbarRight from "./NavbarRight";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/auth");
    setIsProfileOpen(false);
  };

  const getRoleInfo = (role) => {
    switch (role) {
      case "ADMIN": return { label: "Admin", color: "bg-red-100 text-red-700", icon: Crown };
      case "TEAM_LEAD": return { label: "Team Lead", color: "bg-blue-100 text-blue-700", icon: Shield };
      case "EMPLOYEE": return { label: "Employee", color: "bg-green-100 text-green-700", icon: User };
      default: return { label: "User", color: "bg-gray-100 text-gray-700", icon: User };
    }
  };

  const roleInfo = user?.role ? getRoleInfo(user.role) : null;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="flex items-center justify-between px-6 py-2 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <img src="/logos/logo2.png" alt="Logo" className="h-14 w-auto" />
      </Link>

      <ul className={`hidden md:flex gap-6 text-blue-900 font-semibold ${
    location.pathname === "/auth" ? "mx-auto" : ""}`}>
        <li><Link to="/" className="hover:text-blue-700 transition-colors">Home</Link></li>
        <li><HashLink smooth to="/#features" className="hover:text-blue-700 transition-colors">Features</HashLink></li>
        <li><HashLink smooth to="/#companies" className="hover:text-blue-700 transition-colors">Clients</HashLink></li>
        <li><HashLink smooth to="/#book-demo" className="hover:text-blue-700 transition-colors">Want To Try?</HashLink></li>
        <li><HashLink smooth to="/#blog" className="hover:text-blue-700 transition-colors">Blog</HashLink></li>
      </ul>

      {!user && location.pathname !== "/auth" ? (
        <div className="flex gap-2">
          <Link to="/auth">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Sign up
            </button>
          </Link>
          <Link to="/auth">
            <button className="px-4 py-2 bg-gray-100 text-blue-900 rounded-md hover:bg-gray-200 transition-colors">
              Log in
            </button>
          </Link>
        </div>
      ) : (
        user && <NavbarRight />
      )}
    </nav>
  );
}

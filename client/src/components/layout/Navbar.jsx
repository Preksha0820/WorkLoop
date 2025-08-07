import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import {
  User, Settings, LogOut, CheckSquare, Shield, Users,
  BarChart3, ChevronDown, UserCheck, ClipboardList,
  Activity, Crown, FileText, Menu, X
} from "lucide-react";
import { HashLink } from "react-router-hash-link";
import NavbarRight from "./NavbarRight";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <nav className="flex items-center justify-between px-6 py-3 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center space-x-2">
        <img 
          src="/logos/logo3.jpg" 
          alt="Logo" 
          className="h-10 w-10 object-cover rounded-md" 
        />
      </Link>

      <ul className={`hidden md:flex gap-6 text-blue-900 font-semibold ${
    location.pathname === "/auth" ? "mx-auto" : ""}`}>
        <li><Link to="/" className="hover:text-blue-700 transition-colors">Home</Link></li>
        <li><HashLink smooth to="/#features" className="hover:text-blue-700 transition-colors">Features</HashLink></li>
        <li><HashLink smooth to="/#companies" className="hover:text-blue-700 transition-colors">Clients</HashLink></li>
        <li><HashLink smooth to="/#book-demo" className="hover:text-blue-700 transition-colors">Want To Try?</HashLink></li>
        <li><HashLink smooth to="/#blog" className="hover:text-blue-700 transition-colors">Blog</HashLink></li>
      </ul>

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 text-blue-900 hover:text-blue-700"
      >
        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

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

      {/* Mobile menu dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t border-gray-200">
          <div className="px-6 py-4 space-y-4">
            <Link to="/" className="block text-blue-900 hover:text-blue-700 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
            <HashLink smooth to="/#features" className="block text-blue-900 hover:text-blue-700 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Features</HashLink>
            <HashLink smooth to="/#companies" className="block text-blue-900 hover:text-blue-700 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Clients</HashLink>
            <HashLink smooth to="/#book-demo" className="block text-blue-900 hover:text-blue-700 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Want To Try?</HashLink>
            <HashLink smooth to="/#blog" className="block text-blue-900 hover:text-blue-700 font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Blog</HashLink>
          </div>
        </div>
      )}
    </nav>
  );
}

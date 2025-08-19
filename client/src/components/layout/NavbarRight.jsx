// src/components/layout/NavbarRight.jsx
import { useState, useRef, useEffect, lazy } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  ChevronDown,
  LogOut,
  User,
  Settings,
  CheckSquare,
  Shield,
  Users,
  BarChart3,
  UserCheck,
  ClipboardList,
  Activity,
  Crown,
  FileText,
} from "lucide-react";
import { act } from "react";

export default function NavbarRight() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/auth");
    setIsProfileOpen(false);
  };

  const getRoleInfo = (role) => {
    switch (role) {
      case "ADMIN":
        return {
          label: "Admin",
          color: "bg-red-100 text-red-700",
          icon: Crown,
        };
      case "TEAM_LEAD":
        return {
          label: "Team Lead",
          color: "bg-blue-100 text-blue-700",
          icon: Shield,
        };
      case "EMPLOYEE":
        return {
          label: "Employee",
          color: "bg-green-100 text-green-700",
          icon: User,
        };
      default:
        return {
          label: "User",
          color: "bg-gray-100 text-gray-700",
          icon: User,
        };
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

  const getProfileMenuItems = () => {
    const baseItems = [
      {
        icon: User,
        label: "My Profile",
        action: () => {
          let path = "/profile";
          if (user?.role === "EMPLOYEE") {
            path = "/employeeDashboard/my-profile";
          } else if (user?.role === "TEAM_LEAD") {
            path = "/teamLeadDashboard/my-profile";
          } else if (user?.role === "ADMIN") {
            path = "/adminDashboard/my-profile";
          }
          navigate(path);
          setIsProfileOpen(false);
        },
        description: "View and edit your profile",
      },
    ];

    if (user?.role === "ADMIN") {
      return [
        ...baseItems,
        {
          icon: Users,
          label: "All Employees",
          action: () => navigate("/adminDashboard"),
          description: "Manage all employees",
        },
      ];
    } else if (user?.role === "TEAM_LEAD") {
      return [
        ...baseItems,
        {
          icon: BarChart3,
          label: "Tasks Overview",
          action: () => navigate("/teamLeadDashboard/manage-tasks"),
          description: " Manage your team members",
        },
        {
          icon: Settings,
          label: "Settings",
          action: () => navigate("/teamLeadDashboard/settings"),
          description: "Personal settings",
        },
      ];
    } else {
      return [
        ...baseItems,
        {
          icon: CheckSquare,
          label: "My Tasks",
          action: () => navigate("/employeeDashboard"),
          description: "View your assigned tasks",
        },
        {
          icon: Settings,
          label: "Settings",
          action: () => navigate("/employeeDashboard/settings"),
          description: "Personal settings",
        },
      ];
    }
  };

  return (
    <div className="flex gap-3 ">
      {user && (
        <div className="relative " ref={dropdownRef}>
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 px-3 py-2 bg-white border-[1px] border-indigo-400 rounded-full hover:shadow-md hover:border-blue-300 hover:border-b-2 transition-all duration-100 group"
          >
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md ">
                {user.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2)
                  : user.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-gray-900 font-medium text-sm leading-tight">
                {user.name || user.email?.split("@")[0] || "User"}
              </span>

              {user.role && (
                <span className="text-gray-500 text-xs capitalize">
                  {user.role}
                </span>
              )}
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-500 transition-all duration-200 ${
                isProfileOpen ? "rotate-180 text-gray-700" : ""
              } group-hover:text-gray-700`}
            />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
              {/* Top info */}
              <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {user.name
                        ? user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                            .slice(0, 2)
                        : user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 text-base">
                      {user.name || "User"}
                    </p>
                    <p className="text-sm text-gray-600">{user.email}</p>

                    {user.id && (
                      <p className="text-xs text-gray-500">ID: {user.id}</p>
                    )}

                    {user.role && roleInfo && (
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 text-xs ${roleInfo.color} rounded-full capitalize font-medium shadow-sm`}
                        >
                          <roleInfo.icon size={12} />
                          {roleInfo.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-2 max-h-80 overflow-y-auto">
                {getProfileMenuItems().map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      item.action();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-start gap-4 px-6 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100">
                      <item.icon
                        size={16}
                        className="text-gray-600 group-hover:text-blue-600"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 group-hover:text-blue-900">
                        {item.label}
                      </div>
                      {item.description && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Logout */}
              <div className="border-t border-gray-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-6 py-3 text-left text-red-600 hover:bg-red-50 transition-colors group"
                >
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200">
                    <LogOut size={18} className="text-red-600" />
                  </div>
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import {
  User,
  Settings,
  LogOut,
  CheckSquare,
  Shield,
  Users,
  BarChart3,
  ChevronDown,
  UserCheck,
  ClipboardList,
  Activity,
  Crown,
  FileText,
} from "lucide-react";
import { HashLink } from "react-router-hash-link";

export default function Navbar() {
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
        return { label: "Admin", color: "bg-red-100 text-red-700", icon: Crown };
      case "TEAM_LEAD":
        return { label: "Team Lead", color: "bg-blue-100 text-blue-700", icon: Shield };
      case "EMPLOYEE":
        return { label: "Employee", color: "bg-green-100 text-green-700", icon: User };
      default:
        return { label: "User", color: "bg-gray-100 text-gray-700", icon: User };
    }
  };

  const roleInfo = user?.role ? getRoleInfo(user.role) : null;

  // ✅ Corrected useEffect block
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
          navigate("/profile");
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
          action: () => {
            navigate("/admin/employees");
            setIsProfileOpen(false);
          },
          description: "Manage all employees",
        },
        {
          icon: ClipboardList,
          label: "All Tasks",
          action: () => {
            navigate("/admin/tasks");
            setIsProfileOpen(false);
          },
          description: "View and manage all tasks",
        },
        {
          icon: BarChart3,
          label: "Analytics & Reports",
          action: () => {
            navigate("/admin/analytics");
            setIsProfileOpen(false);
          },
          description: "View system analytics",
        },
        {
          icon: Crown,
          label: "Admin Dashboard",
          action: () => {
            navigate("/admin/dashboard");
            setIsProfileOpen(false);
          },
          description: "Administrative overview",
        },
        {
          icon: Settings,
          label: "System Settings",
          action: () => {
            navigate("/admin/settings");
            setIsProfileOpen(false);
          },
          description: "Configure system settings",
        },
      ];
    } else if (user?.role === "TEAM_LEAD") {
      return [
        ...baseItems,
        {
          icon: CheckSquare,
          label: "My Tasks",
          action: () => {
            navigate("/tasks");
            setIsProfileOpen(false);
          },
          description: "View your assigned tasks",
        },
        {
          icon: UserCheck,
          label: "Team Members",
          action: () => {
            navigate("/team-lead/employees");
            setIsProfileOpen(false);
          },
          description: "Manage your team",
        },
        {
          icon: ClipboardList,
          label: "Assigned Tasks",
          action: () => {
            navigate("/team-lead/assigned-tasks");
            setIsProfileOpen(false);
          },
          description: "Tasks assigned to team",
        },
        {
          icon: Activity,
          label: "Team Performance",
          action: () => {
            navigate("/team-lead/performance");
            setIsProfileOpen(false);
          },
          description: "Track team progress",
        },
        {
          icon: FileText,
          label: "Task Assignment",
          action: () => {
            navigate("/team-lead/assign-tasks");
            setIsProfileOpen(false);
          },
          description: "Assign new tasks",
        },
        {
          icon: Settings,
          label: "Settings",
          action: () => {
            navigate("/settings");
            setIsProfileOpen(false);
          },
          description: "Personal settings",
        },
      ];
    } else {
      return [
        ...baseItems,
        {
          icon: CheckSquare,
          label: "My Tasks",
          action: () => {
            navigate("/employee/tasks");
            setIsProfileOpen(false);
          },
          description: "View your assigned tasks",
        },
        {
          icon: Activity,
          label: "Task Progress",
          action: () => {
            navigate("/employee/progress");
            setIsProfileOpen(false);
          },
          description: "Track your progress",
        },
        {
          icon: FileText,
          label: "Task History",
          action: () => {
            navigate("/employee/history");
            setIsProfileOpen(false);
          },
          description: "View completed tasks",
        },
        {
          icon: Settings,
          label: "Settings",
          action: () => {
            navigate("/settings");
            setIsProfileOpen(false);
          },
          description: "Personal settings",
        },
      ];
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 py-2 bg-white shadow-md fixed top-0 left-0 right-0 z-50 ">
      <Link to="/">
        <img src="/logos/logo2.png" alt="Logo" className="h-14 w-auto" />
      </Link>

      <ul className="hidden md:flex gap-6 text-blue-900 font-semibold">
        <li><Link to="/" className="hover:text-blue-700 transition-colors">Home</Link></li>
        <li><HashLink smooth to="/#features">Features</HashLink></li>
        <li><HashLink smooth to="/#companies">Clients</HashLink></li>
        <li><HashLink smooth to="/#book-demo">Want To Try?</HashLink></li>
        <li><a href="#blog" className="hover:text-blue-700 transition-colors">Blog</a></li>
      </ul>

      <div className="flex gap-3">
        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-3 px-3 py-2 bg-white border border-gray-200 rounded-full hover:shadow-md hover:border-gray-300 transition-all duration-200 group"
            >
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-md">
                  {user.name
                    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                    : user.email?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>

              <div className="hidden sm:flex flex-col items-start">
                <span className="text-gray-900 font-medium text-sm leading-tight">
                  {user.name || user.email?.split('@')[0] || 'User'}
                </span>
                {user.role && (
                  <span className="text-gray-500 text-xs capitalize">
                    {user.role}
                  </span>
                )}
              </div>

              <ChevronDown
                size={16}
                className={`text-gray-500 transition-all duration-200 ${isProfileOpen ? 'rotate-180 text-gray-700' : ''} group-hover:text-gray-700`}
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-72 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {user.name
                          ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                          : user.email?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 text-base">
                        {user.name || 'User'}
                      </p>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      {user.role && roleInfo && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs ${roleInfo.color} rounded-full capitalize font-medium shadow-sm`}>
                            <roleInfo.icon size={12} />
                            {roleInfo.label}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="py-2 max-h-80 overflow-y-auto">
                  {getProfileMenuItems().map((item, index) => (
                    <button
                      key={index}
                      onClick={item.action}
                      className="w-full flex items-start gap-4 px-6 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors group"
                    >
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-blue-100 transition-colors flex-shrink-0 mt-0.5">
                        <item.icon size={16} className="text-gray-600 group-hover:text-blue-600 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                          {item.label}
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                            {item.description}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                <div className="border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-3 text-left text-red-600 hover:bg-red-50 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                      <LogOut size={18} className="text-red-600" />
                    </div>
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </nav>
  );
}

import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import NavbarRight from "./components/layout/NavbarRight";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import PrivateRoute from "./components/common/PrivateRoute";
import EmployeeDashboard from "./pages/Dashboard/employeeDashboard";
import TeamLeadDashboard from "./pages/Dashboard/teamLeadDashboard";
import AdminDashboard from "./pages/Dashboard/adminDashboard";

// Employee Components
import QuickStats from "./components/employee/QuickStats";
import MyTasks from "./components/employee/MyTasks";
import MyReports from "./components/employee/MyReports";
import Notifications from "./components/employee/Notifications";

// Team Lead Components
import TLQuickStats from "./components/TeamLead/QuickStats";
import ManageTasks from "./components/TeamLead/ManageTasks";
import TeamReports from "./components/TeamLead/TeamReports";
import TLNotifications from "./components/TeamLead/Notifications";
import ManageEmployees from "./components/TeamLead/ManageEmployees";

export default function App() {
  const location = useLocation();

  const isDashboardRoute = location.pathname.startsWith("/employeeDashboard") ||
                           location.pathname.startsWith("/adminDashboard") ||
                           location.pathname.startsWith("/teamLeadDashboard");

  const isAuthPage = location.pathname === "/auth";
  const hideFooter = isDashboardRoute || isAuthPage;

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!isDashboardRoute && <Navbar isAuthPage={isAuthPage} />}

      {isDashboardRoute && (
        <div className="fixed top-3 right-3 z-50">
          <NavbarRight />
        </div>
      )}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route element={<PrivateRoute />}>
            {/* Employee Dashboard */}
            <Route path="/employeeDashboard" element={<EmployeeDashboard />}>
              <Route path="quick-stats" element={<QuickStats />} />
              <Route path="my-tasks" element={<MyTasks />} />
              <Route path="my-reports" element={<MyReports />} />
              <Route path="notifications" element={<Notifications />} />
              <Route index element={<QuickStats />} />
            </Route>

            {/* Team Lead Dashboard */}
            <Route path="/teamLeadDashboard" element={<TeamLeadDashboard />}>
              <Route path="quick-stats" element={<TLQuickStats />} />
              <Route path="manage-tasks" element={<ManageTasks />} />
              <Route path="manage-employees" element={<ManageEmployees />} />
              <Route path="team-reports" element={<TeamReports />} />
              <Route path="notifications" element={<TLNotifications />} />
              <Route index element={<TLQuickStats />} />
            </Route>

            {/* Admin Dashboard */}
            <Route path="/adminDashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

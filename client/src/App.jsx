import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import NavbarRight from "./components/layout/NavbarRight";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import PrivateRoute from "./components/common/PrivateRoute";
import EmployeeDashboard from "./pages/Dashboard/employeeDashboard";
import QuickStats from "./components/employee/QuickStats";
import MyTasks from "./components/employee/MyTasks";
import MyReports from "./components/employee/MyReports";
import Notifications from "./components/employee/Notifications";
import AdminDashboard from "./pages/Dashboard/adminDashboard";
import TeamLeadDashboard from "./pages/Dashboard/teamLeadDashboard";

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
            <Route path="/employeeDashboard" element={<EmployeeDashboard />}>
              <Route path="quick-stats" element={<QuickStats />} />
              <Route path="my-tasks" element={<MyTasks />} />
              <Route path="my-reports" element={<MyReports />} />
              <Route path="notifications" element={<Notifications />} />
              {/* Optional: Redirect to quick-stats by default */}
              <Route index element={<QuickStats />} />
            </Route>
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            <Route path="/teamLeadDashboard" element={<TeamLeadDashboard />} />
          </Route>
        </Routes>
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
}

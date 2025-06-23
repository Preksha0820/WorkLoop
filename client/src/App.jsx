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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Employee Components
import QuickStats from "./components/employee/QuickStats";
import MyTasks from "./components/employee/MyTasks";
import MyReports from "./components/employee/MyReports";
import SubmitReport from "./components/employee/submitReport";
import ChatTeamLead from "./components/employee/ChatTeamLead";
import EmployeeProfile from "./components/employee/EmployeeProfile";
import Settings from "./components/employee/Settings";

// Team Lead Components
import TLQuickStats from "./components/TeamLead/QuickStats";
import ManageTasks from "./components/TeamLead/ManageTasks";
import TeamReports from "./components/TeamLead/TeamReports";
import ManageEmployees from "./components/TeamLead/ManageEmployees";
import AssignTaskPage from "./components/TeamLead/AssignTasks";
import ChatWithEmployees from "./components/TeamLead/ChatWithEmployees";
import TLSettings from "./components/TeamLead/Settings";

// Admin Components
import MyEmployees from "./components/Admin/MyEmployees";
import TeamGroups from "./components/Admin/TeamGroups";
import TeamLeadProfile from "./components/TeamLead/TeamLeadProfile";


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
              <Route path="" element={<QuickStats />} />
              <Route path="my-tasks" element={<MyTasks />} />
              <Route path="my-reports" element={<MyReports />} />
              <Route path="submit-report" element={<SubmitReport />} />
              <Route path="chat" element={<ChatTeamLead />} />
              <Route path="/employeeDashboard/my-profile" element={<EmployeeProfile />}/>
              <Route path="/employeeDashboard/settings" element={<Settings />}/>
              <Route index element={<QuickStats />} />
            </Route>

            {/* Team Lead Dashboard */}
            <Route path="/teamLeadDashboard" element={<TeamLeadDashboard />}>
              <Route path="quick-stats" element={<TLQuickStats />} />
              <Route path="manage-tasks" element={<ManageTasks />} />
              <Route path="manage-employees" element={<ManageEmployees />} />
              <Route path="team-reports" element={<TeamReports />} />
              <Route path="assign-task" element={<AssignTaskPage />} />
              <Route path="notifications" element={<TLNotifications />} />
              <Route path="chat" element={<ChatWithEmployees/>}/>
              <Route path="/teamLeadDashboard/my-profile"element={<TeamLeadProfile />}/>
              <Route path="/teamLeadDashboard/settings" element={<TLSettings />} />
              <Route index element={<TLQuickStats />} />
            </Route>

            <Route path="/adminDashboard" element={<AdminDashboard />}>
              {/* <Route path="/adminDashboard/my-profile" element={<AdminProfile />}/> */}
              <Route path="team-groups" element={<TeamGroups />} />
              <Route index element={<MyEmployees />} />
            </Route>
          </Route>
        </Routes>
      </main>

      <ToastContainer position="top-right" autoClose={3000} />
      {!hideFooter && <Footer />}
    </div>
  );
}

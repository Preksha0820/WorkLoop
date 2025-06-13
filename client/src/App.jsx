import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard/employeeDashboard";
import PrivateRoute from "./components/common/PrivateRoute";
import Features from "./components/HomeComponents/Features";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      {/* Add padding top to account for fixed navbar height */}
      <main className="flex-grow"> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </div>
  );
} 


import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Companies from "./components/Companies.jsx";
import Demo from "./components/Demo.jsx";
import Features from "./components/Features.jsx";
import Footer from "./components/Footer.jsx";
import Inside from "./components/Inside.jsx";
import AuthPage from "./pages/AuthPage.jsx";
import FeaturesPage from "./pages/Features.jsx";


function App() {
  return (
    <div className="font-sans">
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Hero />
              <Inside />
              <Companies />
              <Demo />
              <Features />
              <Footer />
            </>
          }
        />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/features" element={<FeaturesPage />} />
      </Routes>
    </div>
  );
}

export default App;

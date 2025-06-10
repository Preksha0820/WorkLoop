import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import Clients from "./components/Companies.jsx";
import Features from "./components/Features.jsx";

function App() {
  return (
    <div className="font-sans">
      <Navbar />
      <Hero />
      <Clients />
      <Features />
    </div>
  );
}

export default App;

import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-2 bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      {/* Logo */}
      <Link to="/">
        <img src="/logos/logo2.png" alt="Logo" className="h-14 w-auto" />
      </Link>

      {/* Menu Items */}
      <ul className="hidden md:flex gap-6 text-blue-900 font-semibold">
        <li><Link to="/">Home</Link></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#clients">Clients</a></li>
        <li><a href="#contact">Contact</a></li>
        <li><a href="#blog">Blog</a></li>
      </ul>

      {/* Auth Buttons */}
      <div className="flex gap-3">
        <Link to="/auth">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
            Sign up
          </button>
        </Link>
        <Link to="/auth">
          <button className="px-4 py-2 bg-gray-100 text-blue-900 rounded-md hover:bg-gray-200 transition">
            Log in
          </button>
        </Link>
      </div>
    </nav>
  );
}

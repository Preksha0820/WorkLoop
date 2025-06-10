// src/components/Navbar.jsx
export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <div className="text-2xl font-bold text-pink-600">TASK <span className="text-blue-900">TRACKER</span></div>
      <ul className="hidden md:flex gap-6 text-blue-900 font-semibold">
        <li><a href="#">Home</a></li>
        <li><a href="#">Features</a></li>
        <li><a href="#">Pricing</a></li>
        <li><a href="#">Clients</a></li>
        <li><a href="#">Contact</a></li>
        <li><a href="#">Blog</a></li>
        <li><a href="#">Sales Tracker</a></li>
      </ul>
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-pink-500 text-white rounded-md">Sign up</button>
        <button className="px-4 py-2 bg-gray-100 text-blue-900 rounded-md">Log in</button>
      </div>
    </nav>
  );
}

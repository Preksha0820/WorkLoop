// src/components/Footer.jsx
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#10101a] text-white px-6 md:px-20 py-4 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Brand */}
        <div>
          <img src="/logos/logo2.png" alt="Logo"  className="h-20 w-auto cursor-pointer hover:opacity-80 transition-opacity" onClick={() => navigate("/")} />
          <p className="mt-2 text-sm text-gray-300">
            Simplify your work tracking.
          </p>
          <div className="flex gap-3 mt-4">
            <img src="/icons/fb.png" alt="Facebook" className="w-8 h-8" />
            <img src="/icons/tw.png" alt="Twitter" className="w-8 h-8" />
            <img src="/logos/social.png" alt="Instagram" className="w-8 h-8" />
            <img src="/icons/lk.png" alt="LinkedIn" className="w-8 h-8" />
          </div>
        </div>

        {/* Company */}
        <div>
          <h4 className="font-semibold mb-2">Company</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>Home</li>
            <li>Features</li>
            <li>About Us</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold mb-2">Resources</h4>
          <ul className="space-y-1 text-sm text-gray-300">
            <li>Blog</li>
            <li>FAQs</li>
            <li>Privacy Policy</li>
            <li>Terms & Conditions</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold mb-2">Get in Touch</h4>
          <p className="text-sm text-gray-300">support@workloop.io</p>
          <p className="text-sm text-gray-300 mt-1">+91 91746 41748</p>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 pt-4 text-center text-xs text-gray-400">
        © WorkLoop 2025. All rights reserved.
      </div>
    </footer>
  );
}

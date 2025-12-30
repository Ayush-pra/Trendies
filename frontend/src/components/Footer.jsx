import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0B1220] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="col-span-1 lg:col-span-2">
            <div className="flex items-start mb-4">
              <img src="/image/logo.png" alt="Trendies Logo" className="w-10 h-10 mr-3" />
              <span className="text-2xl font-bold text-gray-200">Trendies</span>
            </div>

            <p className="text-gray-400 mb-6 max-w-md text-base leading-relaxed">
              Your one-stop destination for the latest fashion & lifestyle.
              Discover curated collections that redefine your style.
            </p>

            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
                </svg>
              </a>

              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.343 3.608 1.319.975.975 1.257 2.242 1.319 3.608.058 1.266.069 1.645.069 4.84 0 3.196-.012 3.575-.07 4.841-.062 1.366-.344 2.633-1.319 3.608-.975.975-2.242 1.257-3.608 1.319-1.266.058-1.645.069-4.84.069-3.196 0-3.575-.012-4.841-.07-1.366-.062-2.633-.344-3.608-1.319-.975-.975-1.257-2.242-1.319-3.608-.058-1.266-.069-1.645-.069-4.84 0-3.196.012-3.575.07-4.841.062-1.366.344-2.633 1.319-3.608.975-.975 2.242-1.257 3.608-1.319C8.425 2.175 8.804 2.163 12 2.163z"/>
                </svg>
              </a>

              <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0012 7.77v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-amber-400 transition">Home</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-amber-400 transition">About Us</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Delivery</a></li>
              <li><a href="#" className="text-gray-400 hover:text-amber-400 transition">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-gray-400">
              <li>123 Fashion Street, Trend City, TC 10101</li>
              <li>support@trendies.com</li>
              <li>+1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Trendies. All rights reserved.
          </p>

          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-amber-400 text-sm transition">Terms</a>
            <a href="#" className="text-gray-500 hover:text-amber-400 text-sm transition">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-amber-400 text-sm transition">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

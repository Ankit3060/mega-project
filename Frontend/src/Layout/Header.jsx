import React from "react";
import { Bell } from "lucide-react";

function Header() {
  return (
    <header className="bg-[#0f172a] text-white px-6 py-3 flex items-center justify-between">
      {/* Left: Logo + Nav */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <img src="./public/logo.png" alt="Logo" className="h-6" />

        {/* Nav */}
        <nav>
          <ul className="flex space-x-6">
            <li>
              <a
                href="/"
                className="text-sm font-medium text-indigo-400 border-b-2 border-indigo-400 pb-1"
              >
                Dashboard
              </a>
            </li>
            <li>
              <a href="/team" className="text-sm font-medium hover:text-gray-300">
                Team
              </a>
            </li>
            <li>
              <a href="/projects" className="text-sm font-medium hover:text-gray-300">
                Projects
              </a>
            </li>
            <li>
              <a href="/calendar" className="text-sm font-medium hover:text-gray-300">
                Calendar
              </a>
            </li>
          </ul>
        </nav>
      </div>

      {/* Right: Search + Icons */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="bg-[#1e293b] text-sm text-gray-300 placeholder-gray-400 rounded-md pl-9 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <svg
            className="w-4 h-4 text-gray-400 absolute left-3 top-2.5"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z"
            />
          </svg>
        </div>

        {/* Notification Bell */}
        <button className="p-2 rounded-full hover:bg-[#1e293b]">
          <Bell className="w-5 h-5" />
        </button>

        {/* Avatar */}
        <img
          src="/avatar.jpg"
          alt="User Avatar"
          className="w-8 h-8 rounded-full border border-gray-600"
        />
      </div>
    </header>
  );
}

export default Header;

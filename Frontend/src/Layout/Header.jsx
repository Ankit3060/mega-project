import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate} from "react-router-dom";
import { Bell, X, Menu, Sun, Moon } from "lucide-react";
import { IoMdHome } from "react-icons/io";
import { MdExplore } from "react-icons/md";
import { FaPenFancy } from "react-icons/fa";
import { FaCircleInfo } from "react-icons/fa6";
import { IoSearchSharp } from "react-icons/io5";
import { useAuth } from "../Context/authContext";
import axios from "axios";
import { toast } from "react-toastify";

function Header() {
  const [isAvatarOpen, setIsAvatarOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const { isAuthenticated, setIsAuthenticated, user, setUser, accessToken, setAccessToken } = useAuth();

  const navigateTo = useNavigate();

  const avatarRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (avatarRef.current && !avatarRef.current.contains(e.target)) {
        setIsAvatarOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        setSearchOpen(false);
      }
    }
    if (searchOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [searchOpen]);

  const handleLogout = async () => {
    try {
      await axios.post(`http://localhost:4000/api/v1/auth/logout`,
        {}, 
        {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
        },
      });
      toast.success("Logged out successfully!");
      setUser(null);
      setIsAuthenticated(false);
      setAccessToken(null);
      navigateTo("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      setIsAvatarOpen(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 left-0 w-full z-50 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white px-4 sm:px-6 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <button
              className="sm:hidden p-2 rounded-md hover:bg-white/10 transition-all duration-300"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          ) : null}

          <div className="flex items-center space-x-3 cursor-pointer">
            <img src="./public/logo.png" alt="Logo" className="h-9 w-auto" />
            <div className="flex flex-col">
              <span className="hidden sm:block text-xl font-bold tracking-wide">
                AK Blog
              </span>
              <span className="hidden md:inline text-xs text-gray-400">
                A Social Media for Sharing Stories
              </span>
            </div>
          </div>
        </div>

        {!isAuthenticated ? (
          <div className="flex items-center space-x-2">
            <NavLink
              to="/login"
              className="px-4 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
            >
              Login
            </NavLink>
            <NavLink
              to="/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Signup
            </NavLink>
          </div>
        ) : (
          <>
            {/* Desktop Nav */}
            <nav className="hidden md:block">
              <ul className="flex space-x-8">
                <li>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `text-sm font-medium ${
                        isActive
                          ? "text-indigo-400 border-b-2 border-indigo-400 pb-1"
                          : "text-gray-300 hover:text-indigo-300"
                      } transition`
                    }
                  >
                    <IoMdHome className="inline-block mr-1 text-xl mb-1" /> Home
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/explore"
                    className={({ isActive }) =>
                      `text-sm font-medium ${
                        isActive
                          ? "text-indigo-400 border-b-2 border-indigo-400 pb-1"
                          : "text-gray-300 hover:text-indigo-300"
                      } transition`
                    }
                  >
                    <MdExplore className="inline-block mr-1 text-xl mb-1" />{" "}
                    Explore
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `text-sm font-medium ${
                        isActive
                          ? "text-indigo-400 border-b-2 border-indigo-400 pb-1"
                          : "text-gray-300 hover:text-indigo-300"
                      } transition`
                    }
                  >
                    <FaCircleInfo className="inline-block mr-1 text-xl mb-1" />{" "}
                    About Us
                  </NavLink>
                </li>
              </ul>
            </nav>

            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search posts, users..."
                  className="bg-white/10 backdrop-blur-md text-sm text-gray-200 placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <IoSearchSharp className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              </div>

              <NavLink
                to="/create"
                className="flex items-center gap-1 text-sm font-medium bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded-lg transition"
              >
                <FaPenFancy className="text-lg" />
                <span className="hidden sm:inline">Write</span>
              </NavLink>

              <button className="p-2 rounded-full hover:bg-white/10 transition">
                <Sun className="w-5 h-5 text-yellow-400" />
              </button>

              <div className="relative" ref={notifRef}>
                <button
                  onClick={() => setIsNotifOpen(!isNotifOpen)}
                  className="relative p-2 rounded-full hover:text-indigo-300 cursor-pointer transition"
                >
                  <Bell className="w-5 h-5" />
                </button>

                {isNotifOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-[#1e293b] border border-gray-700 rounded-lg shadow-lg py-3 px-4 text-sm text-gray-300 z-50">
                    <p className="text-center">🔔 No new notifications</p>
                  </div>
                )}
              </div>

              <button
                className="sm:hidden p-2 rounded-full hover:bg-white/10 transition"
                onClick={() => setSearchOpen(true)}
              >
                <IoSearchSharp className="w-5 h-5" />
              </button>

              <div className="relative" ref={avatarRef}>
                <div
                  className="flex items-center space-x-2 cursor-pointer hover:opacity-90 transition"
                  onClick={() => setIsAvatarOpen(!isAvatarOpen)}
                >
                  <img
                    src={user.avatar.url}
                    alt="User Avatar"
                    className="w-9 h-9 rounded-full border-2 border-indigo-500 shadow-md"
                  />
                  <span className="hidden md:inline text-sm font-medium">
                    {user.fullName.split(" ")[0]}
                  </span>
                </div>

                {isAvatarOpen && (
                  <div className="absolute right-0 mt-3 w-44 bg-[#1e293b] border border-gray-700 rounded-lg shadow-lg py-2 z-50">
                    <NavLink
                      to="/user/profile"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-indigo-500/20 hover:text-indigo-300 transition"
                    >
                      Profile
                    </NavLink>
                    <NavLink
                      to="/user/update/profile"
                      className="block px-4 py-2 text-sm text-gray-200 hover:bg-indigo-500/20 hover:text-indigo-300 transition"
                    >
                      Update Profile
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="w-full cursor-pointer text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 hover:text-red-300 transition"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Nav Drawer */}
            {menuOpen && (
              <div className="absolute top-full left-0 w-full bg-[#1e293b] border-t border-gray-700 shadow-lg sm:hidden z-50">
                <ul className="flex flex-col p-4 space-y-3">
                  <li>
                    <NavLink
                      to="/"
                      className="flex items-center gap-2 text-gray-200 hover:text-indigo-300 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      <IoMdHome className="text-xl" /> Home
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/explore"
                      className="flex items-center gap-2 text-gray-200 hover:text-indigo-300 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      <MdExplore className="text-xl" /> Explore
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/about"
                      className="flex items-center gap-2 text-gray-200 hover:text-indigo-300 transition"
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaCircleInfo className="text-xl" /> About Us
                    </NavLink>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </header>

      {/* Full-Screen Mobile Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] sm:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          />

          <div className="relative bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white p-4 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search posts, users..."
                  className="w-full bg-white/10 backdrop-blur-md text-gray-200 placeholder-gray-400 rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  autoFocus
                />
                <IoSearchSharp className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" />
              </div>

              <button
                onClick={() => setSearchOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="relative bg-[#1e293b]/95 h-full p-4 overflow-y-auto">
            <div className="text-center text-gray-400 mt-8">
              <p>Start typing to search...</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;

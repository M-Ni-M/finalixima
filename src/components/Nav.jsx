import React from "react";
import logo from "/images/bb.png";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router";
import DropdownMenu from "./DropdownMenu";
import BackButton from "./BackButton";

export const Nav = () => {
  return (
    <>
      <nav className="w-full h-[10vh] flex justify-between items-center p-4 bg-[#f2f2f2c7] shadow-md text-black fixed z-50">
        {/* Left section - Back button and Logo */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <BackButton />
          </div>
          <Link to="/" className="flex-shrink-0">
            <img 
              src={logo} 
              width={70} 
              alt="Logo" 
              className="w-[50px] md:w-[70px]" 
            />
          </Link>
        </div>

        {/* Center section - Search bar */}
        <div className="hidden sm:flex flex-1 mx-4 max-w-[500px] rounded-md outline-none overflow-hidden">
          <input
            type="text"
            placeholder="Search Something..."
            className="w-full outline-none bg-white text-gray-600 text-sm px-4 md:px-8 py-2 md:py-3"
          />
          <button
            type="button"
            className="flex text-white items-center justify-center bg-red-800 px-3 md:px-5"
          >
            <FaSearch />
          </button>
        </div>

        {/* Right section - Search icon (mobile) and Dashboard */}
        <div className="flex items-center space-x-4">
          {/* Mobile Search Icon */}
          <div className="sm:hidden flex items-center">
            <button
              type="button"
              className="text-gray-600 hover:text-red-800"
            >
              <FaSearch size={20} />
            </button>
          </div>

          {/* Dashboard Link */}
          <Link to="/dashboard" className="flex-shrink-0">
            <div className="flex items-center gap-2 font-[MuseoModerno] hover:text-red-600">
              <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-[50%] bg-red-800 text-white cursor-pointer text-sm md:text-base">
                D
              </div>
              <span className="hidden sm:inline">Dashboard</span>
            </div>
          </Link>
        </div>
      </nav>

      {/* Mobile Back Button - appears below navbar */}
      <div className="md:hidden fixed top-[10vh] w-full bg-[#f2f2f2c7] z-40 py-2 px-4 shadow-sm">
        <BackButton />
      </div>
    </>
  );
};

export default Nav;
import React from "react";
import logo from "/images/bb.png";
import { Link } from "react-router";
import DropdownMenu from "./DropdownMenu";
export const Nav = () => {
  return (
    <>
      <nav className="w-full h-[10vh] flex justify-between items-center p-4 bg-[#f2f2f2c7] shadow-md text-black fixed">
        <Link to="/">
          {" "}
          <img src={logo} width={70} alt="" />
        </Link>

        <div className="flex rounded-md outline-none overflow-hidden">
          <input
            type="email"
            placeholder="Search Something..."
            className="w-full outline-none bg-white text-gray-600 text-sm px-8 py-3"
          />
          <button
            type="button"
            className="flex items-center justify-center bg-red-800 px-5"
          >
          </button>
        </div> 
        <Link to='/dashboard'> 
          <div className="font-[MuseoModerno] flex items-center justify-center w-[3vw] h-[3vw] rounded-[50%] bg-red-800 text-white cursor-pointer">
            D
          </div>
        </Link>
      </nav>
    </>
  );
};
export default Nav;

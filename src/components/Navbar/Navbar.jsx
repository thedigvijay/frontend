import React, { useState } from "react";
import { IoHeart } from "react-icons/io5";
import { HiShoppingBag } from "react-icons/hi2";
import { CiSearch } from "react-icons/ci";
import { TbMenu2, TbMenu3 } from "react-icons/tb";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () =>{
    setShowMenu (!showMenu)
  }
  // const toggleMenu = () => {
  //   setShowMenu(!showMenu);
  // };

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white  ">
      <nav className="max-w-[1400px] mx-auto px-10 flex md:h-[14vh] h-[12vh] justify-between items-center">
        {/* Logo */}
        <a href="#" className="text-3xl font-bold text-black">
          Gr
          <span className="uppercase text-orange-500">o</span>
          cify
        </a>

        {/* Links */}
        <ul className="md:flex items-center gap-x-10 hidden">
          <li>
            <a
              href="#"
              className="font-semibold tracking-wider text-orange-500"
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="#"
              className="font-semibold tracking-wider text-zinc-800 hover:text-orange-500"
            >
              About Us
            </a>
          </li>

          <li>
            <a
              href="#"
              className="font-semibold tracking-wider text-zinc-800 hover:text-orange-500"
            >
              Process
            </a>
          </li>

          <li>
            <a
              href="#"
              className="font-semibold tracking-wider text-zinc-800 hover:text-orange-500"
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Nav Action */}
        <div className="flex items-center gap-x-5">
          {/* Search */}
          <div className="md:flex items-center gap-x-2 border border-orange-500 rounded-full border-2 px-3 py-1 hidden">
            <input
              type="text"
              name="text-search"
              id="text-search"
              autoComplete="off"
              placeholder="Search..."
              className="w-[200px] outline-none border-none"
            />

            <button className="w-10 h-10 rounded-full bg-gradient-to-b from-orange-400 to-orange-500 flex items-center justify-center">
              <CiSearch className="text-xl text-white" />
            </button>
          </div>

          {/* Icons */}
          <a href="#" className="text-zinc-800 text-2xl">
            <IoHeart />
          </a>

          <a href="#" className="text-zinc-800 text-2xl">
            <HiShoppingBag />
          </a>

          {/* Hamburger */}
          <a
            href="#"
            className="text-zinc-800 text-2xl md:hidden"
            onClick={toggleMenu}
          >
            {showMenu ? <TbMenu3 /> : <TbMenu2 />}
          </a>
        </div>

        {/* Mobile Menu */}

        <ul
          className={`flex flex-col gap-y-12 bg-orange-500/15 backdrop-blur-xl rounded-xl  p-10 items-center gap-x-10 md:hidden absolute top-30 -left-full transform -translate-x-1/2 transition-all duration-500 ${showMenu ? "left-1/2" : ""} `}
        >
          <li>
            <a
              href="#"
              className="font-semibold tracking-wider text-orange-500"
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="#"
              className="font-semibold tracking-wider text-zinc-800 hover:text-orange-500"
            >
              About Us
            </a>
          </li>

          <li>
            <a
              href="#"
              className="font-semibold tracking-wider text-zinc-800 hover:text-orange-500"
            >
              Process
            </a>
          </li>

          <li>
            <a
              href="#"
              className="font-semibold tracking-wider text-zinc-800 hover:text-orange-500"
            >
              Contact
            </a>
          </li>
          <li className=" flex items-center gap-x-2 border border-orange-500 rounded-full border-2 px-3 py-1 md:hidden">
            <input
              type="text"
              name="text-search"
              id="text-search"
              autoComplete="off"
              placeholder="Search..."
              className="w-[200px] outline-none border-none"
            />

            <button className="w-10 h-10 rounded-full bg-gradient-to-b from-orange-400 to-orange-500 flex items-center justify-center">
              <CiSearch className="text-xl text-white" />
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;

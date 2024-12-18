"use client";
import { navbarData } from "@/data/common/header";
import Whatsapp from "@/icons/whatsapp";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import SubMenu from "./sub-menu";

export default function Header() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleMenu = (index, event) => {
    event.stopPropagation();
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleMenu = () => {
    setOpenSidebar(!openSidebar);
  };

  return (
    <header
      className="bg-black bg-opacity-60 z-[99] relative w-full"
      id="site-header"
    >
      <div className="container">
        <div className="header-main flex items-center justify-between w-full">
          <div className="logo text-2xl font-bold text-white">LOGO</div>
          <button
            className="block md:hidden py-1 px-2 rounded-lg bg-slate-500"
            onClick={handleMenu}
          >
            <Menu />
          </button>
          <nav
            className={`fixed md:relative left-0 top-0 bottom-0 height-[100dvh] md:w-auto w-[300px] md:translate-x-0 ease-in-out duration-300 md:bg-transparent bg-slate-800 max-h-full   ${
              openSidebar
                ? "translate-x-0 overflow-hidden overflow-y-auto"
                : "translate-x-[-100%]"
            }`}
          >
            <div className="logo text-2xl font-bold text-white md:hidden px-4 py-2 pr-0 flex items-center justify-between mb-3 sticky top-0 w-full z-10 bg-slate-800">
              <span>LOGO</span>
              <button className="p-2 rounded-lg" onClick={handleMenu}>
                <X />
              </button>
            </div>
            <ul className="flex items-center md:flex-nowrap flex-wrap">
              {navbarData?.map((item, index) => (
                <React.Fragment key={index}>
                  <li className="relative flex md:flex-nowrap flex-wrap group md:w-auto w-full">
                    <Link
                      href={item?.path}
                      className="py-3 px-4 text-white md:w-auto w-full"
                      onMouseEnter={(event) => toggleMenu(index, event)}
                      onMouseLeave={(event) => toggleMenu(index, event)}
                    >
                      {item?.name}
                    </Link>
                    {item?.subMenu?.length > 0 && (
                      <button
                        className="md:hidden block p-2 z-10 absolute top-1 right-0 text-white border-l border-slate-700"
                        onClick={(event) => toggleMenu(index, event)}
                      >
                        <ChevronDown />
                      </button>
                    )}
                    {item?.subMenu?.length > 0 && activeIndex === index && (
                      <SubMenu
                        subMenu={item?.subMenu}
                        index={index}
                        activeIndex={activeIndex}
                        toggleMenu={toggleMenu}
                      />
                    )}
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </nav>
          <div className="contact md:block hidden">
            <button className="flex items-center gap-2 bg-purple-800 text-white py-2 px-4 rounded-md">
              <span>
                <Whatsapp width="20px" height="20px" fill="currentColor" />
              </span>
              <span>91 1234567890</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

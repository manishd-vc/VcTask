"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState(null);
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState(null);
  const mobileMenuRef = useRef(null);

  const toggleMegaMenu = (menu) => {
    setActiveMegaMenu(menu);
  };

  const toggleMobileSubmenu = (submenu) => {
    setActiveMobileSubmenu(activeMobileSubmenu === submenu ? null : submenu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const renderMegaMenuContent = (menu) => {
    if (menu === "blog") {
      return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">BLOG</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Checkerboard
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Masonry
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Two Columns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Three Columns
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Three Col Full Width
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Four Col Full Width
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              STANDARD
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Large Images
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Small Images
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Right Sidebar
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Left Sidebar
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              POST TYPES
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Audio
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Gallery
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Link
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Quote
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Image
                </Link>
              </li>
              <li>
                <Link href="#" className="text-gray-600 hover:text-blue-600">
                  Video
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              LATEST POSTS
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-2">
                <img
                  src="/placeholder.svg?height=50&width=50"
                  alt="Workforce"
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <Link
                    href="#"
                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    Workforce a security
                  </Link>
                  <p className="text-xs text-gray-500">Sep 9, 2019</p>
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <img
                  src="/placeholder.svg?height=50&width=50"
                  alt="One call for IT"
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <Link
                    href="#"
                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    One call for IT
                  </Link>
                  <p className="text-xs text-gray-500">Sep 9, 2019</p>
                </div>
              </li>
              <li className="flex items-center space-x-2">
                <img
                  src="/placeholder.svg?height=50&width=50"
                  alt="Monroe county"
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <Link
                    href="#"
                    className="text-sm font-medium text-gray-900 hover:text-blue-600"
                  >
                    Monroe county
                  </Link>
                  <p className="text-xs text-gray-500">Sep 9, 2019</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      );
    }
    // Add other mega menu content for 'home', 'pages', 'portfolio', and 'shop' here
    return null;
  };

  return (
    <header className="w-full">
      {/* Top Bar */}
      <div className="hidden w-full bg-gray-900 px-4 py-2 md:block">
        <div className="container">
          <div className="flex items-center justify-between text-sm text-white">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {/* <Mail className="h-4 w-4" /> */}
                <span>&#129031;</span>
                <span>info@company.com</span>
              </div>
              <div className="flex items-center space-x-2">
                {/* <MapPin className="h-4 w-4" /> */}
                <span>&#129031;</span>
                <span>121 King Street, Melbourne, Australia</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Social Media Links */}
              <span>&#129031;</span>
              <Link href="#" className="hover:text-blue-400">
                Facebook
              </Link>
              <Link href="#" className="hover:text-blue-400">
                Twitter
              </Link>
              <Link href="#" className="hover:text-blue-400">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-gradient-to-r from-blue-900 to-cyan-800">
        <div className="container">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-white">setech</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:block">
              <ul className="flex space-x-6">
                {["home", "pages", "blog", "portfolio", "shop"].map((item) => (
                  <li key={item} className="group relative">
                    <button
                      onMouseEnter={() => toggleMegaMenu(item)}
                      onMouseLeave={() => toggleMegaMenu(null)}
                      className="text-white hover:text-blue-200 transition-colors duration-200"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                    <div
                      className={`absolute left-0 w-screen bg-white shadow-lg mt-2 transition-all duration-300 ease-in-out ${
                        activeMegaMenu === item
                          ? "opacity-100 visible translate-y-0"
                          : "opacity-0 invisible -translate-y-2"
                      }`}
                      style={{ left: "50%", transform: "translateX(-50%)" }}
                      onMouseEnter={() => toggleMegaMenu(item)}
                      onMouseLeave={() => toggleMegaMenu(null)}
                    >
                      <div className="mx-auto max-w-7xl px-4 py-6">
                        {renderMegaMenuContent(item)}
                      </div>
                    </div>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contacts"
                    className="text-white hover:text-blue-200 transition-colors duration-200"
                  >
                    Contacts
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Contact Number */}
            <div className="hidden items-center space-x-2 md:flex">
              {/* <Phone className="h-5 w-5 text-white" /> */}
              <span>&#129031;</span>
              <span className="text-lg font-semibold text-white">
                0712 819 79 555
              </span>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-white md:hidden"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                //   <X className="h-6 w-6" />
                <span>X</span>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            ref={mobileMenuRef}
            className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
              isMenuOpen ? "translate-x-0" : "-translate-x-full"
            } md:hidden`}
          >
            <div className="p-4">
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                {/* <X className="h-6 w-6" /> */}
                <span>X</span>
              </button>
              <ul className="space-y-2 mt-8">
                {["home", "pages", "blog", "portfolio", "shop"].map((item) => (
                  <li key={item} className="border-b border-gray-200">
                    <button
                      onClick={() => toggleMobileSubmenu(item)}
                      className="flex w-full items-center justify-between py-2 text-gray-900 hover:text-blue-600"
                    >
                      {item.charAt(0).toUpperCase() + item.slice(1)}
                      {/* <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        activeMobileSubmenu === item ? "rotate-180" : ""
                      }`}
                    /> */}
                      <span>&#129031;</span>
                    </button>
                    <div
                      className={`mt-2 space-y-2 overflow-hidden transition-all duration-300 ease-in-out ${
                        activeMobileSubmenu === item ? "max-h-96" : "max-h-0"
                      }`}
                    >
                      {renderMegaMenuContent(item)}
                    </div>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contacts"
                    className="block py-2 text-gray-900 hover:text-blue-600"
                  >
                    Contacts
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

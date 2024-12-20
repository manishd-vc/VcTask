"use client";
import useScreenSize from "@/hooks/useScreenSize";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function SubMenu({ subMenu, index, activeIndex, toggleMenu }) {
  const [headerElement, setHeaderElement] = useState(null);
  const { screenWidth } = useScreenSize();
  console.log("subMenu", subMenu);

  useEffect(() => {
    // Find the header element dynamically
    const element = document.getElementById("site-header");
    if (element) {
      setHeaderElement(element);
    }
  }, []);

  const renderSubmenu = () => {
    return (
      <div className="container">
        <div className="submenu-inner flex md:flex-nowrap flex-wrap">
          {subMenu?.map((item, index) => (
            <div
              className="submenu-col md:flex-1 md:min-w-60 p-3 md:w-auto w-full"
              key={index}
            >
              {item?.heading && (
                <div className="font-semibold text-xl mb-3">
                  {item?.heading}
                </div>
              )}
              {item?.submenuList?.length > 0 && (
                <ul>
                  {item?.submenuList?.map((item, index) => (
                    <li key={index} className="flex">
                      <Link href={item?.path} className="md:p-2 p-1">
                        {item?.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  if (headerElement && screenWidth >= 768) {
    return createPortal(
      <div
        role="alert"
        className={`submenu bg-white md:absolute ease-in-out duration-300 top-full left-0 md:block w-screen 
    ${index === activeIndex ? "block" : "hidden"}`}
        onMouseEnter={(event) => toggleMenu(index, event)}
        onMouseLeave={(event) => toggleMenu(index, event)}
      >
        {renderSubmenu()}
      </div>,
      headerElement
    );
  }
  if (headerElement && screenWidth < 768) {
    return renderSubmenu();
  }
}

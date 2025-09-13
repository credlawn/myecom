'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDownIcon, UserIcon } from "@/lib/icons";
import { MenuResponse } from "@/myapi/menuList";
import { Settings } from "@/myapi/apiData/settings";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuData: MenuResponse[];
  settings: Settings;
  isLoggedIn: boolean;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  userName: string;
}

export default function Sidebar({ 
  isOpen, 
  onClose, 
  menuData, 
  isLoggedIn, 
  onLoginClick, 
  onLogoutClick, 
  userName 
}: SidebarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuButtonRef = useRef<HTMLButtonElement>(null);

  const sortedMenuData = (menuData ?? [])
    .filter((item) => item.parent && item.parent.menu_name)
    .sort((a, b) => (a.parent?.parent_id || 0) - (b.parent?.parent_id || 0))
    .map((item) => ({
      ...item,
      children: (item.children ?? []).sort(
        (a, b) => (a.child_id || 0) - (b.child_id || 0),
      ),
    }));

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node) &&
        userMenuButtonRef.current &&
        !userMenuButtonRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = (title: string) => {
    setOpenMenu(openMenu === title ? null : title);
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      setIsUserMenuOpen(!isUserMenuOpen);
    } else {
      onClose();
      onLoginClick();
    }
  };

  return (
    <div
      className={`no-scrollbar fixed top-0 flex h-dvh max-w-full flex-col overflow-x-hidden bg-white-a700 shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? "left-0" : "left-[-100%]"
      }`}
      style={{ width: "326px", zIndex: 1000 }}
    >
      {/* Header */}
      <div className="relative flex items-center justify-between bg-gray-50 p-4 border-b border-gray-200">
        <h4 className="text-lg font-medium capitalize !leading-tight text-gray-900">
          {isLoggedIn ? `Hi, ${userName}` : "Hi Guest"}
        </h4>
        <button
          ref={userMenuButtonRef}
          onClick={handleAuthClick}
          className="relative flex gap-2 items-center justify-center overflow-hidden capitalize rounded-full font-medium transition-colors duration-200 !leading-tight"
          aria-label={isLoggedIn ? "Open user menu" : "Login"}
        >
          <UserIcon className="size-6 text-[#e63631]" />
        </button>

        {isUserMenuOpen && isLoggedIn && (
          <div ref={userMenuRef} className="absolute right-4 top-14 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-20">
            <Link href="/dashboard">
              <div
                onClick={() => {
                  setIsUserMenuOpen(false);
                  onClose();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Dashboard
              </div>
            </Link>
            <button
              onClick={() => {
                setIsUserMenuOpen(false);
                onLogoutClick();
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto bg-white p-4">
        <ul className="space-y-4">
          {sortedMenuData.map((item) => (
            <li key={item.parent.slug}>
              <div>
                <div
                  className="flex pb-3 pr-3 pt-2 cursor-pointer"
                  onClick={() =>
                    item.children.length > 0 &&
                    toggleMenu(item.parent.menu_name)
                  }
                >
                  <a
                    className="flex grow items-center justify-between"
                    href={
                      item.children.length > 0
                        ? undefined
                        : `/${item.parent.slug}`
                    }
                  >
                    <h4 className="text-base capitalize !leading-tight text-gray-900 font-semibold">
                      {item.parent.menu_name}
                    </h4>
                  </a>
                  {item.children.length > 0 && (
                    <ChevronDownIcon
                      className={`mt-0.5 h-3 w-3 transition-transform duration-300 ${
                        openMenu === item.parent.menu_name ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </div>

                {item.children.length > 0 && (
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openMenu === item.parent.menu_name ? "h-auto" : "h-0"
                    }`}
                  >
                    <ul>
                      {item.children.map((child, index) => (
                        <li
                          key={child.slug}
                          className={
                            index < item.children.length - 1
                              ? "border-b-[0.5px] border-b-gray-300"
                              : ""
                          }
                        >
                          <a
                            className="w-full py-2.5 block"
                            href={`/${child.slug}`}
                          >
                            <p className="text-sm font-normal !leading-tight text-gray-900 capitalize">
                              {child.menu_name}
                            </p>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="h-[0.5px] w-full bg-gray-300"></div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
"use client";

import { HamburgerIcon, UserIcon, CartIcon, ArrowDownIcon, SearchIcon } from "@/lib/icons";
import { Logo, LogoMobile } from "@/lib/logo";
import TopBanner from "@/lib/topBanner";
import SearchBox from "@/lib/searchBox";
import Sidebar from "@/lib/sidebar";
import { Settings } from "@/models/settings";
import { useState, useRef, useEffect } from "react";
import { NavItems } from "@/lib/navItems";

interface HeadTopProps {
  settings: Settings;
}

export default function HeadTop({ settings }: HeadTopProps) {


  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarButtonRef = useRef<HTMLButtonElement>(null);

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current && 
        !searchRef.current.contains(event.target as Node) &&
        !searchButtonRef.current?.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutsideSidebar = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node) &&
        !sidebarButtonRef.current?.contains(event.target as Node)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutsideSidebar);
    return () => {
      document.removeEventListener("mousedown", handleClickOutsideSidebar);
    };
  }, []);

  return (
    <div className="max-h-[100dvh] overflow-visible">
      {settings.showBanner === 1 && <TopBanner href={settings.url} messages={settings.bannerMessages} />}

      <header className="relative">
        <div className="container-main flex items-center border-b-[0.5px] border-solid border-gray-300_01 bg-white h-13 px-4">

          {/* Desktop View */}
          <div className="hidden lg:flex items-center justify-between w-full h-8">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>
            <NavItems />

            {/* Center: Navigation */}
            

            {/* Right: Search + Icons */}
            <div className="flex items-center gap-4">
              {/* Search Box Component */}
              <SearchBox onSearch={handleSearch} className="w-80" />
              
              {/* User Icons */}
              <div className="flex items-center gap-6">
                <UserIcon />
                <CartIcon />
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="flex lg:hidden items-center justify-between w-full h-6 relative">
            {/* Left: Hamburger */}
            <div className="flex-shrink-0">
              <button 
                ref={sidebarButtonRef}
                className="flex items-center justify-center"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Menu"
              >
                <HamburgerIcon />
              </button>
            </div>
            <div ref={sidebarRef}>
              <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            </div>

            {/* Mobile: Logo */}
            <div className="flex justify-center flex-1">
              {settings.showMobileLogo === 1 && <LogoMobile />}
            </div>

            {/* Right: Icons + Search */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button 
                ref={searchButtonRef}
                className="flex items-center justify-center"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <SearchIcon />
              </button>
              <UserIcon />
              <CartIcon />
            </div>
          </div>

          {/* Mobile Search Bar - Full width, absolute positioning */}
          {isSearchOpen && (
            <div ref={searchRef} className="flex lg:hidden w-full absolute top-full left-0 right-0 bg-white py-2 px-4 z-50 shadow-lg border-t border-gray-200">
              <SearchBox 
                onSearch={handleSearch} 
                className="w-full"
                onFocus={() => setIsSearchOpen(true)}
              />
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

'use client';

import { HamburgerIcon, UserIcon, CartIcon, SearchIcon, HeartIcon } from "@/lib/icons";
import { useShoppingCart } from '@/app/cart/useShoppingCart';
import { useWishlist } from '@/app/wishlist/useWishlist';
import { Logo, LogoMobile } from "@/lib/logo";
import SearchBox from "@/lib/searchBox";
import Sidebar from "@/lib/sidebar";
import { Settings } from "@/myapi/apiData/settings";
import { useState, useRef, useEffect } from "react";
import { LoginResponse } from "@/app/auth/MyLogin";
import SigninPage from "@/app/auth/SigninPage";
import SignupPage from "@/app/auth/SignupPage";
import CartSlider from "@/app/cart/CartSlider";
import WishlistSlider from '@/app/wishlist/WishlistSlider';
import { NavItems } from "@/lib/navItems";
import Link from "next/link";
import { getCookie } from 'cookies-next'; // Add this import

interface HeadTopProps {
  settings: Settings;
}

export default function HeadTop({ settings }: HeadTopProps) {
  const { wishlistCount } = useWishlist();
  const { cartCount } = useShoppingCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const sidebarButtonRef = useRef<HTMLButtonElement>(null);

  const [isCartSliderOpen, setIsCartSliderOpen] = useState(false);
  const [isWishlistSliderOpen, setIsWishlistSliderOpen] = useState(false);
  const [isSigninOpen, setIsSigninOpen] = useState(false);
  const [isSignupOpen, setIsSignupOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  const handleSearch = (query: string) => {
    console.log("Search query:", query);
  };

  // Check login status on component mount
  useEffect(() => {
    const checkLoginStatus = () => {
      const sid = getCookie('sid');
      const user = getCookie('user');
      
      if (sid && user) {
        setIsLoggedIn(true);
        setUserName(user as string);
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    };

    checkLoginStatus();
  }, []);

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    return () => document.removeEventListener("mousedown", handleClickOutsideSidebar);
  }, []);

  const handleLoginSuccess = (res: LoginResponse) => {
    if (res.status === 'success') {
      setIsLoggedIn(true);
      setUserName(res.full_name || res.user || '');
    }
    setIsSigninOpen(false);
  };

  const handleLogout = () => {
    // Clear cookies
    document.cookie = "sid=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "user=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "visitor_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    
    setIsLoggedIn(false);
    setUserName('');
    
    // Refresh page to ensure clean state
    window.location.reload();
  };

  return (
    <div className="max-h-[100dvh] overflow-visible">
      <header className="relative">
        <div className="container-main flex items-center border-b-[0.5px] border-solid border-gray-300_01 bg-white h-13 px-4">
          {/* Desktop View */}
          <div className="hidden lg:flex items-center justify-between w-full h-8">
            {/* Left: Logo */}
            <div className="flex-shrink-0">
              <Link href="/">
                <div className="cursor-pointer">
                  <Logo logoUrl={settings.logo_url} />
                </div>
              </Link>
            </div>

            {/* Center: Navigation */}
            <NavItems menuData={settings.menuData} />

            {/* Right: Search + Icons */}
            <div className="flex items-center gap-4">
              <SearchBox onSearch={handleSearch} className="w-80" />

              {/* User Icons */}
              <div className="flex items-center gap-6">
                <button onClick={() => setIsWishlistSliderOpen(true)} className="relative hover:text-red-500 transition-colors">
                  <HeartIcon />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </button>
                {isLoggedIn ? (
                  <div className="relative group">
                    <button className="hover:text-red-500 transition-colors">
                      <UserIcon />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 hidden group-hover:block">
                      <span className="block px-4 py-2 text-sm text-gray-700">Hello, {userName}</span>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setIsSigninOpen(true)} className="hover:text-red-500 transition-colors">
                    <UserIcon />
                  </button>
                )}
                <button onClick={() => setIsCartSliderOpen(true)} className="relative hover:text-red-500 transition-colors">
                  <CartIcon />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="flex lg:hidden items-center justify-between w-full h-6 relative">
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
              <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                menuData={settings?.menuData ?? []}
                settings={settings}
              />
            </div>

            <div className="flex justify-center flex-1">
              {settings.showMobileLogo === 1 && (
                <LogoMobile logoUrl={settings.logo_url} />
              )}
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                ref={searchButtonRef}
                className="flex items-center justify-center"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                aria-label="Search"
              >
                <SearchIcon />
              </button>
              <button onClick={() => setIsWishlistSliderOpen(true)} className="relative hover:text-red-500 transition-colors">
                <HeartIcon />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>
              {isLoggedIn ? (
                <div className="relative group">
                  <button className="hover:text-red-500 transition-colors">
                    <UserIcon />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 hidden group-hover:block">
                    <span className="block px-4 py-2 text-sm text-gray-700">Hello, {userName}</span>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setIsSigninOpen(true)} className="hover:text-red-500 transition-colors">
                  <UserIcon />
                </button>
              )}
              <button onClick={() => setIsCartSliderOpen(true)} className="relative hover:text-red-500 transition-colors">
                <CartIcon />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          {isSearchOpen && (
            <div
              ref={searchRef}
              className="flex lg:hidden w-full absolute top-full left-0 right-0 bg-white py-2 px-4 z-50 shadow-lg border-t border-gray-200"
            >
              <SearchBox
                onSearch={handleSearch}
                className="w-full"
                onFocus={() => setIsSearchOpen(true)}
              />
            </div>
          )}
        </div>
      </header>

      {/* Cart Slider */}
      <CartSlider
        isOpen={isCartSliderOpen}
        onClose={() => setIsCartSliderOpen(false)}
      />

      {/* Signin Page */}
      <SigninPage
        isOpen={isSigninOpen}
        onClose={() => setIsSigninOpen(false)}
        onSignupClick={() => {
          setIsSigninOpen(false);
          setIsSignupOpen(true);
        }}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Signup Page */}
      <SignupPage
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
      />

      {/* Wishlist Slider */}
      <WishlistSlider
        isOpen={isWishlistSliderOpen}
        onClose={() => setIsWishlistSliderOpen(false)}
      />
    </div>
  );
}
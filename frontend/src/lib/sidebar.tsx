"use client";

import { useState } from "react";
import { CloseIcon, ChevronDownIcon } from "@/lib/icons";
import { LogoSidebar } from "@/lib/logo";

interface MenuItem {
  title: string;
  href: string;
  subItems?: SubItem[];
}

interface SubItem {
  title: string;
  href: string;
}

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const menuItems: MenuItem[] = [
    {
      title: "Skin",
      href: "/collections/skin-care",
      subItems: [
        { title: "Face Wash", href: "/collections/face-wash-men-and-women" },
        { title: "Face Scrub", href: "/collections/face-scrub" }
      ]
    },
    {
      title: "Hair",
      href: "/collections/hair-care",
      subItems: [
        { title: "Hair Oil", href: "/collections/hair-oil" },
        { title: "Hair Combo Kit", href: "/collections/hair-care-kit" }
      ]
    }
  ];

  const toggleMenu = (title: string) => {
    setOpenMenu(openMenu === title ? null : title);
  };

  return (
    <div 
      className={`no-scrollbar fixed top-0 flex h-dvh max-w-full flex-col overflow-x-hidden bg-white-a700 shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? "left-0" : "left-[-100%]"
      }`} 
      style={{ width: "326px", zIndex: 1000 }}
    >
      {/* Header */}
      {/* Header */}
        <div className="flex items-center justify-between bg-white p-4 border-b border-gray-200">
            <LogoSidebar />

        <div className="ml-2 flex flex-1 flex-col gap-0.5">
            <h4 className="text-lg font-medium capitalize !leading-tight text-gray-900">
            Hi Guest
            </h4>
            <div className="relative flex w-fit cursor-pointer items-center gap-1">
            <p className="text-sm font-normal !leading-tight text-[#e63631]">Login</p>
            <ChevronDownIcon className="size-4 text-[#e63631]" />
            <div className="absolute -bottom-[3px] left-0 h-[0.5px] w-[55px] bg-[#e63631]"></div>
            </div>
        </div>
        <button 
            onClick={onClose}
            className="relative flex gap-2 items-center justify-center overflow-hidden capitalize rounded-full font-medium transition-colors duration-200 !leading-tight" 
            aria-label="Close menu"
        >
            <CloseIcon className="text-gray-600" />
        </button>
        </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
        <ul className="space-y-4">
          {menuItems.map((item) => (
            <li key={item.title}>
              <div>
                <div 
                  className="flex pb-3 pr-3 pt-2 cursor-pointer"
                  onClick={() => item.subItems && toggleMenu(item.title)}
                >
                  <a 
                    className="flex grow items-center justify-between"
                    href={item.subItems ? undefined : item.href}
                  >
                    <h4 className="text-base capitalize !leading-tight text-gray-900 font-semibold">
                      {item.title}
                    </h4>
                  </a>
                  {item.subItems && (
                    <ChevronDownIcon 
                      className={`mt-0.5 h-3 w-3 transition-transform duration-300 ${
                        openMenu === item.title ? "rotate-180" : ""
                      }`} 
                    />
                  )}
                </div>
                
                {/* Sub Items */}
                {item.subItems && (
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openMenu === item.title ? "h-auto" : "h-0"
                    }`}
                  >
                    <ul>
                      {item.subItems.map((subItem, index) => (
                        <li 
                          key={subItem.title}
                          className={index < item.subItems!.length - 1 ? "border-b-[0.5px] border-b-gray-300" : ""}
                        >
                          <a className="w-full py-2.5 block" href={subItem.href}>
                            <p className="text-sm font-normal !leading-tight text-gray-900 capitalize">
                              {subItem.title}
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
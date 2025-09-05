"use client";

import { useState } from "react";
import { ChevronDownIcon, UserIcon } from "@/lib/icons";
import { MenuResponse } from "@/myapi/menuList";
import { Settings } from "@/myapi/apiData/settings";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  menuData: MenuResponse[];
  settings: Settings;
}

export default function Sidebar({ isOpen, onClose, menuData }: SidebarProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Sort parents by parent_id and children by child_id
  const sortedMenuData = (menuData ?? [])
    .filter((item) => item.parent && item.parent.menu_name)
    .sort((a, b) => (a.parent?.parent_id || 0) - (b.parent?.parent_id || 0))
    .map((item) => ({
      ...item,
      children: (item.children ?? []).sort(
        (a, b) => (a.child_id || 0) - (b.child_id || 0),
      ),
    }));

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
      <div className="flex items-center justify-between bg-gray-50 p-4 border-b border-gray-200">
        <h4 className="text-lg font-medium capitalize !leading-tight text-gray-900">
          Hi Guest
        </h4>
        <button
          onClick={onClose}
          className="relative flex gap-2 items-center justify-center overflow-hidden capitalize rounded-full font-medium transition-colors duration-200 !leading-tight"
          aria-label="Login"
        >
          <UserIcon className="size-6 text-[#e63631]" />
        </button>
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

                {/* Sub Items */}
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

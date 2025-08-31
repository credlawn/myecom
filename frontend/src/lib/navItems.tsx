"use client";

import Link from "next/link";
import { ArrowDownIcon } from "@/lib/icons";
import { MenuResponse } from "@/myapi/menuList";

interface NavItemsProps {
  menuData: MenuResponse[];
}

export function NavItems({ menuData }: NavItemsProps) {
  if (!menuData || menuData.length === 0) {
    return null;
  }

  // Sort parents and children
  const sortedMenuData = menuData
    .sort((a, b) => (a.parent.parent_id || 0) - (b.parent.parent_id || 0))
    .map((item) => ({
      ...item,
      children: item.children?.sort(
        (a, b) => (a.child_id || 0) - (b.child_id || 0),
      ),
    }));

  return (
    <div className="flex flex-1 justify-left pl-20">
      <ul className="flex gap-x-3 xl:gap-x-4 xxl:gap-x-5">
        {sortedMenuData.map((menu) => (
          <li key={menu.parent.parent_id} className="group relative">
            <Link
              className="flex cursor-pointer items-center gap-1 justify-center"
              href={`/${menu.parent.slug || ""}`}
            >
              <p className="text-xs sm:text-sm lg:text-base font-normal !leading-tight text-gray-900 capitalize">
                {menu.parent.menu_name}
              </p>
              {menu.children && menu.children.length > 0 && <ArrowDownIcon />}
            </Link>

            {/* Dropdown for children */}
            {menu.children && menu.children.length > 0 && (
              <div
                className="invisible absolute left-1/2 z-[99] w-fit min-w-28 pt-3 opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100"
                style={{ transform: "translateX(-50%)" }}
              >
                <div className="w-full rounded bg-white-a700_01 p-3 shadow">
                  <div className="flex flex-col gap-3">
                    {menu.children.map((child) => (
                      <Link
                        key={child.child_id}
                        className="self-center"
                        href={`/${child.slug || ""}`}
                      >
                        <p className="text-xs md:text-sm font-normal !leading-tight text-gray-900 truncate capitalize">
                          {child.menu_name}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

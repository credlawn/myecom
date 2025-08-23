"use client";

import { ArrowDownIcon } from "@/lib/icons";
import { MenuResponse } from "./api";

interface DynamicNavItemsProps {
  menuData: MenuResponse[];
}

export const DynamicNavItems = ({ menuData }: DynamicNavItemsProps) => {
  // Sort parents by parent_id and children by child_id
  const sortedMenuData = menuData
    .filter((item) => item.parent.menu_type === "Parent")
    .sort((a, b) => (a.parent.parent_id || 0) - (b.parent.parent_id || 0))
    .map((item) => ({
      ...item,
      children: item.children.sort(
        (a, b) => (a.child_id || 0) - (b.child_id || 0),
      ),
    }));

  return (
    <div className="flex flex-1 justify-left pl-20">
      <ul className="flex gap-x-3 xl:gap-x-4 xxl:gap-x-5">
        {sortedMenuData.map((menuItem) => (
          <li key={menuItem.parent.slug} className="group relative">
            {" "}
            {/* Use slug as key */}
            <a
              className="flex cursor-pointer items-center gap-1 justify-center"
              href={`/collections/${menuItem.parent.slug}`} // Use slug for URL
            >
              <p className="text-xs sm:text-sm lg:text-base font-normal !leading-tight text-gray-900 capitalize">
                {menuItem.parent.menu_name}
              </p>
              {menuItem.children.length > 0 && <ArrowDownIcon />}
            </a>
            {menuItem.children.length > 0 && (
              <div
                className="invisible absolute left-1/2 z-[99] w-fit min-w-28 pt-3 opacity-0 transition-all duration-300 ease-in-out group-hover:visible group-hover:opacity-100"
                style={{ transform: "translateX(-50%)" }}
              >
                <div className="w-full rounded bg-white-a700_01 p-3 shadow">
                  <div className="flex flex-col gap-3">
                    {menuItem.children.map((child) => (
                      <a
                        key={child.slug} // Use slug as key
                        className="self-center"
                        href={`/collections/${child.slug}`} // Use slug for URL
                      >
                        <p className="text-xs md:text-sm font-normal !leading-tight text-gray-900 truncate capitalize">
                          {child.menu_name}
                        </p>
                      </a>
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
};

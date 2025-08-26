"use client";

import { CategoryList } from "@/models/categoryList";

interface CategoryProps {
  categoryData?: CategoryList[]; // make it optional
}

export default function Category({ categoryData = [] }: CategoryProps) {
  if (!categoryData || categoryData.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-transparent py-8">
      <ul className="flex gap-6 overflow-x-auto no-scrollbar px-4 md:justify-center">
        {categoryData.map((cat) => (
          <li
            key={cat.category}
            className="group relative flex-shrink-0 flex flex-col items-center cursor-pointer p-3 rounded-xl border bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Top (0ms) */}
            <span className="absolute top-0 left-0 h-[2px] w-0 bg-red-500 transition-all duration-300 ease-in-out group-hover:w-full"></span>
            {/* Left (0ms) */}
            <span className="absolute top-0 left-0 w-[2px] h-0 bg-red-500 transition-all duration-300 ease-in-out group-hover:h-full"></span>

            {/* Right (300ms delay) */}
            <span className="absolute top-0 right-0 w-[2px] h-0 bg-red-500 transition-all duration-300 ease-in-out group-hover:h-full delay-300"></span>
            {/* Bottom (300ms delay) */}
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-500 transition-all duration-300 ease-in-out group-hover:w-full delay-300"></span>

            {/* Image Box */}
            <div className="w-24 h-24 flex items-center justify-center bg-transparent rounded-lg overflow-visible relative z-10">
              <img
                src={cat.category_image}
                alt={cat.category}
                className="w-20 h-20 object-contain transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            {/* Name */}
            <span className="mt-1 text-sm font-medium text-gray-800 relative z-10">
              {cat.category}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

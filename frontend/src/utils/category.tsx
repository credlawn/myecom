"use client";

import Image from "next/image";
import { CategoryList } from "@/myapi/categoryList";

interface CategoryProps {
  categoryData?: CategoryList[];
  cardSize?: number;
  imageSize?: number;
  imageBgColor?: string;
  cardBgColor?: string;
  textColor?: string;
}

export default function Category({
  categoryData = [],
  cardSize = 72,
  imageSize = 56,
  imageBgColor = "transparent",
  cardBgColor = "white",
  textColor = "black",
}: CategoryProps) {
  if (!categoryData || categoryData.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-transparent py-4">
      <ul className="flex gap-6 overflow-x-auto no-scrollbar px-4 md:justify-center">
        {categoryData.map((cat) => (
          <li
            key={cat.category}
            className="group relative flex-shrink-0 flex flex-col items-center cursor-pointer rounded-xl border shadow-sm hover:shadow-md transition"
            style={{
              width: cardSize + 16,
              height: "auto",
              backgroundColor: cardBgColor,
              borderColor: cardBgColor === "white" ? "#e5e7eb" : "currentColor",
              padding: "8px 8px 6px",
            }}
          >
            {/* Border animation spans - Smooth in, instant out */}
            <span className="absolute top-0 left-0 h-[2px] w-0 bg-red-500 group-hover:w-full group-hover:transition-all group-hover:duration-500 group-hover:ease-in-out"></span>
            <span className="absolute top-0 left-0 w-[2px] h-0 bg-red-500 group-hover:h-full group-hover:transition-all group-hover:duration-500 group-hover:ease-in-out"></span>
            <span className="absolute top-0 right-0 w-[2px] h-0 bg-red-500 group-hover:h-full group-hover:transition-all group-hover:duration-500 group-hover:ease-in-out group-hover:delay-300"></span>
            <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-red-500 group-hover:w-full group-hover:transition-all group-hover:duration-500 group-hover:ease-in-out group-hover:delay-300"></span>

            {/* Image Box */}
            <div
              className="flex items-center justify-center rounded-lg overflow-visible relative z-10"
              style={{
                width: cardSize,
                height: cardSize,
                backgroundColor: imageBgColor,
              }}
            >
              <Image
                src={cat.category_image}
                alt={cat.category}
                width={imageSize}
                height={imageSize}
                className="object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 768px) 64px, 80px"
              />
            </div>

            {/* Name */}
            <span
              className="mt-1 text-sm font-medium relative z-10"
              style={{ color: textColor }}
            >
              {cat.category}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

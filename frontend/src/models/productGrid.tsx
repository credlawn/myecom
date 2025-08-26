"use client";

import Image from "next/image";
import { useState } from "react";

interface Product {
  id: number;
  category: string;
  title: string;
  rating: number;
  price: number;
  oldPrice?: number;
  imageDefault: string;
  imageHover: string;
}

interface ProductGridProps {
  products?: Product[];
  maxCardWidth?: number;
  maxCardHeight?: number;
  showSnap?: boolean;
}

const defaultProducts: Product[] = [
  {
    id: 1,
    category: "jacket",
    title: "Mens Winter Leathers Jackets",
    rating: 3,
    price: 48,
    oldPrice: 75,
    imageDefault: "/images/products/jacket-3.jpg",
    imageHover: "/images/products/jacket-4.jpg",
  },
  {
    id: 2,
    category: "shirt",
    title: "Pure Garment Dyed Cotton Shirt",
    rating: 3,
    price: 45,
    oldPrice: 56,
    imageDefault: "/images/products/shirt-1.jpg",
    imageHover: "/images/products/shirt-2.jpg",
  },
  {
    id: 3,
    category: "Jacket",
    title: "MEN Yarn Fleece Full-Zip Jacket",
    rating: 3,
    price: 58,
    oldPrice: 65,
    imageDefault: "/images/products/jacket-5.jpg",
    imageHover: "/images/products/jacket-6.jpg",
  },
  {
    id: 4,
    category: "skirt",
    title: "Black Floral Wrap Midi Skirt",
    rating: 5,
    price: 25,
    oldPrice: 35,
    imageDefault: "/images/products/clothes-3.jpg",
    imageHover: "/images/products/clothes-4.jpg",
  },
];

export default function ProductGrid({
  products = defaultProducts,
  maxCardWidth = 240,
  maxCardHeight = 320,
  showSnap = true,
}: ProductGridProps) {
  const [isClient] = useState(true);

  if (!isClient) return null;

  // Mobile card dimensions
  const mobileCardWidth = "100%";
  const mobileImageHeight = 140;
  const mobileCardHeight = 280;

  return (
    <section className="w-full px-0 py-6">
      {" "}
      {/* Removed px-4 */}
      <div className="border border-gray-200 rounded-md px-0 py-6">
        {" "}
        {/* Removed px-6 */}
        <h2 className="text-lg font-semibold mb-4 px-4">New Products</h2>
        {/* Mobile View: 2-up Grid */}
        <div className="lg:hidden">
          <div className="grid grid-cols-2 gap-0 w-full">
            {products.length === 0 ? (
              <p className="text-gray-500 py-4 col-span-2 text-center">
                No products available.
              </p>
            ) : (
              products.map((p) => (
                <div
                  key={p.id}
                  className="group relative border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                  style={{
                    width: mobileCardWidth,
                    height: mobileCardHeight,
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Image container */}
                  <div
                    className="relative bg-white"
                    style={{ height: mobileImageHeight }}
                  >
                    <Image
                      src={p.imageDefault}
                      alt={p.title}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:opacity-0 group-hover:scale-110"
                      sizes="50vw"
                      style={{ transition: "transform 0.3s ease" }}
                    />
                    <Image
                      src={p.imageHover}
                      alt={p.title}
                      fill
                      className="object-contain absolute inset-0 opacity-0 transition-transform duration-300 group-hover:opacity-100 group-hover:scale-110"
                      sizes="50vw"
                      style={{
                        transition: "opacity 0.3s ease, transform 0.3s ease",
                      }}
                    />
                  </div>

                  {/* Text container */}
                  <div
                    className="flex flex-col p-2"
                    style={{
                      flex: 1,
                      height: `calc(100% - ${mobileImageHeight}px)`,
                    }}
                  >
                    <a
                      href="#"
                      className="block text-pink-500 text-[10px] font-medium uppercase mb-1"
                      style={{ textDecoration: "none" }}
                    >
                      {p.category}
                    </a>

                    <h3 className="mb-1">
                      <a
                        href="#"
                        className="text-gray-500 text-[12px] font-light tracking-wide capitalize line-clamp-2 group-hover:text-neutral-900"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textDecoration: "none",
                        }}
                      >
                        {p.title}
                      </a>
                    </h3>

                    {/* Rating */}
                    <div className="flex text-amber-400 mb-1 text-xs select-none">
                      {"★".repeat(p.rating)}
                      {"☆".repeat(5 - p.rating)}
                    </div>

                    {/* Price box */}
                    <div className="flex items-center gap-1 text-[13px] text-neutral-900 mt-auto">
                      <p className="font-bold">${p.price.toFixed(2)}</p>
                      {p.oldPrice && (
                        <del className="text-gray-400">
                          ${p.oldPrice.toFixed(2)}
                        </del>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Desktop View: Scrollable Flex */}
        <div className="hidden lg:block">
          <div
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollSnapType: showSnap ? "x mandatory" : undefined }}
          >
            {/* Centering spacers */}
            <div className="lg:flex-1 min-w-[50px]" aria-hidden="true"></div>

            {products.map((p) => (
              <div
                key={p.id}
                className="group flex-shrink-0 rounded-md border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                style={{ width: maxCardWidth, maxHeight: maxCardHeight }}
              >
                {/* Image container */}
                <div
                  className="relative bg-white"
                  style={{ height: maxCardHeight * 0.6 }}
                >
                  <Image
                    src={p.imageDefault}
                    alt={p.title}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:opacity-0 group-hover:scale-110"
                    sizes="240px"
                  />
                  <Image
                    src={p.imageHover}
                    alt={p.title}
                    fill
                    className="object-contain absolute inset-0 opacity-0 transition-transform duration-300 group-hover:opacity-100 group-hover:scale-110"
                    sizes="240px"
                  />
                </div>

                {/* Text container */}
                <div
                  className="flex flex-col p-4"
                  style={{ height: `calc(100% - ${maxCardHeight * 0.6}px)` }}
                >
                  <a
                    href="#"
                    className="block text-pink-500 text-[11px] font-medium uppercase mb-2"
                    style={{ textDecoration: "none" }}
                  >
                    {p.category}
                  </a>

                  <h3 className="mb-2">
                    <a
                      href="#"
                      className="text-gray-500 text-[13px] font-light tracking-wide capitalize line-clamp-2 group-hover:text-neutral-900"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        textDecoration: "none",
                      }}
                    >
                      {p.title}
                    </a>
                  </h3>

                  <div className="flex text-amber-400 mb-2 text-sm select-none">
                    {"★".repeat(p.rating)}
                    {"☆".repeat(5 - p.rating)}
                  </div>

                  <div className="flex items-center gap-2 text-[15px] text-neutral-900 mt-auto">
                    <p className="font-bold">${p.price.toFixed(2)}</p>
                    {p.oldPrice && (
                      <del className="text-gray-400">
                        ${p.oldPrice.toFixed(2)}
                      </del>
                    )}
                  </div>
                </div>
              </div>
            ))}

            <div className="lg:flex-1 min-w-[50px]" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

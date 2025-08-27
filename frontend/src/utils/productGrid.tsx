// productGrid.tsx

"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductItem } from "@/models/productList";

interface ProductGridProps {
  products?: ProductItem[];
  maxCardWidth?: number;
  maxCardHeight?: number;
  showSnap?: boolean;
  currency?: string;
}

export default function ProductGrid({
  products = [],
  maxCardWidth = 240,
  maxCardHeight = 320,
  showSnap = true,
  currency = "₹ ",
}: ProductGridProps) {
  const [isClient] = useState(true);

  if (!isClient) return null;

  const mappedProducts = (Array.isArray(products) ? products : []).map(
    (p, index) => ({
      id: p.name || index,
      title: p.product_name || "Untitled Product",
      rating: Math.max(0, Math.min(5, p.product_rating)),
      rating_count: p.rating_count || 0,
      discountPercent: p.discount_percent || 0,
      price: p.discounted_price ?? p.price,
      oldPrice: p.discounted_price !== p.price ? p.price : undefined,
      imageDefault: p.product_image_1 || "/images/placeholder.jpg",
      imageHover:
        p.product_image_2 || p.product_image_1 || "/images/placeholder.jpg",
      slug: p.product_slug || "#",
      altText: p.product_name || p.product_slug || "Product image",
    }),
  );

  // Mobile dimensions
  const mobileCardWidth = "100%";
  const mobileImageHeight = 140;
  const mobileCardHeight = 280;

  return (
    <section className="w-full px-0 py-2">
      <div className="border border-gray-200 rounded-md px-0 py-2">
        <h2 className="text-lg font-semibold mb-4 px-4 ">New Products</h2>

        {/* Mobile View: 2-up Grid */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-0.5 w-full px-1">
            {mappedProducts.length === 0 ? (
              <p className="text-neutral-900 py-4 col-span-2 text-center">
                No products available.
              </p>
            ) : (
              mappedProducts.map((p) => (
                <a
                  key={p.id}
                  href={`/${p.slug}`}
                  className="group block border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(0,0,0,0.1)]"
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
                      alt={p.altText}
                      fill
                      className="object-contain transition-transform duration-300 group-hover:opacity-0 group-hover:scale-110"
                      sizes="50vw"
                    />
                    <Image
                      src={p.imageHover}
                      alt={p.altText}
                      fill
                      className="object-contain absolute inset-0 opacity-0 transition-transform duration-300 group-hover:opacity-100 group-hover:scale-110"
                      sizes="50vw"
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
                    <h3 className="mb-1">
                      <span
                        className="text-natural-900 text-[14px] font-light tracking-wide capitalize line-clamp-2 group-hover:text-neutral-900 block"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {p.title}
                      </span>
                    </h3>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-1 select-none">
                      <span
                        className="bg-green-700 text-white text-sm font-semibold px-2 py-1 rounded"
                        style={{ fontSize: "13px", lineHeight: 1 }}
                      >
                        {p.rating.toFixed(1)} ★
                      </span>
                      <span className="text-sm font-semibold text-gray-500 ml-1">
                        ({p.rating_count})
                      </span>
                    </div>

                    {/* Price box */}
                    <div className="flex items-center gap-1 text-[14px] text-neutral-900 mt-1">
                      <p className="font-bold">
                        {currency}
                        {p.price.toFixed(2)}
                      </p>
                      {p.oldPrice && (
                        <del className="text-gray-400">
                          {currency}
                          {p.oldPrice.toFixed(2)}
                        </del>
                      )}
                    </div>
                    {p.discountPercent > 0 && (
                      <span className="text-green-600 text-sm font-medium mt-1">
                        {p.discountPercent.toFixed(0)}% Instant off
                      </span>
                    )}
                  </div>
                </a>
              ))
            )}
          </div>
        </div>

        {/* Desktop View: Scrollable Flex */}
        <div className="hidden md:block">
          <div
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollSnapType: showSnap ? "x mandatory" : undefined }}
          >
            <div className="lg:flex-1 min-w-[50px]" aria-hidden="true"></div>

            {mappedProducts.map((p) => (
              <a
                key={p.id}
                href={`/${p.slug}`}
                className="group block flex-shrink-0 rounded-md border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(0,0,0,0.1)]"
                style={{ width: maxCardWidth, maxHeight: maxCardHeight }}
              >
                {/* Image container */}
                <div
                  className="relative bg-white"
                  style={{ height: maxCardHeight * 0.6 }}
                >
                  <Image
                    src={p.imageDefault}
                    alt={p.altText}
                    fill
                    className="object-contain transition-transform duration-300 group-hover:opacity-0 group-hover:scale-110"
                    sizes="240px"
                  />
                  <Image
                    src={p.imageHover}
                    alt={p.altText}
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
                  <h3 className="mb-2">
                    <span
                      className="text-natural-900 text-[14px] font-light tracking-wide capitalize line-clamp-2 group-hover:text-neutral-900 block"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {p.title}
                    </span>
                  </h3>

                  <div className="flex items-center gap-1 mb-2 text-sm text-red-500 select-none">
                    <span>
                      {"★".repeat(Math.floor(p.rating))}
                      {"☆".repeat(5 - Math.floor(p.rating))}
                    </span>

                    <span className="text-sm font-semibold text-gray-500 ml-2">
                      ({p.rating_count})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[15px] text-neutral-900 mt-auto">
                    <p className="font-bold">
                      {currency}
                      {p.price.toFixed(2)}
                    </p>
                    {p.oldPrice && (
                      <>
                        <del className="text-gray-500">
                          {currency}
                          {p.oldPrice.toFixed(2)}
                        </del>
                        <span className="text-green-600 text-base font-medium ml-2">
                          {p.discountPercent.toFixed(0)}% off
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </a>
            ))}

            <div className="lg:flex-1 min-w-[50px]" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

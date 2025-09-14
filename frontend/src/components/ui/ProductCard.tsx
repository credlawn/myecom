"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { ProductItem } from "@/myapi/productList";
import { WishlistButton } from "@/app/wishlist/WishlistButton";
import AddToCartButton from "@/components/ui/AddToCartButton";

interface ProductCardProps {
  product: ProductItem;
  currency?: string;
  priColor?: string;
  bt1Color?: string;
}

const formatInr = (
  num: number,
  { showDecimal = false }: { showDecimal?: boolean } = {},
): string => {
  return new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: showDecimal ? 2 : 0,
    maximumFractionDigits: showDecimal ? 2 : 0,
    useGrouping: true,
  }).format(num);
};

export default function ProductCard({
  product,
  currency = "₹ ",
  priColor,
  bt1Color,
}: ProductCardProps) {
  const router = useRouter();
  const p = {
    id: product.name,
    title: product.product_name || "Untitled Product",
    rating: Math.max(0, Math.min(5, product.product_rating || 0)),
    rating_count: product.rating_count || 0,
    discountPercent: product.discount_percent || 0,
    price: product.discounted_price ?? product.price,
    oldPrice: product.discounted_price !== product.price ? product.price : 0,
    imageDefault: product.product_image_1 || "/images/placeholder.jpg",
    imageHover:
      product.product_image_2 ||
      product.product_image_1 ||
      "/images/placeholder.jpg",
    slug: product.product_slug || "#",
    altText: product.product_name || product.product_slug || "Product image",
    ndText: product.nd_text || "Only few left",
  };

  const mobileImageHeight = 140;

  return (
    <>
      {/* Mobile View */}
      <div className="md:hidden group block border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(0,0,0,0.1)] h-[320px] relative flex flex-col">
        <div className="cursor-pointer" onClick={() => router.push(`/products/${p.slug}`)}>
          <div className="relative bg-white" style={{ height: mobileImageHeight }}>
            <Image
              src={p.imageDefault}
              alt={p.altText}
              fill
              className="object-cover mx-0.5 my-0.5 transition-transform duration-300 group-hover:opacity-0 group-hover:scale-110"
              sizes="50vw"
              style={{ padding: "1px" }}
            />
            <Image
              src={p.imageHover}
              alt={p.altText}
              fill
              className="object-cover absolute inset-0 opacity-0 transition-transform duration-300 group-hover:opacity-100 group-hover:scale-105"
              sizes="50vw"
              style={{ padding: "1px" }}
            />
            <div className="absolute top-1 right-1 z-10">
              <WishlistButton
                productId={p.id}
                variant="icon"
                size="sm"
                className="bg-white/80 backdrop-blur-sm hover:bg-white"
              />
            </div>
          </div>
          <div className="flex flex-col p-2" style={{ height: `calc(100% - ${mobileImageHeight}px)` }}>
            <h3 className="mb-1" style={{ minHeight: "2.8em", lineHeight: "1.4em" }}>
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
            <div className="flex items-center gap-1 mb-1 select-none">
              <span
                className="bg-green-500 text-white text-sm font-semibold px-2 py-1 rounded"
                style={{ fontSize: "13px", lineHeight: 1 }}
              >
                {p.rating.toFixed(1)} ★
              </span>
              <span className="text-sm font-semibold text-gray-500 ml-1">
                ({p.rating_count})
              </span>
            </div>
            <div className="flex items-center gap-1 text-[14px] text-neutral-900 mt-1">
              <p className="font-bold">
                {currency}
                {formatInr(p.price)}
              </p>
              {p.oldPrice > 0 && p.discountPercent > 0 && (
                <del className="text-gray-400 ml-1">
                  {currency}
                  {formatInr(p.oldPrice)}
                </del>
              )}
            </div>
            <span className="text-green-600 text-sm font-medium mt-1">
              {p.discountPercent > 0
                ? `${p.discountPercent.toFixed(0)}% Instant off`
                : p.ndText}
            </span>
          </div>
        </div>
        <div
          className="absolute bottom-2 left-2 right-2 z-10 cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <AddToCartButton productId={p.id} buttonColor={priColor} buttonTextColor={bt1Color} />
        </div>
      </div>

      {/* Desktop View */}
      <div className="hidden md:block group flex-shrink-0 rounded-md border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(0,0,0,0.1)] relative h-full">
          <div className="cursor-pointer h-full flex flex-col" onClick={() => router.push(`/products/${p.slug}`)}>
              <div className="relative bg-white" style={{ height: "50%" }}>
                  <Image
                      src={p.imageDefault}
                      alt={p.altText}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:opacity-0 group-hover:scale-105"
                      sizes="240px"
                      style={{ padding: "1px" }}
                  />
                  <Image
                      src={p.imageHover}
                      alt={p.altText}
                      fill
                      className="object-cover mx-0.5 my-0.5 absolute inset-0 opacity-0 transition-transform duration-300 group-hover:opacity-100 group-hover:scale-105"
                      sizes="240px"
                      style={{ padding: "1px" }}
                  />
                  <div className="absolute top-1 right-1 z-10">
                      <WishlistButton
                          productId={p.id}
                          variant="icon"
                          size="sm"
                          className="bg-white/80 backdrop-blur-sm hover:bg-white"
                      />
                  </div>
              </div>
              <div className="flex flex-col p-4 flex-grow">
                  <h3 className="mb-2">
                      <span
                          className="text-natural-900 text-[14px] font-light tracking-wide capitalize line-clamp-2 group-hover:text-neutral-900 block w-full"
                          style={{
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              minHeight: "2.8em",
                              lineHeight: "1.4em",
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
                  <div className="flex items-center gap-2 text-[15px] text-neutral-900">
                      <p className="font-bold">
                          {currency}
                          {formatInr(p.price)}
                      </p>
                      {p.oldPrice && p.discountPercent > 0 ? (
                          <>
                              <del className="text-gray-500">
                                  {currency}
                                  {formatInr(p.oldPrice)}
                              </del>
                              <span className="text-green-600 text-base font-medium ml-2 whitespace-nowrap">
                                  {p.discountPercent.toFixed(0)}% off
                              </span>
                          </>
                      ) : (
                          <span className="text-green-500 text-base font-normal ml-2 whitespace-nowrap">
                              {p.ndText}
                          </span>
                      )}
                  </div>
              </div>
              <div
                  className="px-3 pb-1 mt-auto cursor-pointer"
                  onClick={(e) => e.stopPropagation()}
              >
                  <AddToCartButton productId={p.id} buttonColor={priColor} buttonTextColor={bt1Color} />
              </div>
          </div>
      </div>
    </>
  );
}

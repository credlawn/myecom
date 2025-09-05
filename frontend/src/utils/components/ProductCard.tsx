// ProductCard.jsx
import { useState } from "react";
import Image from "next/image";
import { WishlistButton } from "@/app/wishlist/WishlistButton";

export const ProductCard = ({
  product,
  isMobile = false,
  currency = "₹ ",
  onWishlistToggle
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const formatInr = (num, { showDecimal = false } = {}) => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: showDecimal ? 2 : 0,
      maximumFractionDigits: showDecimal ? 2 : 0,
      useGrouping: true,
    }).format(num);
  };

  const { 
    id, 
    title, 
    rating, 
    rating_count, 
    discountPercent, 
    price, 
    oldPrice, 
    imageDefault, 
    imageHover, 
    slug, 
    altText,
    ndText 
  } = product;

  const imageHeight = isMobile ? 140 : 0.6 * 320;
  const cardHeight = isMobile ? 280 : 320;
  const cardWidth = isMobile ? "100%" : 240;

  return (
    <a
      href={`/products/${slug}`}
      className={`group block border border-gray-200 overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_10px_rgba(0,0,0,0.1)] ${
        isMobile ? 'w-full' : 'flex-shrink-0'
      }`}
      style={{
        width: cardWidth,
        height: cardHeight,
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div
        className="relative bg-white"
        style={{ height: imageHeight }}
      >
        <Image
          src={imageDefault}
          alt={altText}
          fill
          className={`object-cover mx-0.5 my-0.5 transition-transform duration-300 ${
            isHovered ? 'opacity-0 scale-110' : 'opacity-100 scale-100'
          }`}
          sizes={isMobile ? "50vw" : "240px"}
        />
        <Image
          src={imageHover}
          alt={altText}
          fill
          className={`object-cover absolute inset-0 ${
            isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100'
          } transition-transform duration-300`}
          sizes={isMobile ? "50vw" : "240px"}
        />
        <div className="absolute top-1 right-1 z-10">
          <WishlistButton 
            productId={id} 
            variant="icon" 
            size={isMobile ? "sm" : "md"}
            className="bg-white/80 backdrop-blur-sm hover:bg-white"
            onToggle={onWishlistToggle}
          />
        </div>
      </div>

      {/* Text container */}
      <div
        className="flex flex-col p-2"
        style={{
          flex: 1,
          height: `calc(100% - ${imageHeight}px)`,
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
            {title}
          </span>
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-1 select-none">
          <span
            className="bg-green-500 text-white text-sm font-semibold px-2 py-1 rounded"
            style={{ fontSize: "13px", lineHeight: 1 }}
          >
            {rating.toFixed(1)} ★
          </span>
          <span className="text-sm font-semibold text-gray-500 ml-1">
            ({rating_count})
          </span>
        </div>

        {/* Price box */}
        <div className="flex items-center gap-1 text-[14px] text-neutral-900 mt-1">
          <p className="font-bold">
            {currency}
            {formatInr(price)}
          </p>
          {oldPrice > 0 && discountPercent > 0 && (
            <del className="text-gray-400 ml-1">
              {currency}
              {formatInr(oldPrice)}
            </del>
          )}
        </div>
        <span className="text-green-600 text-sm font-medium mt-1">
          {discountPercent > 0
            ? `${discountPercent.toFixed(0)}% Instant off`
            : ndText}
        </span>
      </div>
    </a>
  );
};
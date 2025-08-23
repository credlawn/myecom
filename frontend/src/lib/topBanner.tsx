"use client";
import React, { useState, useEffect } from "react";

interface TopBannerProps {
  background?: string;
  boxShadowColor?: string;
  href?: string;
  animation?: "slide" | "zoom";
  messages?: string[]; // Add messages prop for dynamic data
  
  // Mobile / Desktop specific props
  heightMobile?: string;
  heightDesktop?: string;
  fontWeightMobile?: number;
  fontWeightDesktop?: number;
  fontSizeMobile?: number;
  fontSizeDesktop?: number;
  fontColorMobile?: string;
  fontColorDesktop?: string;
}

function getHeightDesktopClass(heightDesktop: string) {
  switch (heightDesktop) {
    case "h-8":
      return "sm:h-8";
    case "h-9":
      return "sm:h-9";
    case "h-10":
      return "sm:h-10";
    default:
      return "";
  }
}

export default function TopBanner({
  background = "linear-gradient(90deg, rgba(255, 65, 108, 0.9) 0%, rgba(255, 75, 43, 0.9) 100%)",
  boxShadowColor = "rgba(255, 75, 43, 0.3)",
  href = "#", // Changed from defaultHref
  animation = "zoom",
  messages = [], // Add default empty array for messages
  
  heightMobile = "h-8",
  fontWeightMobile = 500,
  fontSizeMobile = 14,
  fontColorMobile = "#ffffff",

  heightDesktop = "h-9",
  fontWeightDesktop = 600,
  fontSizeDesktop = 16,
  fontColorDesktop = "#ffffff",
}: TopBannerProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  // Use dynamic messages from props instead of static topBannerData
  const allTexts = messages.filter(msg => msg && msg.trim() !== "");
  const total = allTexts.length;
  const heightDesktopClass = getHeightDesktopClass(heightDesktop);

  useEffect(() => {
    // Only set up interval if there are messages to rotate
    if (total > 0) {
      const interval = setInterval(() => {
        setAnimating(true);
        setTimeout(() => {
          setStartIndex((prev) => (prev + 1) % total);
          setAnimating(false);
        }, 500);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [total]);

  const getText = (offset: number) =>
    allTexts[(startIndex + offset) % total] || "";

  const animationClasses =
    animation === "slide"
      ? animating
        ? "opacity-0 translate-y-2"
        : "opacity-100 translate-y-0"
      : animating
      ? "opacity-0 scale-90"
      : "opacity-100 scale-100";

  // Don't render anything if there are no messages
  if (total === 0) {
    return null;
  }

  return (
    <a
      className={`container-main flex justify-center [clipPath:inset(0_-100vmax)] ${heightMobile} ${heightDesktopClass}`}
      style={{
        background,
        boxShadow: `0 0 0 100vmax ${boxShadowColor}`,

      }}
      href={href}
    >
      {/* Desktop View */}
      <div className="hidden flex-1 items-center justify-between gap-5 sm:flex">
        <p
          className={`!leading-tight shrink-0 lg:w-[28%] transition-all duration-500 ease-in-out ${animationClasses}`}
          style={{
            fontWeight: fontWeightDesktop,
            fontSize: `${fontSizeDesktop}px`,
            color: fontColorDesktop,
          }}
        >
          {getText(0)}
        </p>
        <div className="m-auto flex w-auto shrink-0 items-center justify-center">
          <p
            className={`!leading-tight py-0.5 transition-all duration-500 ease-in-out ${animationClasses}`}
            style={{
              fontWeight: fontWeightDesktop,
              fontSize: `${fontSizeDesktop}px`,
              color: fontColorDesktop,
            }}
          >
            {getText(1)}
          </p>
        </div>
        <p
          className={`!leading-tight text-end lg:w-[28%] transition-all duration-500 ease-in-out ${animationClasses}`}
          style={{
            fontWeight: fontWeightDesktop,
            fontSize: `${fontSizeDesktop}px`,
            color: fontColorDesktop,
          }}
        >
          {getText(2)}
        </p>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden flex items-center justify-center w-full overflow-hidden relative">
        <p
          key={startIndex}
          className={`absolute transition-all duration-500 ease-in-out ${animationClasses}`}
          style={{
            fontWeight: fontWeightMobile,
            fontSize: `${fontSizeMobile}px`,
            color: fontColorMobile,
          }}
        >
          {getText(1)}
        </p>
      </div>
    </a>
  );
}
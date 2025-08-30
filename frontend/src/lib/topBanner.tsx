"use client";
import React, { useState, useEffect } from "react";

interface TopBannerProps {
  background?: string;
  boxShadowColor?: string;
  href?: string;
  banAnimation?: string;
  messages?: string[];

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

export default function TopBanner({
  background = "linear-gradient(90deg, rgba(255, 65, 108, 0.9) 0%, rgba(255, 75, 43, 0.9) 100%)",
  boxShadowColor = "rgba(255, 75, 43, 0.3)",
  href = "#",
  banAnimation = "zoom",
  messages = [],
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
  const allTexts = messages.filter((msg) => msg && msg.trim() !== "");
  const total = allTexts.length;

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

  const banAnimationClasses =
    banAnimation === "slide"
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

  // Parse height values from props
  const getHeightValue = (heightClass: string) => {
    const match = heightClass.match(/h-(\d+)/);
    if (match) {
      return `${parseInt(match[1]) * 0.25}rem`;
    }
    return "2rem"; // Default fallback
  };

  const mobileHeightValue = getHeightValue(heightMobile);
  const desktopHeightValue = getHeightValue(heightDesktop);

  return (
    <a
      className="container-main flex justify-center [clipPath:inset(0_-100vmax)]"
      style={{
        background,
        boxShadow: `0 0 0 100vmax ${boxShadowColor}`,
        height: mobileHeightValue,
        // Apply desktop height using media query
        // This is a workaround for the sm: prefix issue
      }}
      href={href}
    >
      {/* Inline style for desktop height */}
      <style>{`
        @media (min-width: 640px) {
          a[href="${href}"] {
            height: ${desktopHeightValue} !important;
          }
        }
      `}</style>

      {/* Desktop View */}
      <div className="hidden flex-1 items-center justify-between gap-5 sm:flex">
        <p
          className={`!leading-tight shrink-0 lg:w-[28%] transition-all duration-500 ease-in-out ${banAnimationClasses}`}
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
            className={`!leading-tight py-0.5 transition-all duration-500 ease-in-out ${banAnimationClasses}`}
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
          className={`!leading-tight text-end lg:w-[28%] transition-all duration-500 ease-in-out ${banAnimationClasses}`}
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
          className={`absolute transition-all duration-500 ease-in-out ${banAnimationClasses}`}
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

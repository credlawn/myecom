"use client";

import React from "react";

interface StarRatingProps {
  rating: number; // 0 - 5 (supports decimals like 3.2, 4.7)
  size?: number; // pixel size of star
  gap?: number; // gap between stars in px
  fullColor?: string; // Tailwind class or hex for full stars
  emptyColor?: string; // Tailwind class or hex for empty stars
  className?: string; // extra wrapper classes
}

const StarRating = ({
  rating,
  size = 16,
  gap = 4,
  fullColor = "#facc15", // default yellow
  emptyColor = "#d1d5db", // default gray
  className = "",
}: StarRatingProps) => {
  return (
    <div className={`flex items-center ${className}`} style={{ gap }}>
      {[...Array(5)].map((_, i) => {
        const starValue = rating - i;

        // Full star
        if (starValue >= 1) {
          return (
            <svg
              key={i}
              width={size}
              height={size}
              viewBox="0 0 20 20"
              fill={fullColor}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.947c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.947a1 1 0 00-.364-1.118L2.034 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z" />
            </svg>
          );
        }

        // Partial star (0 < starValue < 1)
        if (starValue > 0) {
          return (
            <svg key={i} width={size} height={size} viewBox="0 0 20 20">
              <defs>
                <linearGradient id={`grad${i}`} x1="0" x2="100%" y1="0" y2="0">
                  <stop
                    offset={`${Math.min(Math.max(starValue * 100, 0), 100)}%`}
                    stopColor={fullColor}
                  />
                  <stop
                    offset={`${Math.min(Math.max(starValue * 100, 0), 100)}%`}
                    stopColor={emptyColor}
                  />
                </linearGradient>
              </defs>
              <path
                fill={`url(#grad${i})`}
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.947c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.947a1 1 0 00-.364-1.118L2.034 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z"
              />
            </svg>
          );
        }

        // Empty star
        return (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill={emptyColor}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.947a1 1 0 00.95.69h4.15c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.287 3.947c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.287-3.947a1 1 0 00-.364-1.118L2.034 9.374c-.783-.57-.38-1.81.588-1.81h4.15a1 1 0 00.95-.69l1.286-3.947z" />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;

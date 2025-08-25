"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { HeroItem } from "@/models/api";

interface HeroProps {
  heroData: HeroItem[];
  autoSlide?: boolean;
}

export default function Hero({ heroData, autoSlide = true }: HeroProps) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!autoSlide || heroData.length === 0) return;

    setProgress(0);
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 100 : prev + 2));
    }, 100);

    const slideTimer = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % heroData.length);
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(slideTimer);
    };
  }, [current, heroData, autoSlide]);

  if (heroData.length === 0) return null;

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {heroData.map((slide, index) => (
          <div
            key={index}
            className="relative min-w-full h-[450px] overflow-hidden"
          >
            {/* Image container with padding */}
            <div className="absolute inset-0 px-2 py-2 md:px-12 lg:px-20">
              <div className="relative w-full h-full rounded-lg overflow-hidden">
                <Image
                  src={
                    slide.hero_image.startsWith("http")
                      ? slide.hero_image
                      : `${process.env.DOMAIN}${slide.hero_image}`
                  }
                  alt={slide.image_alt}
                  fill
                  priority
                  className="object-cover object-top-right"
                />

                {/* Banner Content */}
                <div className="absolute bottom-6 left-6 right-6 bg-white/80 p-5 rounded-lg">
                  <p className="text-red-500 text-sm font-medium tracking-widest mb-2">
                    {slide.hero_subtitle}
                  </p>
                  <h2 className="text-gray-900 text-2xl md:text-4xl font-bold uppercase leading-tight mb-2">
                    {slide.hero_title}
                  </h2>
                  <p className="hidden md:block text-gray-700 mb-2">
                    {slide.price_text} ₹ <b>{slide.price}</b>
                  </p>
                  <a
                    href={
                      slide.hero_url.startsWith("http")
                        ? slide.hero_url
                        : `${process.env.DOMAIN}${slide.hero_url}`
                    }
                    className="inline-block bg-red-500 text-white text-xs font-semibold uppercase px-4 py-2 rounded-md hover:bg-gray-900 transition"
                  >
                    Shop now
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Dots (clickable) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3">
        {heroData.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="relative flex items-center justify-center focus:outline-none"
          >
            {current === index ? (
              <div className="w-8 h-1 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>
            ) : (
              <div className="w-2 h-2 bg-gray-400 rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

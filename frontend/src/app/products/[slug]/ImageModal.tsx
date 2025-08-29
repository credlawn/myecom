"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, FreeMode, Zoom } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/zoom";

interface ImageModalProps {
  images: string[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  productName: string;
}

export default function ImageModal({
  images,
  initialIndex,
  isOpen,
  onClose,
  productName,
}: ImageModalProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [modalSwiper, setModalSwiper] = useState<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";

      // Clean up Swiper instances when modal closes
      if (thumbsSwiper && thumbsSwiper.destroy) {
        thumbsSwiper.destroy(true, true);
      }
      if (modalSwiper && modalSwiper.destroy) {
        modalSwiper.destroy(true, true);
      }
      setThumbsSwiper(null);
      setModalSwiper(null);
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, thumbsSwiper, modalSwiper]);

  if (!isOpen || !isMounted) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <button
        className="absolute top-4 right-4 text-gray-900 text-2xl z-50 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
        onClick={onClose}
      >
        ×
      </button>

      <div className="flex-1 w-full">
        <Swiper
          key="modal-swiper"
          onSwiper={setModalSwiper}
          spaceBetween={10}
          thumbs={{ swiper: thumbsSwiper }}
          zoom={true}
          modules={[FreeMode, Thumbs, Zoom]}
          className="h-full"
          initialSlide={initialIndex}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.activeIndex);
          }}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div className="swiper-zoom-container h-full w-full flex items-center justify-center relative">
                <Image
                  src={img}
                  alt={`${productName} view ${idx + 1}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="h-24 bg-white border-t p-2">
        <Swiper
          key="thumbs-swiper"
          onSwiper={setThumbsSwiper}
          spaceBetween={10}
          slidesPerView={"auto"}
          freeMode={true}
          watchSlidesProgress={true}
          modules={[FreeMode, Thumbs]}
          className="h-full"
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx} style={{ width: "80px" }}>
              <div className="h-full flex items-center justify-center p-1">
                <div
                  className={`h-full w-full object-contain cursor-pointer rounded border-1 relative ${
                    activeIndex === idx ? "border-red-500" : "border-gray-200"
                  }`}
                  onClick={() => {
                    modalSwiper?.slideTo?.(idx);
                  }}
                >
                  <Image
                    src={img}
                    alt={`Thumb ${idx}`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

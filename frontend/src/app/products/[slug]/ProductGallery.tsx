"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import ImageModal from "./ImageModal";
import { SingleProduct } from "@/myapi/productData";

import "swiper/css";
import "swiper/css/pagination";

export default function ProductGallery({
  product,
  isModalOpen,
  setIsModalOpen,
}: {
  product: SingleProduct;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}) {
  const [mainImage, setMainImage] = useState(product.product_image_1);
  const [activeIndex, setActiveIndex] = useState(0);

  const images: string[] = useMemo(
    () => product.product_images || [],
    [product.product_images],
  );

  useEffect(() => {
    const index = images.indexOf(mainImage!);
    if (index !== -1) setActiveIndex(index);
  }, [mainImage, images]);

  return (
    <>
      {/* Mobile Gallery */}
      <div className="block lg:hidden">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          onSlideChange={(swiper) => {
            setMainImage(images[swiper.activeIndex]);
            setActiveIndex(swiper.activeIndex);
          }}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <div
                className="bg-white border rounded-lg overflow-hidden flex items-center justify-center cursor-pointer relative"
                style={{ height: "400px" }}
                onClick={() => {
                  setMainImage(img);
                  setIsModalOpen(true);
                }}
              >
                <Image
                  src={img}
                  alt={`Slide ${idx}`}
                  fill
                  className="object-cover"
                  priority={idx === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop Gallery */}
      <div className="hidden lg:flex flex-row gap-4">
        <div className="thumbnail-container flex flex-col gap-2 justify-center">
          {images.map((img, idx) => (
            <div
              key={idx}
              className={`w-16 h-16 object-contain cursor-pointer border rounded relative ${
                mainImage === img
                  ? "border-red-500"
                  : "border-gray-100 hover:scale-120"
              }`}
              onClick={() => setMainImage(img)}
            >
              <Image
                src={img}
                alt={`Thumb ${idx}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
          ))}
        </div>

        <div className="flex-1 flex flex-col">
          <div
            className="image-box bg-white border rounded-lg overflow-hidden flex items-center justify-center p-1 cursor-pointer relative"
            style={{ height: "400px" }}
            onClick={() => setIsModalOpen(true)}
          >
            <Image
              src={mainImage!}
              alt={product.product_name}
              fill
              className="object-cover"
              priority={false}
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          {/* Desktop Buttons */}
          <div className="flex gap-2 mt-4">
            <button className="bg-green-600 text-white justify-center px-6 py-2 rounded font-medium flex items-center gap-1 flex-1">
              Add to cart
            </button>
            <button className="bg-red-600 text-white justify-center px-6 py-2 rounded font-medium flex items-center gap-1 flex-1">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        images={images}
        initialIndex={activeIndex}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={product.product_name}
      />
    </>
  );
}

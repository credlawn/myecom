"use client";

import Link from "next/link";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

const product = {
  product_name: "Pandit Ji",
  brand_name: "Demo brand",
  price: 55.0,
  discounted_price: 5.5,
  product_image_1: "/images/products/j1.jpg",
  product_image_2: "/images/products/j3.jpg",
  product_image_3: "/images/products/j2.jpg",

  product_rating: 0,
  rating_count: 0,
  stock: 8,
  unit: "pc",
};

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const discountPercent = Math.round(
    ((product.price - product.discounted_price) / product.price) * 100,
  );

  const [mainImage, setMainImage] = useState(product.product_image_1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // All images array
  const images = [
    product.product_image_1,
    product.product_image_2,
    product.product_image_3,
  ];

  return (
    <div className="main-container max-w-6xl mx-auto p-4 pb-20 lg:pb-4">
      {/* Breadcrumb */}
      <div className="breadcrumb-section mb-6">
        <nav className="text-sm text-gray-500">
          <ul className="flex gap-2">
            <li>
              <Link href="/" className="hover:text-neutral-900">
                Home
              </Link>
            </li>
            <li>{">"}</li>
            <li>
              <Link href="/products" className="hover:text-neutral-900">
                Products
              </Link>
            </li>
            <li>{">"}</li>
            <li className="text-neutral-900">{product.product_name}</li>
          </ul>
        </nav>
      </div>

      {/* 50-50 layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Image Section */}
        <div className="image-container lg:w-1/2 flex flex-col space-y-4">
          {/* Mobile: Swiper */}
          <div className="block lg:hidden">
            <Swiper modules={[Pagination]} pagination={{ clickable: true }}>
              {images.map((img, idx) => (
                <SwiperSlide key={idx}>
                  <div
                    className="bg-white border rounded-lg overflow-hidden flex items-center justify-center cursor-pointer"
                    style={{ height: "400px" }}
                    onClick={() => {
                      setMainImage(img);
                      setIsModalOpen(true);
                    }}
                  >
                    <img
                      src={img}
                      alt={`Slide ${idx}`}
                      className="h-full w-full object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Desktop: Thumbnails + Main Image */}
          <div className="hidden lg:flex flex-row gap-4">
            {/* Thumbnails */}
            <div className="thumbnail-container lg:w-1/8 flex lg:flex-col gap-2 justify-center">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumb ${idx}`}
                  className="w-16 h-16 object-contain cursor-pointer border-2 border-gray-200 hover:border-blue-500"
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>

            {/* Main Image */}
            <div
              className="image-box lg:w-7/8 bg-white border rounded-lg overflow-hidden flex items-center justify-center p-1 cursor-pointer"
              style={{ height: "400px" }}
              onClick={() => setIsModalOpen(true)}
            >
              <img
                src={mainImage}
                alt={product.product_name}
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Desktop: Buttons under image - Match image-box width */}
          <div className="hidden lg:flex gap-2 mt-4 ml-auto lg:w-7/8">
            <button className="bg-green-600 text-white px-6 py-2 rounded font-medium flex items-center gap-1 flex-1">
              Add to cart
            </button>
            <button className="bg-red-600 text-white px-6 py-2 rounded font-medium flex items-center gap-1 flex-1">
              Buy Now
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="c4 lg:w-1/2 flex flex-col space-y-4 items-start">
          <h1 className="text-xl font-bold text-neutral-900">
            {product.product_name}
          </h1>

          <div className="flex items-center gap-2 text-gray-500 text-sm">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400">
                ★
              </span>
            ))}
            <span>({product.rating_count} reviews)</span>
          </div>

          <p className="text-sm text-gray-600">
            Estimate Shipping Time: <strong>5 Days</strong>
          </p>

          <div className="flex gap-4 text-sm text-gray-500">
            <button className="flex items-center gap-1 hover:text-red-500">
              ❤️ Add to wishlist
            </button>
            <button className="flex items-center gap-1 hover:text-blue-500">
              ⇄ Add to compare
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Brand</span>
            <span className="font-semibold">{product.brand_name}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Inhouse product</span>
            <button className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm font-medium flex items-center gap-1">
              Message Seller
            </button>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-red-600 font-bold">
              ₹{product.discounted_price.toFixed(2)}
            </span>
            <del className="text-gray-500">
              ₹{product.price.toFixed(2)} /{product.unit}
            </del>
            <span className="bg-red-600 text-white text-xs px-2 py-1 rounded">
              -{discountPercent}%
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">Quantity</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 border rounded text-gray-600 hover:bg-gray-100"
              >
                -
              </button>
              <span className="w-8 text-center">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="w-8 h-8 border rounded text-gray-600 hover:bg-gray-100"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">(8 available)</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">Total Price</span>
            <span className="text-red-600 font-bold">
              ₹{(product.discounted_price * quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex gap-2 z-50">
        <button className="bg-green-600 text-white px-6 py-2 rounded font-medium flex-1">
          Add to cart
        </button>
        <button className="bg-red-600 text-white px-6 py-2 rounded font-medium flex-1">
          Buy Now
        </button>
      </div>

      {/* Fullscreen Image Modal - No background, thumbnails below */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col">
          {/* Full Image */}
          <div
            className="flex-1 flex items-center justify-center p-4"
            style={{ height: "calc(100% - 100px)" }}
          >
            <img
              src={mainImage}
              alt="Full view"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-gray-900 text-2xl z-50 bg-white rounded-full w-10 h-10 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            ×
          </button>

          {/* Thumbnails (Scrollable) */}
          <div className="h-24 bg-white border-t p-2 overflow-x-auto whitespace-nowrap">
            <div className="flex gap-2 h-full">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumb ${idx}`}
                  className={`w-20 h-full object-contain border-2 cursor-pointer rounded ${
                    mainImage === img ? "border-blue-500" : "border-gray-200"
                  }`}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

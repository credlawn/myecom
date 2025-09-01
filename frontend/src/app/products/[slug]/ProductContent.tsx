"use client";

import { useState } from "react";
import Link from "next/link";
import { SingleProduct } from "@/myapi/productData";
import ProductGallery from "./ProductGallery";
import StarRating from "@/lib/starRating";
import { Settings } from "@/myapi/settings";

export default function ProductContent({
  product,
  settings,
}: {
  product: SingleProduct;
  settings: Settings;
}) {
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const discountPercent = product.price
    ? Math.round(
        ((product.price - product.discounted_price) / product.price) * 100,
      )
    : 0;

  return (
    <div className="main-container max-w-6xl mx-auto p-4 pb-20 lg:pb-4">
      {/* Breadcrumb */}
      <div className="breadcrumb-section mb-6 hidden lg:block">
        <nav className="text-sm text-gray-500">
          <ul className="flex gap-2 flex-wrap">
            <li>
              <Link href="/" className="hover:text-neutral-900">
                Home
              </Link>
            </li>

            {product.categories?.slice(0, 2).map((cat) => (
              <li key={cat.id} className="flex items-center gap-2">
                <span>{">"}</span>
                <Link
                  href={`/category/${cat.id}`}
                  className="hover:text-neutral-900"
                >
                  {cat.name}
                </Link>
              </li>
            ))}

            <li>
              <span>{">"}</span>
            </li>
            <li className="hover:text-neutral-900">{product.product_name}</li>
          </ul>
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-0">
        {/* Image Gallery Section */}
        <div className="lg:w-1/2">
          <ProductGallery
            product={product}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </div>

        {/* Product Info Section */}
        <div className="lg:w-1/2 flex flex-col items-start"
        style={{ color: settings.thiColor || "green" }}>
          <h1 className="text-xl font-bold text-neutral-900">
            {product.product_name}
          </h1>
          <div className="flex items-center gap-2 text-sm mt-4 md:mt-6 md:text-base">
            <StarRating
              rating={product.product_rating}
              size={18}
              fullColor={settings.starColorPage || "#f87171"}
            />
            <span>( {product.rating_count} Ratings</span>&<span>{product.review_count} Reviews )</span>
          </div>
          {product.units_sold > 0 && (
          <p className="text-base font-medium mt-2 md:mt-1"
            style={{ color: settings.thiColor || "green" }}>
              {product.units_sold}+ Units Sold
          </p>
          )}

          <p className="text-sm mt-4 md:mt-6 text-gray-600">
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
              {settings.currency} {product.discounted_price.toFixed(2)}
            </span>
            <del className="text-gray-500">
              {settings.currency} {product.price.toFixed(2)} /{product.unit}
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
            <span className="text-sm text-gray-500">
              ({product.stock} available)
            </span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">Total Price</span>
            <span className="text-red-600 font-bold">
              ₹{(product.discounted_price * quantity).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Buttons - Hidden when modal is open */}
      {!isModalOpen && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex gap-2 z-40">
          <button className="bg-green-600 text-white px-6 py-2 rounded font-medium flex-1">
            Add to cart
          </button>
          <button className="bg-red-600 text-white px-6 py-2 rounded font-medium flex-1">
            Buy Now
          </button>
        </div>
      )}
    </div>
  );
}

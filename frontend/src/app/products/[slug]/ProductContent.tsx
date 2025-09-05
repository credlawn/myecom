"use client";

import { useState } from "react";
import Link from "next/link";
import { SingleProduct } from "@/myapi/apiData/productData";
import ProductGallery from "./ProductGallery";
import StarRating from "@/lib/starRating";
import { Settings } from "@/myapi/apiData/settings";
import CheckPin from "./checkPin";
import { WishlistButton } from "@/app/wishlist/WishlistButton";
import { motion } from "framer-motion";

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

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } }
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="main-container max-w-6xl mx-auto p-4 pb-20 lg:pb-4"
    >
      {/* Breadcrumb */}
      <div className="breadcrumb-section mb-6 hidden lg:block">
        <nav className="text-sm text-gray-500">
          <ul className="flex gap-2 flex-wrap">
            <li>
              <Link href="/" className="hover:text-neutral-900 transition-colors duration-200">
                Home
              </Link>
            </li>

            {product.categories?.slice(0, 2).map((cat) => (
              <li key={cat.id} className="flex items-center gap-2">
                <span className="text-gray-400">{">"}</span>
                <Link
                  href={`/category/${cat.id}`}
                  className="hover:text-neutral-900 transition-colors duration-200"
                >
                  {cat.name}
                </Link>
              </li>
            ))}

            <li>
              <span className="text-gray-400">{">"}</span>
            </li>
            <li className="text-neutral-900 font-medium">{product.product_name}</li>
          </ul>
        </nav>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 mt-0">
        {/* Image Gallery Section */}
        <motion.div 
          variants={slideUp} 
          className="lg:w-1/2"
        >
          <ProductGallery
            product={product}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        </motion.div>

        {/* Product Info Section */}
        <motion.div 
          variants={slideUp} 
          className="lg:w-1/2 flex flex-col items-start"
          style={{ color: settings.thiColor || "green" }}
        >
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            {product.product_name}
          </h1>
          
          <div className="flex items-center gap-3 text-sm mt-3 md:mt-4 md:text-base w-full">
            <StarRating
              rating={product.product_rating}
              size={20}
              fullColor={settings.starColorPage || "#f87171"}
            />
            <span className="text-gray-600">( {product.rating_count} Ratings</span>&<span className="text-gray-600">{product.review_count} Reviews )</span>
          </div>
          
          {product.units_sold > 0 && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-green-700 px-0 py-2 mt-3 w-full text-left"
            >
              <p className="text-base font-medium flex items-center gap-2">
                <span className="text-xl">🎊</span> {product.units_sold}+ Units Sold
              </p>
            </motion.div>
          )}          <div className="w-full mt-0 mb-0">
            <CheckPin />
          </div>

          <div className="flex flex-wrap gap-4 mt-6 w-full">
            <WishlistButton 
              productId={product.id} 
              variant="button" 
              size="md" 
              showText={true}
              className="bg-gray-50 hover:bg-gray-100"
            />
            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors duration-200 bg-gray-50 px-4 py-2 rounded-lg text-gray-600">
              <span>⇄</span> Add to compare
            </button>
          </div>

          <div className="flex flex-col gap-3 mt-6 w-full bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 min-w-20">Brand</span>
              <span className="font-semibold text-gray-800">{product.brand_name}</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500 min-w-20">Seller</span>
              <button className="bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-green-200 transition-colors duration-200">
                <span>💬</span> Message Seller
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 w-full bg-gray-50 p-4 rounded-lg">
            <span className="text-3xl font-bold text-red-600">
              {settings.currency} {product.discounted_price.toFixed(2)}
            </span>
            <div className="flex flex-col">
              <del className="text-gray-500">
                {settings.currency} {product.price.toFixed(2)} /{product.unit}
              </del>
              <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full w-fit">
                -{discountPercent}% OFF
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-6 w-full bg-gray-50 p-4 rounded-lg">
            <span className="text-sm text-gray-700 font-medium min-w-20">Quantity</span>
            <div className="flex items-center gap-2 border rounded-lg overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center text-xl"
              >
                -
              </button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                className="w-10 h-10 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center text-xl"
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500 ml-2">
              ({product.stock} available)
            </span>
          </div>

          <div className="flex items-center gap-4 mt-6 w-full bg-gray-50 p-4 rounded-lg">
            <span className="text-sm text-gray-700 font-medium min-w-20">Total Price</span>
            <span className="text-2xl font-bold text-red-600">
              {settings.currency} {(product.discounted_price * quantity).toFixed(2)}
            </span>
          </div>
          
          {/* Desktop buttons are in ProductGallery.tsx */}
        </motion.div>
      </div>

      {/* Mobile Buttons - Hidden when modal is open */}
      {!isModalOpen && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex gap-3 z-40 shadow-lg"
        >
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex-1 transition-colors duration-200">
            Add to cart
          </button>
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium flex-1 transition-colors duration-200">
            Buy Now
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}

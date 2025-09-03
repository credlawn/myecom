'use client';

import React from 'react';
import { WishlistButton } from './WishlistButton';
import Image from 'next/image';

// Define proper interfaces
interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

interface ProductDetailProps {
  product: Product;
}

// Example usage in ProductCard component
export const ProductCardWithWishlist: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="relative group">
      {/* Product image and details */}
      <div className="relative">
        <div className="relative w-full h-64">
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
        {/* Wishlist button positioned on product card */}
        <div className="absolute top-2 right-2 z-10">
          <WishlistButton 
            productId={product.id} 
            size="sm" 
            variant="icon" 
          />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-gray-600">₹{product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

// Example usage in ProductDetail page
export const ProductDetailWithWishlist: React.FC<ProductDetailProps> = ({ product }) => {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="flex-1">
        <div className="relative w-full h-96">
          <Image
            src={product.image}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            className="rounded-lg"
          />
        </div>
      </div>
      
      <div className="flex-1">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-gray-700 mb-6">{product.description}</p>
        <p className="text-2xl font-bold text-gray-900">₹{product.price.toFixed(2)}</p>
        
        <div className="flex gap-4 mt-8">
          <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition">
            Add to Cart
          </button>
          <WishlistButton 
            productId={product.id} 
            variant="button" 
            showText={true}
          />
        </div>
      </div>
    </div>
  );
};
// Example integration for existing product components
import React from 'react';
import { WishlistButton } from './WishlistButton';

// Example usage in ProductCard component
export const ProductCardWithWishlist: React.FC<{ product: any }> = ({ product }) => {
  return (
    <div className="relative group">
      {/* Product image and details */}
      <div className="relative">
        <img src={product.image} alt={product.name} />
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
        <h3>{product.name}</h3>
        <p>{product.price}</p>
      </div>
    </div>
  );
};

// Example usage in ProductDetail page
export const ProductDetailWithWishlist: React.FC<{ product: any }> = ({ product }) => {
  return (
    <div className="flex gap-8">
      <div className="flex-1">
        <img src={product.image} alt={product.name} />
      </div>
      
      <div className="flex-1">
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p className="text-2xl font-bold">{product.price}</p>
        
        <div className="flex gap-4 mt-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded">
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
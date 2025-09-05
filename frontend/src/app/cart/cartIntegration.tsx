'use client';

import React from 'react';
import { useShoppingCart } from './useShoppingCart'; 
import Image from 'next/image';

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

export const ProductCardWithCart: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isAdding } = useShoppingCart();

  const handleAddToCart = () => {
    addToCart({ productId: product.id, qty: 1 });
  };

  return (
    <div className="relative group">
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
        <div className="absolute bottom-2 right-2 z-10">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
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
export const ProductDetailWithCart: React.FC<ProductDetailProps> = ({ product }) => {
  const { addToCart, isAdding } = useShoppingCart();
  const [quantity, setQuantity] = React.useState(1);

  const handleAddToCart = () => {
    addToCart({ productId: product.id, qty: quantity });
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

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
        
        <div className="mt-8">
          <div className="flex items-center gap-4 mb-6">
            <span className="font-medium">Quantity:</span>
            <div className="flex items-center border rounded">
              <button 
                onClick={decrementQuantity}
                className="px-3 py-1 text-lg hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1">{quantity}</span>
              <button 
                onClick={incrementQuantity}
                className="px-3 py-1 text-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isAdding ? 'Adding to Cart...' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};
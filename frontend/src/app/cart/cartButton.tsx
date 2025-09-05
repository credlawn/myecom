'use client';

import React, { useState, useEffect } from 'react';
import { useShoppingCart } from './useShoppingCart';

interface CartButtonProps {
  productId: string;
}

export const CartButton: React.FC<CartButtonProps> = ({ productId }) => {
  const { 
    cartItems,
    isLoading,
    addToCart, 
    isAdding, 
    updateQuantity,
    isUpdating,
    removeFromCart,
    isRemoving
  } = useShoppingCart();
  
  const [localQuantity, setLocalQuantity] = useState(0);

  // Initialize quantity from cart data
  useEffect(() => {
    if (!isLoading && cartItems) {
      const cartItem = cartItems.find(item => item.product === productId);
      if (cartItem) {
        setLocalQuantity(cartItem.qty);
      } else {
        setLocalQuantity(0);
      }
    }
  }, [cartItems, productId, isLoading]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    addToCart({ productId, qty: 1 });
    setLocalQuantity(1);
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const newQuantity = localQuantity + 1;
    setLocalQuantity(newQuantity);
    updateQuantity({ productId, qty: newQuantity });
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (localQuantity > 1) {
      const newQuantity = localQuantity - 1;
      setLocalQuantity(newQuantity);
      updateQuantity({ productId, qty: newQuantity });
    } else if (localQuantity === 1) {
      // If quantity is 1, remove from cart completely
      setLocalQuantity(0);
      removeFromCart(productId);
    }
  };

  // Show loading state while cart data is being fetched
  if (isLoading) {
    return (
      <div className="absolute bottom-0 right-0 z-10">
        <div className="px-3 py-1 bg-gray-200 text-gray-500 text-sm">
          ...
        </div>
      </div>
    );
  }

  // Show Add button when quantity is 0
  if (localQuantity === 0) {
    return (
      <div className="absolute bottom-1 right-1 z-10">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className="px-3 py-1 bg-blue-600 text-white rounded-2 text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </div>
    );
  }

  // Show quantity controls when quantity > 0
  return (
    <div className="absolute bottom-0 right-0 z-10">
      <div className="flex items-right bg-white  shadow-md overflow-hidden">
        <button
          onClick={handleDecrement}
          disabled={isUpdating || isRemoving}
          className="w-6 h-8 flex items-center justify-center text-gray-600 hover:bg-red-400 disabled:opacity-50"
        >
          -
        </button>
        <span className="w-6 h-8 flex items-center justify-center text-sm font-medium">
          {localQuantity}
        </span>
        <button
          onClick={handleIncrement}
          disabled={isUpdating}
          className="w-6 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100"
        >
          +
        </button>
      </div>
    </div>
  );
};
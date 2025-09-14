'use client';

import React, { useState, useEffect } from 'react';
import { useShoppingCart } from './useShoppingCart';
import { ShoppingCart } from 'lucide-react';

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface CartButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  className?: string;
}

export const CartButton: React.FC<CartButtonProps> = ({ 
  productId,
  size = 'md',
  variant = 'button',
  className 
}) => {
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

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  if (isLoading) {
    return (
      <div className="px-3 py-1 bg-gray-200 text-gray-500 text-sm">
        ...
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={localQuantity === 0 ? handleAddToCart : handleIncrement}
        disabled={isAdding || isUpdating}
        className={cn(
          'relative rounded-full p-2 transition-all duration-200',
          'hover:bg-gray-100 active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        aria-label={localQuantity === 0 ? 'Add to cart' : 'Add one more'}
      >
        <ShoppingCart
          className={cn(
            iconSizes[size],
            localQuantity > 0
              ? 'fill-blue-500 text-white'
              : 'text-gray-400 hover:text-blue-500'
          )}
        />
        {localQuantity > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {localQuantity}
          </span>
        )}
      </button>
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
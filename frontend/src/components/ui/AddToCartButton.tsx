'use client';

import { useShoppingCart } from '@/app/cart/useShoppingCart';
import { useState, useEffect } from 'react';

interface AddToCartButtonProps {
  productId: string;
  buttonColor?: string;
  buttonTextColor?: string;
}

export default function AddToCartButton({ 
  productId, 
  buttonColor = '#EF4444', 
  buttonTextColor = '#FFFFFF' 
}: AddToCartButtonProps) {
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    isAdding,
    isUpdating,
    isRemoving,
  } = useShoppingCart();

  const [quantity, setQuantity] = useState(0);

  const cartItem = cartItems.find((item) => item.product === productId);

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.qty);
    } else {
      setQuantity(0);
    }
  }, [cartItem]);

  const handleAddToCart = () => {
    addToCart({ productId, qty: 1 });
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity({ productId, qty: cartItem.qty + 1 });
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      if (cartItem.qty > 1) {
        updateQuantity({ productId, qty: cartItem.qty - 1 });
      } else {
        removeFromCart(productId);
      }
    }
  };

  const isLoading = isAdding || isUpdating || isRemoving;

  return (
    <div className="flex items-center justify-center">
      {quantity === 0 ? (
        <button
          onClick={handleAddToCart}
          disabled={isLoading}
          className="w-full py-1 px-3 rounded-md transition-colors duration-300 disabled:opacity-50 hover:brightness-90 font-semibold"
          style={{ backgroundColor: buttonColor, color: buttonTextColor }}
        >
          {isAdding ? 'Adding...' : 'Add to Cart'}
        </button>
      ) : (
        <div className="flex items-center w-full">
          <button
            onClick={handleDecrement}
            disabled={isLoading}
            className="bg-gray-200 text-gray-700 py-1 px-3 rounded-l-md hover:bg-gray-300 transition-colors duration-300 w-8 disabled:opacity-50"
          >
            -
          </button>
          <span className="bg-gray-100 text-gray-700 py-1 px-4 flex-grow text-center">
            {isLoading ? '...' : quantity}
          </span>
          <button
            onClick={handleIncrement}
            disabled={isLoading}
            className="bg-gray-200 text-gray-700 py-1 px-3 rounded-r-md hover:bg-gray-300 transition-colors duration-300 w-8 disabled:opacity-50"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
'use client';

import React, { useEffect, useRef } from 'react';
import { CloseIcon } from '@/lib/icons';
import { CartItem } from './shoppingCart';
import { img } from '@/myapi/apiPath';
import Image from 'next/image';

interface CartSliderProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  transitionDuration?: number; // Add optional prop to control speed
}

export default function CartSlider({ 
  isOpen, 
  onClose, 
  cartItems, 
  transitionDuration = 300 // Default to 300ms
}: CartSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sliderRef.current && !sliderRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Conditionally render overlay only when cart is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black opacity-30 z-40 pointer-events-auto"
          onClick={onClose}
        />
      )}
      
      {/* Slider with customizable transition duration */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div
          ref={sliderRef}
          className="absolute right-0 top-0 h-full bg-white shadow-lg ease-in-out pointer-events-auto
                     w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
          style={{
            transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: `transform ${transitionDuration}ms ease-in-out`
          }}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Your Cart</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <CloseIcon />
            </button>
          </div>
          <div className="p-4 h-[calc(100%-64px)] overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.product} className="flex items-center space-x-4">
                    <div className="relative w-16 h-16 rounded">
                      <Image
                        src={img(item.product_image)}
                        alt={item.product_name}
                        fill
                        className="object-cover rounded"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{item.product_name}</p>
                      <p className="text-gray-600 text-sm">Qty: {item.qty}</p>
                      <p className="text-gray-800 font-bold">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
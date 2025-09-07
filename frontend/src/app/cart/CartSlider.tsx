'use client';

import React, { useEffect, useRef } from 'react';
import { XCircle, ShoppingCart } from 'lucide-react';
import { useShoppingCart } from './useShoppingCart';
import Image from 'next/image';
import { img } from '@/myapi/apiPath';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface CartSliderProps {
  isOpen: boolean;
  onClose: () => void;
  transitionDuration?: number;
}

const CartSlider: React.FC<CartSliderProps> = ({
  isOpen,
  onClose,
  transitionDuration = 300,
}) => {
  const {
    cartItems,
    removeFromCart,
    clearCart,
    cartCount,
    isLoading,
  } = useShoppingCart();

  const sliderRef = useRef<HTMLDivElement>(null);

  // Close slider if clicked outside
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

  if (isLoading) return null;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40 pointer-events-auto"
          onClick={onClose}
        />
      )}

      {/* Slider */}
      <div className="fixed inset-0 z-50 pointer-events-none">
        <div
          ref={sliderRef}
          className="absolute right-0 top-0 h-full bg-white shadow-2xl pointer-events-auto
                     w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl flex flex-col"
          style={{
            transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: `transform ${transitionDuration}ms ease-in-out`,
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-2">
              <ShoppingCart className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">Your Cart ({cartCount})</h2>
            </div>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full p-1 transition-colors"
            >
              <XCircle size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 flex-1 overflow-y-auto">
            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <ShoppingCart className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
                <p className="text-gray-400 text-sm mb-6">Add some items to your cart</p>
                <Button 
                  onClick={onClose}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Continue Shopping
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.product}
                    className="flex items-center space-x-4 border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                  >
                    {/* Image */}
                    <Link href={`/products/${item.slug}`}>
                      <div className="relative w-24 h-24 flex-shrink-0">
                        {item.product_image && (
                          <>
                            <Image
                              src={img(item.product_image)!}
                              alt={item.product_name}
                              fill
                              style={{ objectFit: 'cover' }}
                              className="transition-opacity duration-300 group-hover:opacity-0 rounded-l-lg"
                            />
                            {item.second_image && (
                              <Image
                                src={img(item.second_image)!}
                                alt={item.product_name}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-l-lg"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 p-2">
                      <Link href={`/products/${item.slug}`} className="hover:text-blue-600">
                        <p className="font-semibold text-gray-800 line-clamp-2">{item.product_name}</p>
                      </Link>
                      <p className="text-blue-600 font-bold text-lg mt-1">${item.price.toFixed(2)}</p>
                      <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                    </div>

                    {/* Remove button */}
                    <Button
                      variant="ghost"
                      onClick={() => removeFromCart(item.product)}
                      className="h-10 w-10 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full mr-2 transition-colors"
                    >
                      <XCircle size={20} />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  className="flex-1 border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 rounded-lg transition-colors"
                >
                  Continue Shopping
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => clearCart()}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 rounded-lg transition-colors"
                >
                  Clear All
                </Button>
              </div>
              <div className="mt-4">
                <Link href="/checkout">
                  <Button 
                    onClick={onClose}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-[1.02]"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSlider;
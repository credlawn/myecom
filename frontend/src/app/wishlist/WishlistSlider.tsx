'use client';

import React, { useEffect, useRef } from 'react';
import { XCircle } from 'lucide-react';
import { useWishlist } from './useWishlist';
import Image from 'next/image';
import { img } from '@/myapi/apiPath';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/myapi/useSettings';

interface WishlistSliderProps {
  isOpen: boolean;
  onClose: () => void;
  transitionDuration?: number;
}

const WishlistSlider: React.FC<WishlistSliderProps> = ({
  isOpen,
  onClose,
  transitionDuration = 300,
}) => {
  const { data: settings } = useSettings();
  const currency = settings?.currency || '₹';

  const { wishlistItems, removeFromWishlist, clearWishlist, wishlistCount, isLoading } =
    useWishlist();

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

  if (isLoading) {
    return null;
  }

  const formatInr = (
    num: number,
    { showDecimal = false }: { showDecimal?: boolean } = {},
  ): string => {
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: showDecimal ? 2 : 0,
      maximumFractionDigits: showDecimal ? 2 : 0,
      useGrouping: true,
    }).format(num);
  };


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
          className="absolute right-0 top-0 h-full bg-white shadow-lg ease-in-out pointer-events-auto
                     w-full max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl flex flex-col"
          style={{
            transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
            transition: `transform ${transitionDuration}ms ease-in-out`,
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-semibold">Your Wishlist ({wishlistCount})</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <XCircle />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 flex-1 overflow-y-auto">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your wishlist is empty.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {wishlistItems.map((item) => (
                  <div
                    key={item.product}
                    className="flex items-center space-x-4 border rounded-lg overflow-hidden shadow-sm group"
                  >
                    <Link href={`/products/${item.slug}`}>
                      <div className="relative w-24 h-24 flex-shrink-0">
                        {item.product_image && (
                          <>
                            <Image
                              src={img(item.product_image)!}
                              alt={item.product_name}
                              fill
                              style={{ objectFit: 'cover' }}
                              className="transition-opacity duration-300 group-hover:opacity-0 rounded-l"
                            />
                            {item.second_image && (
                              <Image
                                src={img(item.second_image)!}
                                alt={item.product_name}
                                fill
                                style={{ objectFit: 'cover' }}
                                className="absolute top-0 left-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 rounded-l"
                              />
                            )}
                          </>
                        )}
                      </div>
                    </Link>
                    <div className="flex-1 p-2">
                      <p className="font-semibold">{item.product_name}</p>
                      <p className="text-gray-700 font-bold">{currency}{formatInr(item.price)}</p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={() => removeFromWishlist(item.product)}
                      className="h-10"
                    >
                      <XCircle className="mr-1 h-4 w-4" /> Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {wishlistItems.length > 0 && (
            <div className="p-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => clearWishlist()}>
                Clear All
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WishlistSlider;

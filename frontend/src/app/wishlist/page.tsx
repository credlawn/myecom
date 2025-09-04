'use client';

import React from 'react';
import { useWishlist } from './useWishlist';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Heart, XCircle } from 'lucide-react';

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'http://localhost:8000';

const getImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `${DOMAIN}${imageUrl}`;
};

const WishlistPage: React.FC = () => {
  const { wishlistItems, isLoading, removeFromWishlist, clearWishlist, wishlistCount } = useWishlist();

  if (isLoading) {
    return <div className="container mx-auto p-4 text-center">Loading wishlist...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist ({wishlistCount})</h1>

      {wishlistItems.length === 0 ? (
        <div className="text-center py-10">
          <Heart className="mx-auto h-24 w-24 text-gray-400 mb-4" />
          <p className="text-xl text-gray-600 mb-4">Your wishlist is empty.</p>
          <Link href="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div>
          <div className="flex justify-end mb-4">
            <Button variant="outline" onClick={() => clearWishlist()}>
              Clear All
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <div key={item.product} className="border rounded-lg overflow-hidden shadow-sm flex flex-col">
                <Link href={`/products/${item.slug}`}>
                  <div className="relative w-full h-48 bg-gray-100 flex items-center justify-center">
                    {item.product_image ? (
                      <Image
                        src={getImageUrl(item.product_image)!}
                        alt={item.product_name}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <span className="text-gray-500">No Image</span>
                    )}
                  </div>
                </Link>
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-lg font-semibold mb-2 flex-grow">
                    <Link href={`/products/${item.slug}`} className="hover:underline">
                      {item.product_name}
                    </Link>
                  </h2>
                  <p className="text-gray-700 font-bold mb-4">${item.price.toFixed(2)}</p>
                  <Button
                    variant="destructive"
                    onClick={() => removeFromWishlist(item.product)}
                    className="w-full"
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
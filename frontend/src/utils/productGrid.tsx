'use client';

import { useState } from 'react';
import type { ProductItem } from '@/myapi/productList';
import ProductCard from '@/components/ui/ProductCard';

interface ProductGridProps {
  products?: ProductItem[];
  maxCardWidth?: number;
  maxCardHeight?: number;
  showSnap?: boolean;
  currency?: string;
  title?: string;
  btn1Color?: string;
  bt1Color?: string;
  btn2Color?: string;
  bt2Color?: string;
}

export default function ProductGrid({
  products = [],
  maxCardWidth = 240,
  maxCardHeight = 360,
  showSnap = true,
  currency = '₹ ',
  title = 'Top Selling Products',
  btn1Color,
  bt1Color,
  btn2Color,
  bt2Color,
}: ProductGridProps) {
  const [isClient] = useState(true);

  if (!isClient) return null;

  return (
    <section className="w-full px-0 py-2">
      <div className="border border-gray-200 rounded-md px-0 py-2">
        <h2 className="text-lg font-semibold mb-4 px-4 ">{title}</h2>

        {/* Mobile View: 2-up Grid */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-0.5 w-full px-1">
            {products.length === 0 ? (
              <p className="text-neutral-900 py-4 col-span-2 text-center">
                No products available.
              </p>
            ) : (
              products.map((p) => (
                <ProductCard 
                  key={p.name} 
                  product={p} 
                  currency={currency} 
                  btn1Color={btn1Color} 
                  bt1Color={bt1Color} 
                  btn2Color={btn2Color} 
                  bt2Color={bt2Color} 
                />
              ))
            )}
          </div>
        </div>

        {/* Desktop View: Scrollable Flex */}
        <div className="hidden md:block">
          <div
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollSnapType: showSnap ? 'x mandatory' : undefined }}
          >
            <div className="lg:flex-1 min-w-[50px]" aria-hidden="true"></div>

            {products.map((p) => (
              <div
                key={p.name}
                className="flex-shrink-0"
                style={{ width: maxCardWidth, height: maxCardHeight }}
              >
                <ProductCard 
                  product={p} 
                  currency={currency} 
                  btn1Color={btn1Color} 
                  bt1Color={bt1Color} 
                  btn2Color={btn2Color} 
                  bt2Color={bt2Color} 
                />
              </div>
            ))}

            <div className="lg:flex-1 min-w-[50px]" aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

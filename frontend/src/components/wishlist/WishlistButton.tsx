import React from 'react';
import { Heart } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';

// Utility function for class names
function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface WishlistButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button';
  className?: string;
  showText?: boolean;
}

export const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  size = 'md',
  variant = 'icon',
  className,
  showText = false,
}) => {
  const { addToWishlist, removeFromWishlist, useIsInWishlist } = useWishlist();
  const { data: isInWishlist, isLoading } = useIsInWishlist(productId);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInWishlist) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };



  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleWishlistToggle}
        disabled={isLoading}
        className={cn(
          'relative rounded-full p-2 transition-all duration-200',
          'hover:bg-gray-100 active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart
          className={cn(
            iconSizes[size],
            isInWishlist
              ? 'fill-red-500 text-red-500'
              : 'text-gray-400 hover:text-red-500'
          )}
        />
      </button>
    );
  }

  return (
    <button
            onClick={handleWishlistToggle}
            disabled={isLoading}
            className={cn(
              'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              'disabled:opacity-50 disabled:pointer-events-none',
              isInWishlist
                ? 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                : 'bg-transparent hover:bg-gray-100 text-gray-600',
              size === 'sm' ? 'h-8 px-3 text-xs' : size === 'lg' ? 'h-12 px-6' : 'h-10 px-4',
              className
            )}
          >
            <Heart
              className={cn(
                showText ? 'mr-2' : '',
                iconSizes[size === 'lg' ? 'md' : 'sm'],
                isInWishlist
                  ? 'fill-red-500 text-red-500'
                  : 'text-gray-400'
              )}
            />
            {showText && (
              <span>
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </span>
            )}
          </button>
  );
};
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistAPI } from './wishlist';
import { toast } from 'react-toastify';

export const useWishlist = () => {
  const queryClient = useQueryClient();

  const { data: wishlistItems = [], isLoading, error, refetch } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistAPI.getWishlistItems(),
    staleTime: 5 * 60 * 1000, 
    retry: 2,
  });

  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) => wishlistAPI.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success("Added to wishlist.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add to wishlist");
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: string) => wishlistAPI.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success("Removed from wishlist.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove item from wishlist");
    },
  });

  const clearWishlistMutation = useMutation({
    mutationFn: () => wishlistAPI.clearWishlist(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success("Wishlist Cleared.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to clear wishlist");
    },
  });

  const useIsInWishlist = (productId: string) => {
    return useQuery({
      queryKey: ['wishlist', 'check', productId],
      queryFn: () => wishlistAPI.isInWishlist(productId),
      enabled: !!productId,
      staleTime: 60 * 1000,
      retry: 1,
    });
  };

  return {
    wishlistItems,
    wishlistCount: wishlistItems.length,
    isLoading,
    error,
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    clearWishlist: clearWishlistMutation.mutate,
    refetchWishlist: refetch,
    useIsInWishlist,
    isAdding: addToWishlistMutation.isPending,
    isRemoving: removeFromWishlistMutation.isPending,
    isClearing: clearWishlistMutation.isPending,
  };
};
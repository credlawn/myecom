'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { wishlistAPI, WishlistItem } from '@/utils/api/wishlist';

// Simple toast notification system
const useToast = () => {
  const toast = ({ title, description }: { title: string; description?: string }) => {
    if (typeof window !== 'undefined') {
      console.log(`${title}: ${description}`);

    }
  };
  return { toast };
};

export const useWishlist = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Query to fetch all wishlist items
  const { data: wishlistItems = [], isLoading, error, refetch } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => wishlistAPI.getWishlistItems(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  // Mutation to add item to wishlist
  const addToWishlistMutation = useMutation({
    mutationFn: (productId: string) => wishlistAPI.addToWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: "Added to Wishlist",
        description: "Item has been added to your wishlist.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to wishlist",

      });
    },
  });

  // Mutation to remove item from wishlist
  const removeFromWishlistMutation = useMutation({
    mutationFn: (productId: string) => wishlistAPI.removeFromWishlist(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from wishlist",

      });
    },
  });

  // Mutation to clear entire wishlist
  const clearWishlistMutation = useMutation({
    mutationFn: () => wishlistAPI.clearWishlist(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast({
        title: "Wishlist Cleared",
        description: "All items have been removed from your wishlist.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to clear wishlist",

      });
    },
  });

  // Hook to check if a specific product is in wishlist
  const useIsInWishlist = (productId: string) => {
    return useQuery({
      queryKey: ['wishlist', 'check', productId],
      queryFn: () => wishlistAPI.isInWishlist(productId),
      enabled: !!productId,
      staleTime: 60 * 1000, // 1 minute
      retry: 1,
    });
  };

  return {
    // Data
    wishlistItems,
    wishlistCount: wishlistItems.length,
    isLoading,
    error,

    // Actions
    addToWishlist: addToWishlistMutation.mutate,
    removeFromWishlist: removeFromWishlistMutation.mutate,
    clearWishlist: clearWishlistMutation.mutate,
    refetchWishlist: refetch,

    // Check individual item status
    useIsInWishlist,

    // Mutation states
    isAdding: addToWishlistMutation.isPending,
    isRemoving: removeFromWishlistMutation.isPending,
    isClearing: clearWishlistMutation.isPending,
  };
};
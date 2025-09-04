'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { wishlistAPI } from '@/myapi/wishlist';


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
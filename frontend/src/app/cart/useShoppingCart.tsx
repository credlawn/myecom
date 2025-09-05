'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shoppingCartAPI } from './shoppingCart';

const useToast = () => {
  const toast = ({ title, description }: { title: string; description?: string }) => {
    if (typeof window !== 'undefined') {
      console.log(`${title}: ${description}`);
    }
  };
  return { toast };
};

export const useShoppingCart = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: cartItems = [], isLoading, error, refetch } = useQuery({
    queryKey: ['cart'],
    queryFn: () => shoppingCartAPI.getCartItems(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const cartCount = cartItems.reduce((total, item) => total + item.qty, 0);

  const addToCartMutation = useMutation({
    mutationFn: ({ productId, qty }: { productId: string; qty: number }) => 
      shoppingCartAPI.addToCart(productId, qty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Added to Cart",
        description: "Item has been added to your cart.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add item to cart",
      });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (productId: string) => shoppingCartAPI.removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Removed from Cart",
        description: "Item has been removed from your cart.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove item from cart",
      });
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, qty }: { productId: string; qty: number }) => 
      shoppingCartAPI.updateQuantity(productId, qty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Quantity Updated",
        description: "Item quantity has been updated.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update item quantity",
      });
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => shoppingCartAPI.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to clear cart",
      });
    },
  });

  const useIsInCart = (productId: string) => {
    return useQuery({
      queryKey: ['cart', 'check', productId],
      queryFn: async () => {
        const items = await shoppingCartAPI.getCartItems();
        return items.some(item => item.product === productId);
      },
      enabled: !!productId,
      staleTime: 60 * 1000,
      retry: 1,
    });
  };

  return {
    // Cart data
    cartItems,
    cartCount,
    isLoading,
    error,

    // Cart actions
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    clearCart: clearCartMutation.mutate,
    refetchCart: refetch,

    // Custom hooks
    useIsInCart,

    // Loading states
    isAdding: addToCartMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
};
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shoppingCartAPI } from './shoppingCart';
import { toast } from 'react-toastify';

export const useShoppingCart = () => {
  const queryClient = useQueryClient();

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
      toast.success("Item has been added to your cart.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add item to cart");
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (productId: string) => shoppingCartAPI.removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("Item has been removed from your cart.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove item from cart");
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: ({ productId, qty }: { productId: string; qty: number }) => 
      shoppingCartAPI.updateQuantity(productId, qty),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("Item quantity has been updated.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update item quantity");
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => shoppingCartAPI.clearCart(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success("All items have been removed from your cart.");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to clear cart");
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
    cartItems,
    cartCount,
    isLoading,
    error,
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    clearCart: clearCartMutation.mutate,
    refetchCart: refetch,
    useIsInCart,
    isAdding: addToCartMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
};
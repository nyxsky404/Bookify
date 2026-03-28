import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService, Cart, CartItem } from "@/lib/cart";
import { toast } from "sonner";

export function useCart() {
  return useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
    enabled: !!localStorage.getItem("bookify_token"),
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookId, quantity }: { bookId: string; quantity: number }) =>
      cartService.addItem(bookId, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
      toast.success("Added to cart");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to add to cart");
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateItem(itemId, quantity),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update cart");
    },
  });
}

export function useRemoveFromCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart"], updatedCart);
      toast.success("Removed from cart");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to remove from cart");
    },
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      queryClient.setQueryData(["cart"], null);
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart cleared");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to clear cart");
    },
  });
}

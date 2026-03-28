import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService, Order, OrdersResponse, CreateOrderDto, OrderStatus } from "@/lib/orders";
import { toast } from "sonner";

export function useMyOrders(page: number = 1, limit: number = 20) {
  return useQuery({
    queryKey: ["orders", "my", page, limit],
    queryFn: () => orderService.getMyOrders(page, limit),
    enabled: !!localStorage.getItem("bookify_token"),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderData: CreateOrderDto) => orderService.createOrder(orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders", "my"] });
      toast.success("Order placed successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to place order");
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) => orderService.cancelOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders", "my"] });
      toast.success("Order cancelled");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel order");
    },
  });
}

export function useAllOrders(filters?: {
  status?: OrderStatus;
  userId?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["orders", "all", filters],
    queryFn: () => orderService.getAllOrders(filters),
    enabled: !!localStorage.getItem("bookify_token"),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      orderService.updateOrderStatus(orderId, status),
    onSuccess: (_, { orderId }) => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders", "all"] });
      toast.success("Order status updated");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update order status");
    },
  });
}

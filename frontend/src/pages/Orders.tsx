import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useMyOrders, useCancelOrder } from "@/hooks/useOrders";
import { Calendar, Package } from "lucide-react";
import StickyHeader from "@/components/StickyHeader";
import Footer from "@/components/Footer";

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const Orders = () => {
  const [page, setPage] = useState(1);
  const { data: ordersData, isLoading, error } = useMyOrders(page);
  const { mutate: cancelOrder, isPending: isCancelling } = useCancelOrder();

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <StickyHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <StickyHeader />
        <div className="flex-1 section-padding py-10">
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-2xl font-semibold mb-2">Failed to load orders</h1>
            <p className="text-muted-foreground mb-6">Please try again later.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const orders = ordersData?.orders || [];

  if (orders.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <StickyHeader />
        <div className="flex-1 section-padding py-10">
          <div className="max-w-4xl mx-auto text-center py-16">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-2xl font-semibold mb-2">No orders yet</h1>
            <p className="text-muted-foreground mb-6">Start shopping to see your orders here!</p>
            <Button asChild>
              <Link to="/shop">Start Shopping</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <StickyHeader />
      <div className="flex-1 section-padding py-10">
        <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Orders</h1>

        <div className="space-y-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-4 h-4" />
                        {order.items.length} items
                      </div>
                    </div>
                  </div>
                  <Badge className={statusColors[order.status]}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-secondary rounded flex-shrink-0">
                        {item.book.imageUrl ? (
                          <img
                            src={item.book.imageUrl}
                            alt={item.book.title}
                            className="w-full h-full object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                            No img
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{item.book.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.book.author}</p>
                        <p className="text-sm">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">
                        Shipping to: {order.shippingStreet}, {order.shippingCity}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Payment: {order.paymentMethod}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold">
                        Total: ${order.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {order.status === "PENDING" && (
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={isCancelling}
                        onClick={() => cancelOrder(order.id)}
                      >
                        Cancel Order
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {ordersData?.pagination && ordersData.pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Previous
            </Button>
            <span className="py-2 px-4 text-sm">
              Page {page} of {ordersData.pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={page === ordersData.pagination.totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Orders;

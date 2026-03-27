import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CreateOrderSchema, type CreateOrderDto } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { useCreateOrder } from "@/hooks/useOrders";
import { useAuth } from "@/hooks/useAuth";
import StickyHeader from "@/components/StickyHeader";
import Footer from "@/components/Footer";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: cart } = useCart();
  const { mutateAsync: createOrder, isPending } = useCreateOrder();
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateOrderDto>({
    resolver: zodResolver(CreateOrderSchema),
    defaultValues: {
      shippingStreet: user?.address || "",
      shippingCity: "",
      shippingState: "",
      shippingZipCode: "",
      shippingCountry: "",
      paymentMethod: "SIMULATED",
    },
  });

  const onSubmit = async (data: CreateOrderDto) => {
    if (!cart || cart.items.length === 0) {
      setError("Your cart is empty");
      return;
    }

    try {
      setError("");
      await createOrder(data);
      navigate("/orders");
    } catch (err) {
      setError("Failed to place order. Please try again.");
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <StickyHeader />
        <div className="flex-1 section-padding py-10">
          <div className="max-w-4xl mx-auto text-center py-16">
            <h1 className="text-2xl font-semibold mb-2">Your cart is empty</h1>
            <p className="text-muted-foreground mb-6">Add some books before checkout.</p>
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Checkout</h1>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <CardContent className="space-y-4">
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}

                  <div className="space-y-2">
                    <Label htmlFor="shippingStreet">Street Address</Label>
                    <Input
                      id="shippingStreet"
                      placeholder="123 Main St"
                      {...register("shippingStreet")}
                    />
                    {errors.shippingStreet && (
                      <p className="text-sm text-destructive">{errors.shippingStreet.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingCity">City</Label>
                      <Input
                        id="shippingCity"
                        placeholder="New York"
                        {...register("shippingCity")}
                      />
                      {errors.shippingCity && (
                        <p className="text-sm text-destructive">{errors.shippingCity.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shippingState">State</Label>
                      <Input
                        id="shippingState"
                        placeholder="NY"
                        {...register("shippingState")}
                      />
                      {errors.shippingState && (
                        <p className="text-sm text-destructive">{errors.shippingState.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="shippingZipCode">Zip Code</Label>
                      <Input
                        id="shippingZipCode"
                        placeholder="10001"
                        {...register("shippingZipCode")}
                      />
                      {errors.shippingZipCode && (
                        <p className="text-sm text-destructive">{errors.shippingZipCode.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="shippingCountry">Country</Label>
                      <Input
                        id="shippingCountry"
                        placeholder="USA"
                        {...register("shippingCountry")}
                      />
                      {errors.shippingCountry && (
                        <p className="text-sm text-destructive">{errors.shippingCountry.message}</p>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? "Placing Order..." : "Place Order"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="truncate">
                      {item.quantity} × {item.book.title}
                    </span>
                    <span>${(item.book.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <Separator />
                
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cart.totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${cart.totalAmount.toFixed(2)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;

"use client";
import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { Loader2, LoaderCircle } from "lucide-react";
import { clearCartInRedis, createOrderInDB, updateCouponUsage } from "@/app/actions";
import { Color } from "@prisma/client";
import { Size } from "@prisma/client";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { Cart } from "@/app/lib/interfaces";

interface CheckoutButtonProps {
  isFormValid: boolean;
  className: string;
  address: string; // Add address as a prop
  paymentMethod: string
  cartItems: {
    id: string;
    name: string;
    originalPrice: number;
    finalPrice: number;
    quantity: number;
    imageString: string;
    variant: {
      id: string;
      size: Size;
      color: Color;
    };
  }[]; // Add cart items as a prop
  amount: number
  discountPrice: number
  coupon: string
}

export default function CheckoutButton({ isFormValid, address, cartItems, amount, className, discountPrice, coupon }: CheckoutButtonProps) {
  const router = useRouter();
  const [loading1, setLoading1] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const idRef = React.useRef();
  const { toast } = useToast();
  console.log("amount", amount)
  console.log("discountPrice", discountPrice)

  const { user } = useKindeBrowserClient();
  const userId = user?.id

  React.useEffect(() => {
    if (!amount) {
      router.replace("/");
    }
    createOrderId();
  }, [amount]);

  const createOrderId = async () => {
    try {
      const response = await fetch("/api/createOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amount * 100,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const id = data.orderId;
      idRef.current = id;
      setLoading1(false);
      return;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const processPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const orderId = idRef.current;

    if (!orderId) {
      console.error("Order ID is not available.");
      setLoading(false);
      return;
    }

    try {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount * 100,
        currency: "INR",
        name: "Payment",
        description: "Payment",
        order_id: orderId,
        handler: async function(response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();
          if (res.isOk) {
            const orderData = {
              userId,
              address,
              amount: amount * 100,
              items: cartItems,
              paymentMethod: "online",
              discountPrice: discountPrice
            }
            const orderCreationResult = await createOrderInDB(orderData)

            const orderRes = orderCreationResult;
            if (orderRes.success) {
              const clearCartResult = await clearCartInRedis(userId)
              toast({
                title: "Order Placed",
                description: "Order placed successfully!",
              });
              if (clearCartResult.success) {
                await updateCouponUsage(amount, coupon) // to add this in totalRevenue
                router.push("/payment/success");
              } else {
                toast({
                  title: "Error",
                  description: "Failed to clear cart in Redis.",
                });
                router.push("/payment/cancel");
              }
            } else {
              toast({
                title: "Error",
                description: "Failed to create order in DB.",
              });
              router.push("/payment/cancel");
            }
          } else {
            toast({
              title: "Error",
              description: res.message,
            });
          }
        },
        theme: {
          color: "#3399cc",
        },
      };
      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.on("payment.failed", function(response: any) {
        toast({
          title: "Error",
          description: response.error.description,
        });
      });
      paymentObject.open();
    } catch (error) {
      console.error("Error during payment processing:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading1)
    return (
      <div className="container flex justify-center items-center">
        <LoaderCircle className="animate-spin h-8 w-8 mt-4 text-primary" />
      </div>
    );

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <form onSubmit={processPayment}>
        <Button
          type="submit"
          className={`w-full mt-8 py-4 bg-black text-white font-bold rounded-full hover:bg-black/90 transition-all ${className}`}
          disabled={!isFormValid || loading}
        >
          {loading ? <Loader2 className="animate-spin mr-2" /> : "Pay"}
        </Button>
      </form>
    </>
  );
}

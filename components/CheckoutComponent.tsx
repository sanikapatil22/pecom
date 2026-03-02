"use client"
import React, { useState } from 'react'
import { Cart } from '@/app/lib/interfaces'
import Image from 'next/image'
import { Loader2, Tag, Trash2 } from 'lucide-react'
import { clearCartInRedis, createOrderInDB, delItem, reduceItemVariantStock, updateCouponUsage, validateCoupon } from '@/app/actions'
import { DeleteItem } from './SubmitButtons'
import { CartQuantityButtons } from './storefront/CartQuantityBUtton'
import CheckoutButton from './storefront/CheckoutButton'
import { Input } from './ui/input'
import { useForm } from 'react-hook-form'
import { Button } from './ui/button'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

type Props = {
  cart: Cart | null
  totalPrice: number
  totalItems: number
}

type FormData = {
  fullName: string
  phoneNumber: string
  flatOrHouseNo: string
  buildingName: string
  streetAddress: string
  landmark: string
  city: string
  state: string
  pinCode: string
}

const CheckoutComponent = ({ cart, totalPrice, totalItems }: Props) => {
  const { register, watch, formState: { errors, isValid } } = useForm<FormData>({
    mode: 'onChange'
  });

  const kindeUser = useKindeBrowserClient()

  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [paymentMethod, setPaymentMethod] = useState("online")
  const [discount, setDiscount] = useState<number>(0);
  const [couponCode, setCouponCode] = useState<string>("");

  const handleTabSwitch = (value: string) => {
    setPaymentMethod(value)
  }

  const handleSubmitCode = async (couponCode: string) => {
    try {
      const res = await validateCoupon(couponCode)
      if (!res.success) {
        return toast({
          title: "Error",
          description: `${res.message}`,
          variant: "destructive"
        })
      } else {
        setDiscount(res.discount ?? 0)
        toast({
          title: "Coupon Applied",
          description: `Coupon code of ${res.discount}% applied successfully`,
          variant: "default"
        })
      }
    } catch (e) {
      toast({
        title: "Error",
        description: `Error applying coupon code: ${e}`,
        variant: "destructive"
      })
    }
  }

  const discountedPrice = (totalPrice) * (1 - discount / 100);

  const processPayments = async () => {
    try {
      setIsLoading(true)
      const orderData = {
        userId: kindeUser.user?.id ?? "",
        address: formatFullAddress(watch()),
        amount: discountedPrice * 100,
        items: cart?.items ?? [],
        paymentMethod: "cod",
        discountPrice: totalPrice - discountedPrice
      };
      const orderCreationResult = await createOrderInDB(orderData);
      const orderRes = orderCreationResult;
      if (orderRes.success) {
        const reductItemVariantStock = await reduceItemVariantStock(cart?.items);
        const clearCartResult = await clearCartInRedis(kindeUser.user?.id ?? "");
        toast({
          title: "Order Placed",
          description: "Order placed successfully!",
        });
        if (clearCartResult.success && reductItemVariantStock.success) {
          await updateCouponUsage(discountedPrice, couponCode);
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
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
      router.push("/payment/cancel");
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatFullAddress = (data: FormData) => {
    const addressParts = [
      data.fullName,
      data.phoneNumber,
      data.flatOrHouseNo && `${data.flatOrHouseNo},`,
      data.buildingName && `${data.buildingName},`,
      data.streetAddress,
      data.landmark && `Landmark: ${data.landmark},`,
      `${data.city}, ${data.state} - ${data.pinCode}`
    ].filter(Boolean).join(' ');

    return addressParts;
  };

  return (
    <div className="min-h-screen max-w-[1400px] mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <Image
          src="/Pamara2.png"
          alt="pamara logo"
          width={120}
          height={40}
          className="h-7 w-auto invert"
        />
        <div className="w-px h-6 bg-neutral-300" />
        <h1 className="text-lg uppercase tracking-[0.15em] font-medium">
          Checkout
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
        {/* Left Column */}
        <div className="space-y-8">
          {/* Cart Items */}
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 pb-3 border-b border-neutral-200">
              Your Bag ({totalItems} {totalItems === 1 ? 'Item' : 'Items'})
            </h2>
            <div className="space-y-6">
              {cart?.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 pb-6 border-b border-neutral-100"
                >
                  <div className="relative w-20 h-24 flex-shrink-0 bg-neutral-100">
                    <Image
                      src={item.imageString}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-medium uppercase tracking-wide">{item.name}</h3>
                        <p className="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
                          {item.variant.size} / {item.variant.color}
                        </p>
                      </div>
                      <form action={delItem}>
                        <Input type="hidden" name="productId" value={item.id} />
                        <Input type="hidden" name="variantId" value={item.variant.id} />
                        <DeleteItem>
                          <Trash2 className="w-3.5 h-3.5 text-neutral-400 hover:text-black transition-colors" />
                        </DeleteItem>
                      </form>
                    </div>

                    <div className="flex items-center mt-3 justify-between">
                      <CartQuantityButtons
                        itemId={item.id}
                        initialQuantity={item.quantity}
                      />
                      <div className="text-right">
                        {item.originalPrice !== item.finalPrice && (
                          <p className="line-through text-neutral-400 text-xs">
                            {formatPrice(item.originalPrice * item.quantity)}
                          </p>
                        )}
                        <p className="text-sm font-medium">
                          {formatPrice(item.finalPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Form */}
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 pb-3 border-b border-neutral-200">
              Shipping Details
            </h2>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
                    Full Name
                  </label>
                  <input
                    {...register("fullName", { required: true })}
                    className="w-full h-10 px-3 border border-neutral-300 text-sm focus:border-black focus:outline-none transition-colors"
                  />
                  {errors.fullName && <span className="text-red-500 text-xs mt-1 block">Required</span>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    {...register("phoneNumber", {
                      required: true,
                      pattern: /^[0-9]{10}$/
                    })}
                    type="tel"
                    className="w-full h-10 px-3 border border-neutral-300 text-sm focus:border-black focus:outline-none transition-colors"
                  />
                  {errors.phoneNumber && <span className="text-red-500 text-xs mt-1 block">Valid phone required</span>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
                    Flat/House No
                  </label>
                  <input
                    {...register("flatOrHouseNo")}
                    className="w-full h-10 px-3 border border-neutral-300 text-sm focus:border-black focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
                    Building Name
                  </label>
                  <input
                    {...register("buildingName")}
                    className="w-full h-10 px-3 border border-neutral-300 text-sm focus:border-black focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
                  Street Address
                </label>
                <input
                  {...register("streetAddress", { required: true })}
                  className="w-full h-10 px-3 border border-neutral-300 text-sm focus:border-black focus:outline-none transition-colors"
                />
                {errors.streetAddress && <span className="text-red-500 text-xs mt-1 block">Required</span>}
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
                  Landmark (Optional)
                </label>
                <input
                  {...register("landmark")}
                  className="w-full h-10 px-3 border border-neutral-300 text-sm focus:border-black focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
                    City
                  </label>
                  <input
                    {...register("city", { required: true })}
                    className="w-full h-10 px-3 border border-neutral-300 text-sm focus:border-black focus:outline-none transition-colors"
                  />
                  {errors.city && <span className="text-red-500 text-xs mt-1 block">Required</span>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
                    State
                  </label>
                  <input
                    {...register("state", { required: true })}
                    className="w-full h-10 px-3 border border-neutral-300 text-sm focus:border-black focus:outline-none transition-colors"
                  />
                  {errors.state && <span className="text-red-500 text-xs mt-1 block">Required</span>}
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5">
                    PIN Code
                  </label>
                  <input
                    {...register("pinCode", {
                      required: true,
                      pattern: /^[0-9]{6}$/
                    })}
                    className="w-full h-10 px-3 border border-neutral-300 text-sm focus:border-black focus:outline-none transition-colors"
                  />
                  {errors.pinCode && <span className="text-red-500 text-xs mt-1 block">Valid PIN required</span>}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6 lg:sticky lg:top-28 h-fit">
          {/* Payment Method */}
          <div>
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 pb-3 border-b border-neutral-200">
              Payment Method
            </h2>
            <p className="text-xs text-neutral-400 mb-4">All transactions are secure and encrypted.</p>

            <div className="space-y-3">
              <div
                className={`border p-4 cursor-pointer transition-colors ${paymentMethod === "online"
                  ? "border-black"
                  : "border-neutral-200 hover:border-neutral-400"
                  }`}
                onClick={() => handleTabSwitch("online")}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 border-2 flex items-center justify-center ${paymentMethod === "online" ? "border-black" : "border-neutral-300"}`}>
                    {paymentMethod === "online" && <div className="w-2 h-2 bg-black" />}
                  </div>
                  <span className="text-sm font-medium">Razorpay (UPI, Cards, Wallets)</span>
                </div>
                <div className="flex gap-2 mt-3 ml-7">
                  {["/upi.jpeg", "/master.jpeg", "/netbanking.jpeg", "/visa.png"].map((payment) => (
                    <div key={payment} className="w-10 h-6 bg-white border border-neutral-200 p-0.5 flex items-center justify-center">
                      <img src={payment} alt="payment" className="w-full h-full object-contain" />
                    </div>
                  ))}
                </div>
                {paymentMethod === "online" && (
                  <p className="text-xs text-neutral-400 mt-3 ml-7">
                    You will be redirected to Razorpay to complete your purchase.
                  </p>
                )}
              </div>

              <div
                className={`border p-4 cursor-pointer transition-colors ${paymentMethod === "cod"
                  ? "border-black"
                  : "border-neutral-200 hover:border-neutral-400"
                  }`}
                onClick={() => handleTabSwitch("cod")}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 border-2 flex items-center justify-center ${paymentMethod === "cod" ? "border-black" : "border-neutral-300"}`}>
                    {paymentMethod === "cod" && <div className="w-2 h-2 bg-black" />}
                  </div>
                  <span className="text-sm font-medium">Cash On Delivery</span>
                </div>
              </div>
            </div>
          </div>

          {/* Coupon */}
          <div>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await handleSubmitCode(couponCode);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="flex-1 h-10 px-3 border border-neutral-300 text-sm focus:border-black focus:outline-none transition-colors uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !couponCode.trim()}
                className="h-10 px-6 bg-black text-white text-xs uppercase tracking-[0.15em] font-medium hover:bg-neutral-800 transition-colors disabled:opacity-40"
              >
                Apply
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="bg-neutral-50 p-6">
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium mb-6 pb-3 border-b border-neutral-200">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span className="text-xs uppercase tracking-wider">Free</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="text-neutral-500">Discount ({discount}%)</span>
                  <span>-{formatPrice(totalPrice - discountedPrice)}</span>
                </div>
              )}
              <div className="border-t border-neutral-200 pt-3 mt-3">
                <div className="flex justify-between font-medium text-base">
                  <span>Total</span>
                  <span>{formatPrice(discountedPrice)}</span>
                </div>
              </div>
            </div>

            {paymentMethod === "online" ? (
              <CheckoutButton
                isFormValid={isValid}
                address={formatFullAddress(watch())}
                paymentMethod={paymentMethod}
                cartItems={cart?.items ?? []}
                amount={parseInt(discountedPrice.toFixed(0))}
                className="w-full mt-6 h-12 bg-black text-white text-sm uppercase tracking-[0.15em] font-medium hover:bg-neutral-800 transition-colors"
                discountPrice={totalPrice - discountedPrice}
                coupon={couponCode}
              />
            ) : (
              <button
                disabled={!isValid || isLoading}
                onClick={processPayments}
                type="submit"
                className="w-full mt-6 h-12 bg-black text-white text-sm uppercase tracking-[0.15em] font-medium hover:bg-neutral-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isLoading && (<Loader2 className='animate-spin mr-2 w-4 h-4' />)}
                Place Order
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutComponent;

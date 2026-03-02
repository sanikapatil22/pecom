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
          await updateCouponUsage(discountedPrice, couponCode); // to add this in totalRevenue
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
    <div className="min-h-screen text-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-12">
          <Image
            src="/Pamara2.png"
            alt="pamara logo"
            width={190}
            height={190}
            className="h-16 w-auto flex-shrink-0 -mr-1 mx-3 bg-black rounded-md"
          />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Checkout
          </h1>
        </div>

        <div className="mx-auto grid md:grid-cols-2 gap-16">
          <div className="bg-white rounded-2xl p-8">
            <h2 className="text-2xl font-bold border-b border-black/10 pb-4 mb-8">
              Your Cart ({totalItems} {totalItems === 1 ? 'Item' : 'Items'})
            </h2>

            <div className="space-y-8">
              {cart?.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center border-b border-black/5 pb-6 hover:bg-gray-50/50 transition-colors rounded-lg p-4"
                >
                  <div className="relative w-24 h-24 mr-6">
                    <Image
                      src={item.imageString}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-black/60 text-sm">
                          {item.variant.size} | {item.variant.color}
                        </p>
                      </div>
                      <form action={delItem}>
                        <Input type="hidden" name="productId" value={item.id} />
                        <Input type="hidden" name="variantId" value={item.variant.id} />
                        <DeleteItem>
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500 transition-colors" />
                        </DeleteItem>
                      </form>
                    </div>

                    <div className="flex items-center mt-3 justify-between">
                      <div className="flex justify-between items-center mt-2 gap-4">
                        <CartQuantityButtons
                          itemId={item.id}
                          initialQuantity={item.quantity}
                        />
                      </div>

                      <div className="text-right">
                        <p className="line-through text-black/50 text-sm">
                          {formatPrice(item.originalPrice * item.quantity)}
                        </p>
                        <p className="font-bold text-lg">
                          {formatPrice(item.finalPrice * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="bg-white rounded-xl shadow-sm p-8 mt-12">
                <h1 className="text-2xl font-semibold mb-8 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Shipping Details
                </h1>
                <form className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <Input
                        {...register("fullName", { required: true })}
                        className="mt-1 block w-full transition-all duration-200 focus:ring-2 focus:ring-black/5"
                      />
                      {errors.fullName && <span className="text-red-500 text-sm">This field is required</span>}
                    </div>
                    <div>
                      <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                        Phone Number
                      </label>
                      <Input
                        {...register("phoneNumber", {
                          required: true,
                          pattern: /^[0-9]{10}$/
                        })}
                        type="tel"
                        className="mt-1 block w-full"
                      />
                      {errors.phoneNumber && <span className="text-red-500 text-sm">Valid phone number required</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="flatOrHouseNo" className="block text-sm font-medium text-gray-700">
                        Flat/House No
                      </label>
                      <Input
                        {...register("flatOrHouseNo")}
                        className="mt-1 block w-full"
                      />
                    </div>
                    <div>
                      <label htmlFor="buildingName" className="block text-sm font-medium text-gray-700">
                        Building/Complex Name
                      </label>
                      <Input
                        {...register("buildingName")}
                        className="mt-1 block w-full"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
                      Street Address
                    </label>
                    <Input
                      {...register("streetAddress", { required: true })}
                      className="mt-1 block w-full"
                    />
                    {errors.streetAddress && <span className="text-red-500 text-sm">This field is required</span>}
                  </div>

                  <div>
                    <label htmlFor="landmark" className="block text-sm font-medium text-gray-700">
                      Landmark (Optional)
                    </label>
                    <Input
                      {...register("landmark")}
                      className="mt-1 block w-full"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                      </label>
                      <Input
                        {...register("city", { required: true })}
                        className="mt-1 block w-full"
                      />
                      {errors.city && <span className="text-red-500 text-sm">Required</span>}
                    </div>
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                        State
                      </label>
                      <Input
                        {...register("state", { required: true })}
                        className="mt-1 block w-full"
                      />
                      {errors.state && <span className="text-red-500 text-sm">Required</span>}
                    </div>
                    <div>
                      <label htmlFor="pinCode" className="block text-sm font-medium text-gray-700">
                        PIN Code
                      </label>
                      <Input
                        {...register("pinCode", {
                          required: true,
                          pattern: /^[0-9]{6}$/
                        })}
                        className="mt-1 block w-full"
                      />
                      {errors.pinCode && <span className="text-red-500 text-sm">Valid PIN required</span>}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <div className="space-y-8 h-fit sticky top-8">
            <div className="bg-white rounded-2xl shadow-sm p-8">
              <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Payment Method
              </h2>
              <p className="text-sm text-gray-600 mb-6">All transactions are secure and encrypted.</p>

              <div className="space-y-4">
                <div
                  className={`border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === "online"
                    ? "border-blue-600 bg-blue-50/50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => handleTabSwitch("online")}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="online"
                      name="paymentMethod"
                      value="online"
                      checked={paymentMethod === "online"}
                      onChange={() => handleTabSwitch("online")}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="online" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Razorpay Secure (UPI, Cards, Wallets, NetBanking)</span>
                      </div>
                      <div className="flex gap-3 my-2">
                        {["/upi.jpeg", "/master.jpeg", "/netbanking.jpeg", "/visa.png"].map((payment) => (
                          <div
                            key={payment}
                            className="w-12 h-8 bg-white rounded-md shadow-sm p-1 flex items-center justify-center"
                          >
                            <img src={payment || "/placeholder.svg"} alt="payment" className="w-full h-full object-contain" />
                          </div>
                        ))}
                      </div>
                    </label>
                  </div>
                  {paymentMethod === "online" && (
                    <div className="mt-4 border-t pt-4">
                      <div className="flex items-center justify-center text-sm text-gray-600">
                        <span>After clicking "Pay now", you will be redirected to Razorpay Secure to complete your purchase securely.</span>
                      </div>
                    </div>
                  )}
                </div>

                <div
                  className={`border rounded-xl p-6 cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === "cod"
                    ? "border-blue-600 bg-blue-50/50"
                    : "border-gray-200 hover:border-gray-300"
                    }`}
                  onClick={() => handleTabSwitch("cod")}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="cod"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => handleTabSwitch("cod")}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Cash On Delivery</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative w-full max-w-md mx-auto">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await handleSubmitCode(couponCode);
                }}
                className="flex items-center space-x-2 bg-white shadow-sm rounded-lg border border-gray-200 "
              >
                <div className="relative flex-1">
                  <Tag
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <Input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="pl-10 pr-4 py-2 w-full border-none focus:ring-2 focus:ring-black/20 transition-all duration-300"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading || !couponCode.trim()}
                  className="
            bg-black text-white hover:bg-gray-800 
            px-4 py-2 m-1 rounded-md 
            transition-all duration-300 
            flex items-center space-x-2
            disabled:opacity-50 disabled:cursor-not-allowed
          "
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Applying...</span>
                    </div>
                  ) : (
                    <span>Apply Coupon</span>
                  )}
                </Button>
              </form>
              {!couponCode.trim() && (
                <p className="text-xs text-gray-500 mt-1 text-center">
                  Enter a coupon code to apply
                </p>
              )}
            </div>


            <div className="bg-gradient-to-br from-black/90 to-black/75 text-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold border-b border-white/10 pb-4 mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span className="text-green-400">Free</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Discount</span>
                  {discount === 0 ? (
                    <span className='text-gray-50'>{discount}</span>
                  ) : (
                    <span className='text-green-400'>{(discountedPrice - totalPrice).toFixed(1)}</span>
                  )}
                </div>
                <div className="flex justify-between text-xl pt-4 mt-4 border-t border-white/10">
                  <span>Total</span>
                  <span className="font-bold">{formatPrice(discountedPrice)}</span>
                </div>
              </div>

              {paymentMethod === "online" ? (
                <CheckoutButton
                  isFormValid={isValid}
                  address={formatFullAddress(watch())}
                  paymentMethod={paymentMethod}
                  cartItems={cart?.items ?? []}
                  amount={parseInt(discountedPrice.toFixed(0))}
                  className="w-full mt-8 bg-white text-gray-900 hover:bg-gray-100"
                  discountPrice={totalPrice - discountedPrice}
                  coupon={couponCode}
                />
              ) : (
                <Button
                  disabled={!isValid || isLoading}
                  onClick={processPayments}
                  type="submit"
                  className="w-full mt-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all disabled:cursor-not-allowed"
                >
                  {isLoading && (<Loader2 className='animate-spin mr-2' />)}Place Order
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutComponent;

"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { CouponCodeValue, EditHomeContentSchema, couponCodeSchema } from "@/app/lib/zodSchemas"
import { toast } from "@/hooks/use-toast"
import { updateCouponCode } from "@/app/actions"
import { useRouter } from "next/navigation"
import { coupon } from "@prisma/client"
import { Switch } from "../ui/switch"

interface EditCouponCodeContentProps {
  data: coupon
}

export default function EditCouponCodeContent({ data }: EditCouponCodeContentProps) {
  console.log(data)
  const router = useRouter()

  const form = useForm<CouponCodeValue & { id: string }>({
    resolver: zodResolver(couponCodeSchema),
    defaultValues: {
      id: data.id,
      code: data.code,
      discount: data.discount,
      isValid: data.isValid,
    },
  })

  const onSubmit: SubmitHandler<CouponCodeValue> = async (values) => {
    const res = await updateCouponCode(values, data.id)

    if (!res?.success) {
      toast({
        title: "Error",
        description: "Error Updating Coupon Code",
        variant: "destructive"
      })
    } else {
      toast({
        title: "Successfully Updated",
        description: "Coupon Code Updated Successfully",
        variant: "default",
      })
      router.push("/dashboard/coupons")
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Coupon code Page Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coupon Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Discount Value" type="number" {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isValid"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Coupon Valid?</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}


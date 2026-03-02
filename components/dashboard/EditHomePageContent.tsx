"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EditHomeContentSchema, EditHomeContentValues } from "@/app/lib/zodSchemas"
import { toast } from "@/hooks/use-toast"
import { upadateHomePageContent } from "@/app/actions"
import { useRouter } from "next/navigation"
import { HomePageContent } from "@prisma/client"
import { Switch } from "../ui/switch"

interface EditHomePageContentProps {
  data: HomePageContent
}

export default function EditHomePageContent({ data }: EditHomePageContentProps) {
  const router = useRouter()

  const form = useForm<EditHomeContentValues & { id: string }>({
    resolver: zodResolver(EditHomeContentSchema),
    defaultValues: {
      id: data.id,
      headingLarge: data.headingLarge ?? "",
      headingSmall: data.headingSmall ?? "",
      tagline: data.tagline ?? "",
      description: data.description ?? "",
      cardTitle: data.cardTitle ?? "",
      cardDescription: data.cardDescription ?? "",
      isActive: data.isActive,
    },
  })

  const onSubmit: SubmitHandler<EditHomeContentValues> = async (values) => {
    const res = await upadateHomePageContent(values, data.id)

    if (!res?.success) {
      toast({
        title: "Error",
        description: "Error Updating Banner Content",
        variant: "destructive"
      })
    } else {
      toast({
        title: "Successfully Updated",
        description: "Banner Content Updated Successfully",
        variant: "default",
      })
      router.push("/dashboard/home")
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Edit Home Page Content</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="headingLarge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Large Heading</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter large heading" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="headingSmall"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Small Heading</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter small heading" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tagline" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter card title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cardDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter card description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Display Content?</FormLabel>
                    <FormDescription>
                      The Content will be visible on the home page
                    </FormDescription>
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

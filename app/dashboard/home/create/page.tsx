"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { EditHomeContentSchema, EditHomeContentValues } from "@/app/lib/zodSchemas"
import { toast } from "@/hooks/use-toast"
import { createHomePageContent } from "@/app/actions"
import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


export default function EditHome() {
  const router = useRouter()

  const form = useForm<EditHomeContentValues>({
    resolver: zodResolver(EditHomeContentSchema),
    defaultValues: {
      headingLarge: "",
      headingSmall: "",
      tagline: "",
      description: "",
      cardTitle: "",
      cardDescription: "",
    },
  })


  async function onSubmit(values: EditHomeContentValues) {
    const res = await createHomePageContent(values)

    if (!res?.success === true) {
      return toast({
        title: "Error",
        description: "Error Creating Banner Content",
        variant: "destructive"
      })
    } else {
      toast({
        title: "successly created",
        description: "Created Banner Content successfylly",
        variant: "default",
      })
      router.push("/dashboard/home")
    }
  }

  return (
    <Card className="max-w-4xl mx-auto">
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



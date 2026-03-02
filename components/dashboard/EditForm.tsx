"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Image from "next/image";
import { useState } from "react";
import { editProduct, removeProductVariant } from "@/app/actions";
import { ProductType, productSchema } from "@/app/lib/zodSchemas";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useFieldArray, useForm } from "react-hook-form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, PlusCircle, XIcon } from 'lucide-react'
import { UploadDropzone } from "@/app/lib/uplaodthing"
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface iAppProps {
  data: ProductType
}

export function EditForm({ data }: iAppProps) {
  const [images, setImages] = useState<string[]>(data.images);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();


  const form = useForm<z.infer<typeof productSchema> & { id: string }>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      id: data.id,
      name: data.name,
      headline: data.headline,
      description: data.description,
      material: data.material,
      pattern: data.pattern,
      fitType: data.fitType,
      sleeveType: data.sleeveType,
      collarStyle: data.collarStyle,
      length: data.length,
      countryOfOrigin: data.countryOfOrigin,
      comfortFeatures: data.comfortFeatures,
      manufacturer: data.manufacturer,
      packer: data.packer,
      netQuantity: data.netQuantity,
      status: data.status,
      originalPrice: data.originalPrice,
      finalPrice: data.finalPrice,
      images: data.images,
      gender: data.gender,
      category: data.category,
      isFeatured: data.isFeatured,
      isBestSeller: data.isBestSeller,
      variants: data.variants,
      sku: data.sku,
    },
  });

  async function onSubmit(formData: z.infer<typeof productSchema> & { id: string }) {
    try {
      setIsLoading(true);
      const response = await editProduct({
        ...formData,
        id: data.id,
        images: images,
        variants: formData.variants,  // Using the variants state instead of formData.variants
      });

      if ('error' in response) {
        toast({
          title: "Error",
          description: response.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
        router.push('/dashboard/products');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
    finally {
      setIsLoading(false);
    }
  }

  const handleDelete = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "variants",
  });

  const removeVariant = async (index: number) => {
    try {
      const result = await removeProductVariant(data.id, data.variants[index].id);

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
        return;
      }

      remove(index);
      toast({
        title: "Success",
        description: "Variant removed successfully",
      });

      // Refresh the form data if stock was set to 0
      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove variant",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Product name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="headline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Headline</FormLabel>
                    <FormControl>
                      <Input placeholder="Product headline" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Product description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Price" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="finalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="Price" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="DRAFT">Draft</SelectItem>
                        <SelectItem value="PUBLISHED">Published</SelectItem>
                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a gender" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MEN">Men</SelectItem>
                        <SelectItem value="WOMEN">Women</SelectItem>
                        <SelectItem value="KIDS">Kids</SelectItem>
                        <SelectItem value="UNISEX">Unisex</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="TANKS">Tanks</SelectItem>
                        <SelectItem value="T_SHIRTS">T-Shirts</SelectItem>
                        <SelectItem value="HOODIES">Hoodies</SelectItem>
                        <SelectItem value="SHORTS">Shorts</SelectItem>
                        <SelectItem value="JEANS">Jeans</SelectItem>
                        <SelectItem value="OUTERWEAR">Outerwear</SelectItem>
                        <SelectItem value="JOGGERS">Joggers</SelectItem>
                        <SelectItem value="OVERSIZED_TSHIRTS">Oversized T-Shirts</SelectItem>
                        <SelectItem value="ACCESSORIES">Accessories</SelectItem>
                        <SelectItem value="ALL_PRODUCTS">All Products</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="material"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Material</FormLabel>
                    <FormControl>
                      <Input placeholder="Material" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pattern"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pattern</FormLabel>
                    <FormControl>
                      <Input placeholder="Pattern" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fitType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fit Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Fit Type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="sleeveType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sleeve Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Sleeve Type" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="collarStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Collar Style</FormLabel>
                    <FormControl>
                      <Input placeholder="Collar Style" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="length"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Length</FormLabel>
                    <FormControl>
                      <Input placeholder="Length" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manufacturing Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="countryOfOrigin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country of Origin</FormLabel>
                    <FormControl>
                      <Input placeholder="Country of Origin" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input placeholder="Manufacturer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/*
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="packer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Packer</FormLabel>
                    <FormControl>
                      <Input placeholder="Packer" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
              */}
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="sku"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="netQuantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Net Quantity</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Net Quantity" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Variants</CardTitle>
            <CardDescription>Add size and color variants for this product</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-3 gap-4 items-end border p-4 rounded-lg">
                  <div>
                    <FormField
                      control={form.control}
                      name={`variants.${index}.size`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["XS", "S", "M", "L", "XL", "XXL"].map((size) => (
                                <SelectItem key={size} value={size}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <FormField
                      control={form.control}
                      name={`variants.${index}.color`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Color</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select color" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {["BLACK", "WHITE", "GRAY", "RED", "BLUE", "GREEN", "YELLOW", "PURPLE", "PINK", "ORANGE", "NAVY", "BROWN", "MULTICOLOR", "DUSTY_GREEN", "MAROON", "COOKIE", "BEIGE", "SKY_BLUE", "LIGHT_GREEN", "KHAKI"].map((color) => (
                                <SelectItem key={color} value={color}>
                                  {color}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="flex items-center">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.stock`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Stock</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} min="0" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex flex-col items-center max-w-fit">
                      <p>Remove</p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeVariant(index)}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={() => append({ size: "M", color: "BLACK", stock: 0 })}
                className="w-full"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Variant
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <FormLabel>Images</FormLabel>
              {images.length > 0 ? (
                <div className="flex gap-5 mt-2">
                  {images.map((image, index) => (
                    <div key={index} className="relative w-[100px] h-[100px]">
                      <Image
                        src={image}
                        alt={`Product Image ${index + 1}`}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg border"
                      />
                      <button
                        onClick={() => handleDelete(index)}
                        type="button"
                        className="absolute -top-3 -right-3 bg-red-500 p-2 rounded-lg text-white"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <UploadDropzone
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    const urls = res.map((r) => r.url);
                    setImages(urls);
                    form.setValue('images', urls, {
                      shouldValidate: true, // Add this
                      shouldDirty: true // Add this
                    });
                  }}
                  onUploadError={(error) => {
                    console.error("Upload error:", error); // Modify error handling
                    alert("Something went wrong with the upload");
                  }}
                />
              )}
              <FormMessage>{form.formState.errors.images?.message}</FormMessage>
            </div>
          </CardContent>
        </Card>

        <FormField
          control={form.control}
          name="isBestSeller"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Best Seller</FormLabel>
                <FormDescription>
                  This product will appear on the best seller section
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value || false}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isFeatured"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Featured Product</FormLabel>
                <FormDescription>
                  This product will appear on the home page
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
        <Button
          disabled={isLoading}
          type="submit">{isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />} Save Changes</Button>
      </form>
    </Form >
  )
}

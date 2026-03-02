import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, Truck, Shield, RefreshCw } from 'lucide-react'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Thumbnail Navigation Skeleton */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="flex flex-col gap-4 sticky top-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-20 h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Main Image Skeleton */}
        <div className="lg:col-span-6 relative">
          <div className="relative h-[600px] w-full lg:sticky lg:top-4">
            <Skeleton className="h-full w-full rounded-lg" />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg">
              <Skeleton className="w-5 h-5" />
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-lg">
              <Skeleton className="w-5 h-5" />
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1 rounded-full">
              <Skeleton className="w-12 h-4" />
            </div>
          </div>
        </div>

        {/* Product Details Skeleton */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <Badge className="mb-4" variant="secondary">
              <Skeleton className="h-4 w-20" />
            </Badge>
            <Skeleton className="h-9 w-3/4 mb-2" /> {/* Adjusted for text-3xl */}
            <Skeleton className="h-5 w-1/2" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>

          {/* Color Display Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>

          {/* Size Selection Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-5 w-24" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="w-full h-14 rounded" />
              ))}
            </div>
          </div>

          {/* Action Buttons Skeleton */}
          <div className="space-y-4">
            <Skeleton className="w-full h-12 rounded" />
            <Button variant="outline" className="w-full h-12 border-2" disabled>
              <Heart className="mr-2 h-5 w-5" />
              <Skeleton className="h-5 w-32" />
            </Button>
          </div>

          {/* Product Features */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="text-center">
              <Truck className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
            <div className="text-center">
              <Shield className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <Skeleton className="h-4 w-24 mx-auto" />
            </div>
            <div className="text-center">
              <RefreshCw className="w-6 h-6 mx-auto mb-2 text-gray-400" />
              <Skeleton className="h-4 w-20 mx-auto" />
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="space-y-6 pt-6 border-t">
            <div>
              <Skeleton className="h-5 w-40 mb-3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i}>
                  <Skeleton className="h-5 w-32 mb-2" />
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="flex justify-between mb-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div>
              <Skeleton className="h-5 w-40 mb-2" />
              <div className="flex flex-wrap gap-2">
                {[...Array(4)].map((_, i) => (
                  <Badge key={i} variant="outline">
                    <Skeleton className="h-4 w-16" />
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



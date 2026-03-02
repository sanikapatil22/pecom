import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Heart } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-[1700px] mx-auto px-4 md:px-8 py-8">
        {/* Hero Carousel Loading Skeleton */}
        <div className="relative w-full max-w-[1550px] mx-auto mb-12">
          <Card className="overflow-hidden rounded-lg">
            <div className="relative h-[400px] md:h-[500px] w-full">
              <Skeleton className="absolute inset-0" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent">
                <div className="flex flex-col justify-center h-full max-w-xl px-8 md:px-12">
                  <Skeleton className="h-12 w-3/4 mb-4" />
                  <Skeleton className="h-8 w-1/2 mb-6" />
                  <Skeleton className="h-12 w-40" />
                </div>
              </div>
              <Skeleton className="absolute bottom-0 w-full h-12" />
            </div>
          </Card>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            disabled
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
            disabled
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
            {[...Array(3)].map((_, index) => (
              <Skeleton key={index} className="w-2 h-2 rounded-full" />
            ))}
          </div>
        </div>

        {/* Category Title Skeleton */}
        <Skeleton className="h-9 w-64 mb-8" />

        {/* Product Grid Loading Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, index) => (
            <Card 
              key={index}
              className="w-full max-w-[400px] h-[700px] overflow-hidden rounded-md transition-all duration-300 hover:border-black hover:shadow-lg group"
            >
              <div className="relative h-[75%]">
                <Skeleton className="absolute inset-0 rounded-2xl m-1" />
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-md px-3 py-1.5">
                  <Star className="w-5 h-5 text-gray-300" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </div>

              <div className="p-6 h-[25%] flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-7 w-20" />
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                  <Skeleton className="h-5 w-3/4" />
                </div>

                <div className="flex gap-3">
                  <Skeleton className="flex-1 h-12" />
                  <Skeleton className="h-12 w-12" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}



'use client'

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"

const products = [
  { id: 1, name: "Elegant Watch", image: "/placeholder.svg?height=400&width=300&text=Watch" },
  { id: 2, name: "Designer Bag", image: "/placeholder.svg?height=400&width=300&text=Bag" },
  { id: 3, name: "Stylish Sunglasses", image: "/placeholder.svg?height=400&width=300&text=Sunglasses" },
  { id: 4, name: "Leather Shoes", image: "/placeholder.svg?height=400&width=300&text=Shoes" },
]

export function ProductCarousel() {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-sm"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover rounded-lg shadow-xl"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}



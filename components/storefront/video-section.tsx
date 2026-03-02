"use client"
import { useRef, useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoSectionProps {
  name: string
  originalPrice: number
  discountedPrice: number
  videoUrl: string
  className?: string
  onAddToCart?: () => void
}

export default function VideoSection({
  name,
  originalPrice,
  discountedPrice,
  videoUrl,
  className,
  onAddToCart
}: VideoSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const [progress, setProgress] = useState(0)
  const cardVideoRef = useRef<HTMLVideoElement>(null)
  const modalVideoRef = useRef<HTMLVideoElement>(null)
  const discountPercentage = Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)

  useEffect(() => {
    const videoElement = cardVideoRef.current
    if (!videoElement) return

    const playVideo = async () => {
      try {
        await videoElement.play()
      } catch (error) {
        console.error('Error playing video:', error)
      }
    }
    playVideo()

    return () => {
      if (videoElement) {
        videoElement.pause()
      }
    }
  }, [])

  useEffect(() => {
    if (isModalOpen && modalVideoRef.current) {
      modalVideoRef.current.currentTime = cardVideoRef.current?.currentTime || 0
      modalVideoRef.current.play()
    }
  }, [isModalOpen])

  const handleTimeUpdate = () => {
    const video = modalVideoRef.current
    if (video) {
      const progress = (video.currentTime / video.duration) * 100
      setProgress(progress)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart?.()
  }

  return (
    <>
      <Card 
        className={cn(
          "group relative overflow-hidden rounded-3xl bg-white transition-all hover:shadow-lg w-full cursor-pointer",
          className
        )}
        onClick={() => setIsModalOpen(true)}
      >
        <CardContent className="p-0">
          <div 
            className="relative w-full pb-[140%] overflow-hidden bg-gray-100"
          >
            <video
              ref={cardVideoRef}
              className="absolute inset-0 h-full w-full object-cover"
              loop
              muted
              playsInline
              autoPlay
              preload="auto"
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
              Your browser does not support the video tag.
            </video>
            {discountPercentage >= 0 && (
              <div className="absolute top-4 left-4 z-10">
                <div className="bg-[#37BD6B] text-white px-3 py-1 rounded-lg text-sm font-medium">
                  {discountPercentage}% OFF
                </div>
              </div>
            )}
          </div>
          
          <div className="p-4 lg:p-6 bg-white">
            <h3 className="mb-3 text-base lg:text-xl font-medium text-gray-900 line-clamp-1">
              {name}
            </h3>
            <div className="flex items-center gap-2 lg:gap-3">
              <div className="flex items-baseline gap-2">
                <span className="text-lg lg:text-xl font-bold">₹{discountedPrice}</span>
                {discountPercentage > 0 && (
                  <span className="text-sm lg:text-base text-gray-500 line-through">₹{originalPrice}</span>
                )}
              </div>
              {discountPercentage > 0 && (
                <span className="ml-auto text-[#37BD6B] text-sm lg:text-base font-medium">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black">
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-600 z-20">
              <div 
                className="h-full bg-[#37BD6B] transition-all duration-300 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            <video
              ref={modalVideoRef}
              className="w-full h-full object-cover"
              loop
              playsInline
              autoPlay
              muted={isMuted}
              onTimeUpdate={handleTimeUpdate}
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
              Your browser does not support the video tag.
            </video>
            
            <div className="absolute top-8 right-4 flex gap-2">
              <button
                onClick={toggleMute}
                className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="w-6 h-6 text-white" />
                ) : (
                  <Volume2 className="w-6 h-6 text-white" />
                )}
              </button>
              <button
                onClick={toggleLike}
                className="p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              >
                <Heart 
                  className={cn(
                    "w-6 h-6 transition-colors",
                    isLiked ? "fill-red-500 text-red-500" : "text-white"
                  )} 
                />
              </button>
            </div>

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 lg:p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl lg:text-2xl font-medium text-white mb-2">{name}</h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-xl lg:text-2xl font-bold text-white">₹{discountedPrice}</span>
                    {discountPercentage > 0 && (
                      <>
                        <span className="text-base lg:text-lg text-gray-300 line-through">₹{originalPrice}</span>
                        <span className="text-[#37BD6B] text-base lg:text-lg font-medium">{discountPercentage}% OFF</span>
                      </>
                    )}
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    Select your size to add this item to your cart
                  </p>
                </div>
              </div>

              <div className="flex gap-2 mb-4">
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <Button
                    key={size}
                    variant="outline"
                    className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {size}
                  </Button>
                ))}
              </div>

              <Button
                className="w-full bg-[#37BD6B] hover:bg-[#2ea85d] text-white py-4 lg:py-6 text-base lg:text-lg font-medium"
                onClick={handleAddToCart}
              >
                ADD TO CART
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

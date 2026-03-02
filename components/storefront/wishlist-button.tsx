"use client";

import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { addItemWishlist, checkWishlistStatus } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface WishlistButtonProps {
    productId: string;
}

export function WishlistButton({ productId }: WishlistButtonProps) {
    const [isLiked, setIsLiked] = useState<null | boolean>(null); // Initial state as null
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const checkStatus = async () => {
            if (!productId) return;

            try {
                const result = await checkWishlistStatus(productId);
                setIsLiked(result.isInWishlist ?? false);
            } catch (error) {
                console.error('Error checking wishlist status:', error);
            }
        };

        checkStatus();
    }, [productId]);

    const handleAddToWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!productId) return;

        setIsLoading(true);
        try {
            const result = await addItemWishlist(productId);

            if (result.success) {
                setIsLiked(true);
                toast({
                    title: "Added to wishlist",
                    description: "Item has been added to your wishlist",
                });
            } else if (result.info) {
                toast({
                    title: "Already in wishlist",
                    description: result.info,
                    variant: "default",
                });
            } else if (result.error) {
                toast({
                    title: "Error",
                    description: result.error,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add item to wishlist",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        isLiked === null ? (
            <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
            <Button
                variant="outline"
                size="icon"
                className={cn(
                    "border-gray-200 h-[48px] w-[48px] transition-all duration-300 hover:border-gray-400 hover:bg-gray-50 hover:scale-105",
                    isLoading && "opacity-50 cursor-not-allowed"
                )}
                onClick={handleAddToWishlist}
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                    <Heart
                        className={cn(
                            "w-6 h-6 transition-colors duration-300 hover:text-gray-700",
                            isLiked && "fill-red-500 text-red-500"
                        )}
                    />
                )}
            </Button>
        )
    );
}
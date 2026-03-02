'use client';

import { Button } from "@/components/ui/button";
import { Minus, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { updateQuantity } from "@/app/actions";

interface CartQuantityButtonsProps {
  itemId: string;
  initialQuantity: number;
}

export function CartQuantityButtons({ itemId, initialQuantity }: CartQuantityButtonsProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [isLoading, setIsLoading] = useState(false);

  const handleQuantityChange = async (change: number) => {
    const newQuantity = quantity + change;
    
    if (newQuantity < 1 || newQuantity > 10) return;
    
    setIsLoading(true);
    try {
      const result = await updateQuantity(itemId, newQuantity);
      if (result.success) {
        setQuantity(newQuantity);
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => handleQuantityChange(-1)}
        disabled={isLoading || quantity <= 1}
      >
        {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Minus className="h-3 w-3" />}
      </Button>
      
      <span className="w-8 text-center text-sm">{quantity}</span>
      
      <Button
        variant="outline"
        size="icon"
        className="h-7 w-7"
        onClick={() => handleQuantityChange(1)}
        disabled={isLoading || quantity >= 10}
      >
        {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
      </Button>
    </div>
  );
}``

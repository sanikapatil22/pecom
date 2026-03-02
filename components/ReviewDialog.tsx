"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Star } from "lucide-react";
import { submitReview } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Types
type Rating = 0 | 1 | 2 | 3 | 4 | 5;

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
}

interface ReviewSubmission {
  productId: string;
  rating: Rating;
  comment: string;
}

// Component
export default function ReviewDialog({
  isOpen,
  onClose,
  productId,
}: ReviewDialogProps) {
  // State
  const [rating, setRating] = useState<Rating>(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();

  // Handlers
  const handleRatingChange = (newRating: Rating) => {
    setRating(newRating);
  };

  const handleReviewChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReview(event.target.value);
  };

  const resetForm = () => {
    setRating(0);
    setReview("");
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const reviewData: ReviewSubmission = {
        productId,
        rating,
        comment: review.trim(),
      };

      await submitReview(reviewData);

      toast({
        title: "Review Submitted",
        description: "Thank you for your feedback!",
      });

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Submission Failed",
        description: "Unable to submit your review. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render helpers
  const renderStars = () => (
    <div className="flex items-center gap-1">
      {([1, 2, 3, 4, 5] as const).map((star) => (
        <button
          key={star}
          onClick={() => handleRatingChange(star)}
          className="focus:outline-none hover:scale-110 transition-transform"
          aria-label={`Rate ${star} stars`}
        >
          <Star
            className={cn(
              "w-8 h-8 transition-colors",
              star <= rating
                ? "fill-black text-black"
                : "text-gray-300 hover:text-gray-400"
            )}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogTrigger asChild>
        <Button 
          className="w-full"
        >
          Write a Review
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Write a Review
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {renderStars()}

          <Textarea
            placeholder="Share your experience with this product..."
            value={review}
            onChange={handleReviewChange}
            className="min-h-[120px]"
            maxLength={500}
          />

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">↻</span>
                Submitting...
              </span>
            ) : (
              "Submit Review"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

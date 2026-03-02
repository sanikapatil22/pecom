'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Package } from 'lucide-react';

type Props = {
  orderId: string;
  trackingId: string | undefined;
}

const TrackingIdForm = ({ orderId, trackingId }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTrackingId, setCurrentTrackingId] = useState(trackingId || '');

  async function updateTrackingId(formData: FormData) {
    const trackingId = formData.get('trackingId') as string;
    
    try {
      const response = await fetch('/api/orders/tracking', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, trackingId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update tracking ID');
      }

      setCurrentTrackingId(trackingId);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating tracking ID:', error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Package className="h-4 w-4" />
          {currentTrackingId ? `${currentTrackingId} Update Tracking ID` : 'Add Tracking ID'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentTrackingId ? `${currentTrackingId} Update Tracking ID` : 'Add Tracking ID'}
          </DialogTitle>
        </DialogHeader>
        <form action={updateTrackingId} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="trackingId"
              name="trackingId"
              placeholder="Enter tracking ID"
              defaultValue={currentTrackingId}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TrackingIdForm;
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
import { Calendar } from 'lucide-react';

type Props = {
  orderId: string;
  arrivalDate: string | undefined;
}

const ArrivalDateForm = ({ orderId, arrivalDate }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentArrivalDate, setCurrentArrivalDate] = useState(arrivalDate || '');

  async function updateArrivalDate(formData: FormData) {
    const arrivalDate = formData.get('arrivalDate') as string;
    
    try {
      const response = await fetch('/api/orders/arrival-date', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, arrivalDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to update arrival date');
      }

      setCurrentArrivalDate(arrivalDate);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating arrival date:', error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Calendar className="h-4 w-4" />
          {currentArrivalDate ? `Arrival: ${currentArrivalDate}` : 'Set Arrival Date'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentArrivalDate ? 'Update Arrival Date' : 'Set Arrival Date'}
          </DialogTitle>
        </DialogHeader>
        <form action={updateArrivalDate} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="arrivalDate"
              name="arrivalDate"
              placeholder="Enter expected arrival date"
              defaultValue={currentArrivalDate}
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

export default ArrivalDateForm;
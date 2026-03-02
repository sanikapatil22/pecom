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
import { Truck } from 'lucide-react';

type Props = {
  orderId: string;
  courierName: string | undefined;
}

const CourierNameForm = ({ orderId, courierName }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentCourierName, setCurrentCourierName] = useState(courierName || '');

  async function updateCourierName(formData: FormData) {
    const courierName = formData.get('courierName') as string;
    
    try {
      const response = await fetch('/api/orders/courier', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderId, courierName }),
      });

      if (!response.ok) {
        throw new Error('Failed to update courier name');
      }

      setCurrentCourierName(courierName);
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating courier name:', error);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Truck className="h-4 w-4" />
          {currentCourierName ? `Courier: ${currentCourierName}` : 'Set Courier Name'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {currentCourierName ? 'Update Courier Name' : 'Set Courier Name'}
          </DialogTitle>
        </DialogHeader>
        <form action={updateCourierName} className="space-y-4">
          <div className="space-y-2">
            <Input
              id="courierName"
              name="courierName"
              placeholder="Enter courier service name"
              defaultValue={currentCourierName}
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

export default CourierNameForm;
"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Ruler } from "lucide-react";
import { Category } from "@prisma/client";

interface SizeChartDialogProps {
    type: string;
}

// ... existing code ...

const sizeChartImages = {
    [Category.T_SHIRTS]: "/polo.webp",
    [Category.OVERSIZED_TSHIRTS]: "/oversized.webp",
    [Category.HOODIES]: "/boxy.webp",
    [Category.TANKS]: "/tank.webp",
    [Category.SHORTS]: "/joggers.webp",
    [Category.JEANS]: "/joggers.webp",
    [Category.OUTERWEAR]: "/polo.webp",
    [Category.JOGGERS]: "/joggers.webp",
    [Category.ACCESSORIES]: "/boxy.webp",
};

export default function SizeChartDialog({ type }: SizeChartDialogProps) {
    const imagePath = sizeChartImages[type as keyof typeof sizeChartImages] || "/size-charts/regular-fit.png"; // Default to regular fit if type not found

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="link" className="text-sm text-gray-500 h-auto p-0">
                    <Ruler className="w-4 h-4 mr-1" />
                    Size Guide
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">
                        Size Chart - {type}
                    </DialogTitle>
                </DialogHeader>
                <div className="relative h-[500px] w-full">
                    <Image
                        src={imagePath}
                        alt={`Size chart for ${type}`}
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}

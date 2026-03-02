"use client"
import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Badge } from '../ui/badge'
import { changeOrderStatus } from '@/app/actions'
import { OrderStatus } from '@prisma/client'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

type Props = {
    orderId: string
    defaultValue: OrderStatus
}

const OrderStateSelector = ({ orderId, defaultValue }: Props) => {
    const [orderState, setOrderState] = React.useState<OrderStatus>(defaultValue)
    const [isLoading, setIsLoading] = React.useState<boolean>(false)
    const { toast } = useToast()

    const handleOrderStateChange = async (newState: OrderStatus) => {
        setIsLoading(true)
        try {
            setIsLoading(true)
            const res = await changeOrderStatus(orderId, newState)
            if (res.success) {
                toast({
                    title: 'Order status changed',
                    description: `Order status changed to ${newState}`,
                })
            }
            else {
                console.log('Error changing order status:', res.error)
                toast({
                    title: 'Error changing order status',
                    description: res.error,
                })
            }
        } catch (error) {
            console.log('Error changing order status:', error)
            toast({
                title: 'Error changing order status',
                description: 'Something went wrong',
            })
        } finally {
            setIsLoading(false)
        }
    }

    if (isLoading) return (
        <div className="flex justify-center items-center w-fit">
            <Loader2 className="animate-spin h-5 w-5 text-blue-600" />
        </div>
    )

    return (
        <Select
            value={orderState}
            defaultValue={defaultValue}
            onValueChange={(newState: OrderStatus) => {
                setOrderState(newState);
                handleOrderStateChange(newState);
            }}
        >
            <SelectTrigger className="w-[140px]">
                <SelectValue>
                    <Badge variant={orderState === 'DELIVERED' ? 'default' : 'secondary'}>
                        {orderState}
                    </Badge>
                </SelectValue>
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="PENDING">
                    <Badge variant="secondary">PENDING</Badge>
                </SelectItem>
                <SelectItem value="PROCESSING">
                    <Badge variant="secondary">PROCESSING</Badge>
                </SelectItem>
                <SelectItem value="SHIPPED">
                    <Badge variant="secondary">SHIPPED</Badge>
                </SelectItem>
                <SelectItem value="DELIVERED">
                    <Badge variant="default">DELIVERED</Badge>
                </SelectItem>
                <SelectItem value="CANCELLED">
                    <Badge variant="destructive">CANCELLED</Badge>
                </SelectItem>
            </SelectContent>
        </Select>
    )
}

export default OrderStateSelector

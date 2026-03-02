import prisma from "@/app/lib/db"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import Link from "next/link"
import { unstable_noStore as noStore } from "next/cache"

async function getData() {
  const data = await prisma.coupon.findMany({
    orderBy: {
      createdAt: "desc",
    },
  })
  return data
}

export default async function HomeContentRoute() {
  noStore()
  const data = await getData()
  return (
    <>
      <div className="flex items-center justify-end">
        <Button asChild className="flex items-center gap-x-2 active:scale-95 transition-all duration-200">
          <Link href="/dashboard/coupons/create">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Coupons</span>
          </Link>
        </Button>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Coupon Codes</CardTitle>
          <CardDescription>Manage your Coupon Codes/Discount code content here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Coupon Code</TableHead>
                <TableHead className="text-center">Discount percentage</TableHead>
                <TableHead className="text-center">Active</TableHead>
                <TableHead className="text-center">Total Revenue</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="text-center">{item.code}</TableCell>
                  <TableCell className="text-center">{item.discount}</TableCell>
                  <TableCell className="text-center">{item.isValid ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-center">{item.totalRevenue}</TableCell>
                  <TableCell className="text-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/coupons/${item.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/coupons/${item.id}/delete`}>Delete</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  )
}

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
  const data = await prisma.homePageContent.findMany({
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
          <Link href="/dashboard/home/create">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Content</span>
          </Link>
        </Button>
      </div>
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>Home Content</CardTitle>
          <CardDescription>Manage your Homepage content here.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Large Heading</TableHead>
                <TableHead>Small Heading</TableHead>
                <TableHead>Tagline</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Card Title</TableHead>
                <TableHead>Card Description</TableHead>
                <TableHead>Active</TableHead>
                <TableHead className="text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.headingLarge}</TableCell>
                  <TableCell>{item.headingSmall}</TableCell>
                  <TableCell>{item.tagline}</TableCell>
                  <TableCell>{item.description?.substring(0, 50)}...</TableCell>
                  <TableCell>{item.cardTitle}</TableCell>
                  <TableCell>{item.cardDescription?.substring(0, 50)}...</TableCell>
                  <TableCell>{item.isActive ? "Yes" : "No"}</TableCell>
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
                          <Link href={`/dashboard/home/${item.id}`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/home/${item.id}/delete`}>Delete</Link>
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



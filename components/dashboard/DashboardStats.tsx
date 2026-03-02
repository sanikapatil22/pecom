import prisma from "@/app/lib/db";
import { DollarSign, ShoppingBag, Package, Users } from "lucide-react";

async function getData() {
  const [user, products, order] = await Promise.all([
    prisma.user.findMany({
      select: { id: true },
    }),
    prisma.product.findMany({
      select: { id: true },
    }),
    prisma.order.findMany({
      select: { amount: true },
    }),
  ]);

  return { user, products, order };
}

export async function DashboardStats() {
  const { products, user, order } = await getData();

  const totalAmount = order.reduce((acc, curr) => acc + curr.amount, 0);

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${new Intl.NumberFormat("en-IN").format(totalAmount)}`,
      icon: DollarSign,
      description: "Lifetime revenue",
    },
    {
      label: "Total Sales",
      value: `${order.length}`,
      icon: ShoppingBag,
      description: "Orders placed",
    },
    {
      label: "Products",
      value: `${products.length}`,
      icon: Package,
      description: "Active listings",
    },
    {
      label: "Users",
      value: `${user.length}`,
      icon: Users,
      description: "Registered accounts",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-white border border-neutral-200 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs uppercase tracking-[0.1em] text-neutral-500 font-medium">
                {stat.label}
              </span>
              <div className="w-8 h-8 bg-neutral-100 flex items-center justify-center">
                <Icon className="w-4 h-4 text-neutral-600" />
              </div>
            </div>
            <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
            <p className="text-xs text-neutral-400 mt-1">{stat.description}</p>
          </div>
        );
      })}
    </div>
  );
}

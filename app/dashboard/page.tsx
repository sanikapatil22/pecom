import { DashboardStats } from "../../components/dashboard/DashboardStats";
import { RecentSales } from "../../components/dashboard/RecentSales";
import { Chart } from "../../components/dashboard/Chart";
import prisma from "../lib/db";
import { unstable_noStore as noStore } from "next/cache";

async function getData() {
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const data = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: sevenDaysAgo,
      },
    },
    select: {
      amount: true,
      createdAt: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const result = data.map((item) => ({
    date: new Intl.DateTimeFormat("en-US").format(item.createdAt),
    revenue: item.amount / 100,
  }));

  return result;
}

export default async function Dashboard() {
  noStore();
  const data = await getData();
  return (
    <div>
      <h1 className="text-xl font-bold uppercase tracking-[0.05em] mb-6">Dashboard</h1>

      <DashboardStats />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 mt-8">
        {/* Chart */}
        <div className="xl:col-span-2 bg-white border border-neutral-200">
          <div className="px-5 py-4 border-b border-neutral-200">
            <h3 className="text-sm font-semibold uppercase tracking-[0.05em]">
              Transactions
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">Last 7 days</p>
          </div>
          <div className="p-5">
            <Chart data={data} />
          </div>
        </div>

        {/* Recent Sales */}
        <RecentSales />
      </div>
    </div>
  );
}

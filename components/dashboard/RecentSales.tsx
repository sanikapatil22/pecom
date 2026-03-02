import prisma from "@/app/lib/db";

async function getData() {
  const data = await prisma.order.findMany({
    select: {
      amount: true,
      id: true,
      createdAt: true,
      user: {
        select: {
          firstName: true,
          profileImage: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 7,
  });

  return data;
}

export async function RecentSales() {
  const data = await getData();
  return (
    <div className="bg-white border border-neutral-200">
      <div className="px-5 py-4 border-b border-neutral-200">
        <h3 className="text-sm font-semibold uppercase tracking-[0.05em]">Recent Sales</h3>
      </div>
      <div className="divide-y divide-neutral-100">
        {data.map((item) => (
          <div className="flex items-center gap-4 px-5 py-3.5" key={item.id}>
            <div className="w-8 h-8 bg-neutral-100 flex items-center justify-center text-xs font-medium uppercase shrink-0">
              {item.user?.firstName?.slice(0, 2) || "??"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {item.user?.firstName || "Unknown"}
              </p>
              <p className="text-xs text-neutral-400 truncate">
                {item.user?.email}
              </p>
            </div>
            <p className="text-sm font-semibold whitespace-nowrap">
              ₹{new Intl.NumberFormat("en-IN").format(item.amount)}
            </p>
          </div>
        ))}
        {data.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-neutral-400">
            No recent sales
          </div>
        )}
      </div>
    </div>
  );
}

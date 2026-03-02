import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import EditHomePageContent from "@/components/dashboard/EditHomePageContent";

async function getData(HomePageContentId: string) {
  const data = await prisma.homePageContent.findUnique({
    where: {
      id: HomePageContentId,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function EditRoute({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);


  return <EditHomePageContent data={data} />;
}


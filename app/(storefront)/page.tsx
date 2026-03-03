import { Category } from "@prisma/client";
import CategoriesSelection from "../../components/storefront/CategorySelection";
import Hero from "../../components/storefront/Hero";
import GenderTabs from "../../components/storefront/GenderTabs";
import prisma from "../lib/db";

const getData = async () => {
  const categoriesWithProducts = await Promise.all(
    Object.values(Category).map(async (category) => {
      const product = await prisma.product.findFirst({
        where: {
          category,
          isFeatured: true,
          status: "PUBLISHED",
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return {
        category,
        product,
      };
    })
  );

  return categoriesWithProducts.filter(
    (item): item is {
      category: Category;
      product: NonNullable<typeof item.product>;
    } => item.product !== null
  );
};

const getMainPageContent = async () => {
  const data = await prisma.homePageContent.findFirst({
    where: {
      isActive: true,
    },
  });

  return data;
};

const getAllData = async () => {
  const [categoriesData, mainPageContent, menProducts, womenProducts] =
    await Promise.all([
      getData(),
      getMainPageContent(),
      prisma.product.findMany({
        where: {
          gender: "MEN",
          status: "PUBLISHED",
        },
        select: {
          id: true,
          name: true,
          images: true,
          finalPrice: true,
          originalPrice: true,
          variants: {
            select: {
              color: true,
            },
            distinct: ["color"],
          },
        },
        take: 16,
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.findMany({
        where: {
          gender: "WOMEN",
          status: "PUBLISHED",
        },
        select: {
          id: true,
          name: true,
          images: true,
          finalPrice: true,
          originalPrice: true,
          variants: {
            select: {
              color: true,
            },
            distinct: ["color"],
          },
        },
        take: 16,
        orderBy: {
          createdAt: "desc",
        },
      }).then(async (women) => {
        // Fallback: if no women products, show all published products
        if (women.length > 0) return women;
        return prisma.product.findMany({
          where: { status: "PUBLISHED" },
          select: {
            id: true,
            name: true,
            images: true,
            finalPrice: true,
            originalPrice: true,
            variants: {
              select: { color: true },
              distinct: ["color"],
            },
          },
          take: 16,
          orderBy: { createdAt: "desc" },
        });
      }),
    ]);

  return {
    categoriesData,
    mainPageContent,
    menProducts,
    womenProducts,
  };
};

const defaultData = {
  headingLarge: "WINTER",
  headingSmall: "GEAR",
  tagline: "CONQUER THE COLD",
  description:
    "Gear built to help you push through the cold without holding back. Engineered for peak performance in extreme conditions.",
  cardTitle: "New Collection",
  cardDescription: "Winter 2025",
  id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
};

export default async function Page() {
  const { categoriesData, mainPageContent, menProducts, womenProducts } =
    await getAllData();

  return (
    <div className="-mt-[136px]">
      <Hero data={mainPageContent ?? defaultData} />

      {/* FOR HIM / FOR HER Tabs */}
      <GenderTabs menProducts={menProducts} womenProducts={womenProducts} />

      {/* Category Carousel */}
      <CategoriesSelection featuredProducts={categoriesData} />
    </div>
  );
}

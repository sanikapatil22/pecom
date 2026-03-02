import { Category } from "@prisma/client";
import CategoriesSelection from "../../components/storefront/CategorySelection";
import { FeaturedProducts } from "../../components/storefront/FeaturedProducts";
import Hero from "../../components/storefront/Hero";
import GenderTabs from "../../components/storefront/GenderTabs";
import prisma from "../lib/db";
import { ProductCard1 } from "@/components/storefront/product-card";

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
  const [categoriesData, mainPageContent, bestSellerContent, menProducts, womenProducts] =
    await Promise.all([
      getData(),
      getMainPageContent(),
      prisma.product.findMany({
        where: {
          isFeatured: true,
        },
        include: {
          reviews: true,
          variants: true,
        },
        take: 10,
        orderBy: {
          createdAt: "desc",
        },
      }),
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
    bestSellerContent,
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
  const { categoriesData, mainPageContent, bestSellerContent, menProducts, womenProducts } =
    await getAllData();

  return (
    <div className="-mt-24">
      <Hero data={mainPageContent ?? defaultData} />

      {/* FOR HIM / FOR HER Tabs */}
      <GenderTabs menProducts={menProducts} womenProducts={womenProducts} />

      {/* Category Carousel */}
      <CategoriesSelection featuredProducts={categoriesData} />

      {/* Best Sellers Grid */}
      <section className="section-padding">
        <h2 className="section-heading mb-10">Best Sellers</h2>
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
          {bestSellerContent.map((product) => (
            <ProductCard1
              key={product.id}
              id={product.id}
              imageUrl={product.images[0]}
              originalPrice={product.originalPrice}
              price={product.finalPrice}
              tagline={product.headline}
              rating={
                product.reviews.length > 0
                  ? product.reviews.reduce((sum, review) => sum + review.rating, 0) /
                    product.reviews.length
                  : 0
              }
              reviews={product.reviews.length}
              title={product.name}
            />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <FeaturedProducts />
    </div>
  );
}

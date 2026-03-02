import { Category } from "@prisma/client";
import CategoriesSelection from "../../components/storefront/CategorySelection";
import { FeaturedProducts } from "../../components/storefront/FeaturedProducts";
import Hero from "../../components/storefront/Hero";
import prisma from "../lib/db";
import { ProductCard } from "@/components/storefront/ProductCard";
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

// Combined function to fetch all data in parallel
const getAllData = async () => {
  const [categoriesData, mainPageContent, bestSellerContent] = await Promise.all([
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
        createdAt: 'desc'
      }
    }),
  ]);

  return {
    categoriesData,
    mainPageContent,
    bestSellerContent
  };
};


const defaultData = {
  headingLarge: "WINTER",
  headingSmall: "GEAR",
  tagline: "CONQUER THE COLD",
  description: "Gear built to help you push through the cold without holding back. Engineered for peak performance in extreme conditions.",
  cardTitle: "New Collection",
  cardDescription: "Winter 2025",
  id: "",
  createdAt: new Date(),
  updatedAt: new Date(),
  isActive: true,
}


export default async function Page() {
  const { categoriesData, mainPageContent, bestSellerContent } = await getAllData();

  return (
    <div>
      <Hero data={mainPageContent ?? defaultData} />
      <div className="my-10 grid md:grid-cols-5 grid-cols-2 gap-4">
        {bestSellerContent.map((product) => (
          <ProductCard1
            id={product.id}
            imageUrl={product.images[0]}
            originalPrice={product.originalPrice}
            price={product.finalPrice}
            tagline={product.headline}
            rating={
              product.reviews.length > 0
                ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                : 0 // Default rating if there are no reviews
            }
            reviews={product.reviews.length}
            title={product.name}
          />
        ))}
      </div>
      <CategoriesSelection featuredProducts={categoriesData} />
      <section className="py-8 lg:py-12 px-4 lg:px-0">
      </section>
      <FeaturedProducts />
    </div>
  );
}

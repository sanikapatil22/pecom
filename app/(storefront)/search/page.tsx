import Search from "@/components/Search";
import { ProductCard1 } from "@/components/storefront/product-card";
import prisma from "@/app/lib/db";

async function getProducts() {
    const products = await prisma.product.findMany({
        where: {
            status: "PUBLISHED",
        },
        include: {
            reviews: true,
        },
    });

    return products;
}

export default async function SearchPage() {
    const products = await getProducts();

    return (
        <div className="container mx-auto px-4 py-16 mt-24">
            <div className="mb-8">
                <Search />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard1
                        key={product.id}
                        id={product.id}
                        title={product.name}
                        price={product.finalPrice}
                        originalPrice={product.originalPrice}
                        rating={
                            product.reviews.length > 0
                                ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
                                : 0 // Default rating if there are no reviews
                        }
                        reviews={product.reviews.length}
                        imageUrl={product.images}
                        isBestSeller={product.isBestSeller}
                        tagline={product.description}
                    />
                ))}
            </div>
        </div>
    );
}
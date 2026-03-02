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
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-8">
            <div className="mb-10">
                <h1 className="text-xl md:text-2xl font-medium uppercase tracking-[0.1em] mb-6">Search</h1>
                <Search />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
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
                                : 0
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

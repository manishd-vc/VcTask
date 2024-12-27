import { productsData } from "@/data/common/products";
import ProductCard from "./product-card";
import SectionTitle from "./common/section-title";
console.log("productsData", productsData);

export default function ProductsSection() {
  return (
    <section className="products-section xl:py-24 lg:py-20 md:py-16 sm:py-12 py-8 relative overflow-hidden">
      <div className="container w-full lg:max-w-full">
        <SectionTitle text="Products" className="text-center" />
        <div className="grid 2xl:grid-cols-6 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 xl:gap-6 gap-4 w-full sm:pt-10">
          {productsData?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

import ProductDetailsSection from "@/components/product-details-section";

export default function ProductDetails({ params }) {
  const { "product-id": productId } = params;

  return <ProductDetailsSection productId={productId} />;
}

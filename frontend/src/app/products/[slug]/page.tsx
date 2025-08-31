import { getProductBySlug } from "@/myapi/productSingle";
import ProductContent from "./ProductContent";
import { SingleProduct } from "@/myapi/productData";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="p-6 text-center text-gray-500">Product not found</div>
    );
  }

  return <ProductContent product={product as SingleProduct} />;
}

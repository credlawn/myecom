import { getProductBySlug } from "@/myapi/productSingle";
import ProductContent from "./ProductContent";
import { SingleProduct } from "@/myapi/apiData/productData";
import { getSettings, Settings } from "@/myapi/apiData/settings";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  const settings: Settings = await getSettings();

  if (!product) {
    return (
      <div className="p-6 text-center text-gray-500">Product not found</div>
    );
  }

  return <ProductContent product={product as SingleProduct} settings={settings} />;
}
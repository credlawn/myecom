import axios from "axios";
import { SingleProduct } from "@/myapi/apiData/productData";
import { api, img } from "./apiPath";

export async function getProductBySlug(
  slug: string,
): Promise<SingleProduct | null> {
  try {
    const { data } = await axios.get<{ message: { data: SingleProduct } }>(
      api.PS, { params: { slug }, withCredentials: true },
    );

    if (!data?.message?.data) {
      return null;
    }

    const product = data.message.data;

    return {
      ...product,
      product_image_1: img(product.product_image_1),
      product_images: product.product_images
        ? product.product_images.map((p) => img(p))
        : [],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch product");
    }
    throw error;
  }
}

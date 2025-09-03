import axios from "axios";
import { SingleProduct } from "@/myapi/productData";

const DOMAIN = process.env.DOMAIN;
const BASE_URL = `${DOMAIN}/api/method/myecom.api`;

export async function getProductBySlug(
  slug: string,
): Promise<SingleProduct | null> {
  try {
    const { data } = await axios.get<{ message: { data: SingleProduct } }>(
      `${BASE_URL}.single_product.get_product_by_slug`,
      {
        params: { slug },
        withCredentials: true,
      },
    );

    if (!data?.message?.data) {
      return null;
    }

    const product = data.message.data;

    return {
      ...product,
      product_image_1: product.product_image_1
        ? product.product_image_1.startsWith("http")
          ? product.product_image_1
          : `${DOMAIN}${product.product_image_1}`
        : null,
      product_images: product.product_images
        ? product.product_images.map((img) =>
            img.startsWith("http") ? img : `${DOMAIN}${img}`,
          )
        : [],
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
    throw error;
  }
}

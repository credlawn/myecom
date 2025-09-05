import axios from "axios";
import { api, img } from "./apiPath";

export interface ProductItem {
  name: string;
  product_name: string;
  brand_name: string | null;
  unit: string | null;
  min_purchase_qty: number;
  discount_type: string | null;
  discount_percent: number;
  discount_amount: number;
  price: number;
  discounted_price: number;
  stock: number;
  product_slug: string;
  product_image_1: string | null;
  product_image_2: string | null;
  product_tag: string | null;
  product_rating: number;
  rating_count: number;
  product_category: string[];
  nd_text: string | null;
  featured: number;
}

export async function getProductList(): Promise<ProductItem[]> {
  try {
    const { data } = await axios.get<{ message: { messages: ProductItem[] } }>(
      api.PL, { withCredentials: true },
    );

    return (data.message?.messages || []).map((item) => ({
      ...item,
      product_image_1: item.product_image_1 ? img(item.product_image_1) : null,
      product_image_2: item.product_image_2 ? img(item.product_image_2) : null,
    }));

  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product list');
    }
    throw error;
  }
}

import axios from "axios";

const DOMAIN = process.env.DOMAIN;
const BASE_URL = `${DOMAIN}/api/method/myecom.api`;

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
      `${BASE_URL}.product_list.get_product_list`,
      { withCredentials: true },
    );

    return (data.message?.messages || []).map((item) => ({
      ...item,
      product_image_1: item.product_image_1
        ? item.product_image_1.startsWith("http")
          ? item.product_image_1
          : `${DOMAIN}${item.product_image_1}`
        : null,
      product_image_2: item.product_image_2
        ? item.product_image_2.startsWith("http")
          ? item.product_image_2
          : `${DOMAIN}${item.product_image_2}`
        : null,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

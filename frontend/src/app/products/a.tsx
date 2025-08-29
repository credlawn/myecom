export interface SingleProduct {
  id: string;
  product_name: string;
  brand_name: string | null;
  price: number;
  discounted_price: number;
  discount_type: string | null;
  discount_percent: number;
  discount_amount: number;
  stock: number;
  min_purchase_qty: number;
  product_rating: number;
  rating_count: number;
  product_slug: string;
  product_image_1: string | null;
  product_image_2: string | null;
  product_image_3: string | null;
  product_image_4: string | null;
  product_image_5: string | null;
  product_tag: string | null;
  description: string | null;
  unit: string | null;
  featured: number;
  categories: { id: string; name: string }[];
  currency: string;
}

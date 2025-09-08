import axios from 'axios';
import { getCookie } from 'cookies-next';
import { api } from '@/myapi/apiPath';

export interface CartItem {
  product: string;
  product_name: string;
  price: number;
  product_image: string;
  second_image: string;
  qty: number;
  slug: string;
  added_on?: string;
}

export interface CartResponse {
  success: boolean;
  message: string;
  count: number;
  items: CartItem[];
}

export interface CartActionResponse {
  success: boolean;
  message: string;
  count: number;
}

interface CartBackendItem {
  product: string;
  product_name: string;
  price: number;
  product_image: string;
  second_image: string;
  qty: number;
  slug: string;
  added_on?: string;
}

interface CartBackendResponse {
  message?: { items: CartBackendItem[]; count?: number };
  data?: { items: CartBackendItem[] };
  success?: boolean;
}

class ShoppingCartAPI {
  private getConfig() {
    const visitorId = getCookie("visitor_id");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (visitorId && (!getCookie("sid") && !getCookie("session_id"))) {
      headers["X-Visitor-Id"] = visitorId as string;
      return { headers, withCredentials: false };
    }

    return { headers, withCredentials: true };
  }

  async addToCart(productId: string, qty: number): Promise<CartActionResponse> {
    const response = await axios.post(api.AC,
      { product_id: productId, qty },
      this.getConfig()
    );
    return response.data;
  }

  async removeFromCart(productId: string): Promise<CartActionResponse> {
    const response = await axios.post(
      api.RC,
      { product_id: productId },
      this.getConfig()
    );
    return response.data;
  }

  async updateQuantity(
    productId: string,
    qty: number
  ): Promise<CartActionResponse> {
    const response = await axios.post(
      api.UQ,
      { product_id: productId, qty },
      this.getConfig()
    );
    return response.data;
  }

  async getCartItems(): Promise<CartItem[]> {
    const response = await axios.get<CartBackendResponse>(
      api.GC,
      this.getConfig()
    );

    const items = Array.isArray(response.data.message?.items)
      ? response.data.message.items
      : Array.isArray(response.data.data?.items)
      ? response.data.data.items
      : [];

    return items.map((item) => ({
      product: item.product,
      product_name: item.product_name,
      price: item.price,
      product_image: item.product_image,
      second_image: item.second_image,
      qty: item.qty,
      added_on: item.added_on,
      slug: item.slug || "",
    }));
  }

  async clearCart(): Promise<CartActionResponse> {
    const response = await axios.post<CartActionResponse>(
      api.CC,
      {},
      this.getConfig()
    );
    return response.data;
  }
}

export const shoppingCartAPI = new ShoppingCartAPI();
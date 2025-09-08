import axios from 'axios';
import { getCookie } from 'cookies-next';
import { api } from '@/myapi/apiPath';

export interface WishlistItem {
  product: string;
  product_name: string;
  price: number;
  product_image: string;
  second_image: string;
  added_on: string;
  slug: string;
}

export interface WishlistResponse {
  success: boolean;
  message: string;
  count: number;
  items: WishlistItem[];
}

export interface WishlistActionResponse {
  success: boolean;
  message: string;
  count: number;
}

interface WishlistBackendItem {
  product: string;
  product_name: string;
  price: number;
  product_image: string;
  second_image: string;
  added_on: string;
  slug: string;
}

interface WishlistBackendResponse {
  message?: { items: WishlistBackendItem[]; count?: number };
  data?: { items: WishlistBackendItem[] };
  success?: boolean;
}

class WishlistAPI {
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

  async addToWishlist(itemCode: string): Promise<WishlistActionResponse> {
    const response = await axios.post(api.AW,
      { product_id: itemCode },
      this.getConfig()
    );
    return response.data;
  }

  async removeFromWishlist(itemCode: string): Promise<WishlistActionResponse> {
    const response = await axios.post(api.RW,
      { product_id: itemCode },
      this.getConfig()
    );
    return response.data;
  }

  async isInWishlist(itemCode: string): Promise<boolean> {
    const response = await axios.get<{ message: { in_wishlist: boolean } }>(api.IW,
      { params: { product_id: itemCode }, ...this.getConfig() }
    );
    return response.data.message.in_wishlist;
  }

  async getWishlistItems(): Promise<WishlistItem[]> {
    const response = await axios.get<WishlistBackendResponse>(
      api.WL, this.getConfig()
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
      added_on: item.added_on,
      slug: item.slug || '',
    }));
  }

  async clearWishlist(): Promise<WishlistActionResponse> {
    const response = await axios.post<WishlistActionResponse>(
      api.CW, {}, this.getConfig()
    );
    return response.data;
  }
}

export const wishlistAPI = new WishlistAPI();
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { api } from './apiPath';

export interface CartItem {
  product: string;
  product_name: string;
  price: number;
  product_image: string;
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
  qty: number;
  slug: string;
}

interface CartBackendResponse {
  message?: { items: CartBackendItem[]; count?: number };
  data?: { items: CartBackendItem[] };
  success?: boolean;
}

class ShoppingCartAPI {
  private getHeaders() {
    const visitorId = getCookie('visitor_id');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (visitorId) {
      headers['X-Visitor-Id'] = visitorId as string;
    }

    const authToken = getCookie('auth_token');
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return headers;
  }

  async addToCart(productId: string, qty: number): Promise<CartActionResponse> {
    const response = await axios.post(api.AC,
      { product_id: productId, qty },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async removeFromCart(productId: string): Promise<CartActionResponse> {
    const response = await axios.post(api.RC,
      { product_id: productId },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async updateQuantity(productId: string, qty: number): Promise<CartActionResponse> {
    const response = await axios.post(api.UQ,
      { product_id: productId, qty },
      { headers: this.getHeaders() }
    );
    return response.data;
  }

  async getCartItems(): Promise<CartItem[]> {
    const response = await axios.get<CartBackendResponse>(
      api.GC, { headers: this.getHeaders() }
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
      qty: item.qty,
      added_on: (item as CartBackendItem & { added_on?: string }).added_on, 
      slug: item.slug || '',
    }));
  }

  async clearCart(): Promise<CartActionResponse> {
    const response = await axios.post<CartActionResponse>(
      api.CC, {}, { headers: this.getHeaders() }
    );
    return response.data;
  }
}

export const shoppingCartAPI = new ShoppingCartAPI();

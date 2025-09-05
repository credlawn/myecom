import axios from "axios";
import { api, img } from "./apiPath"

export interface CategoryList {
  category: string;
  parent_category: string;
  sequence: number;
  category_image: string;
  banner: string;
}

export async function getCategoryList(): Promise<CategoryList[]> {
  try {
    const { data } = await axios.get(api.CL, { withCredentials: true },);
    return (data.message?.messages || []).map((item: CategoryList) => ({
      ...item,
      category_image: item.banner ? img(item.banner) : "images/placeholder.jpg",
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category list');
    }
    throw error;
  }
}

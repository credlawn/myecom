import axios from "axios";

const DOMAIN = process.env.DOMAIN;
const BASE_URL = `${DOMAIN}/api/method/myecom.api`;

export interface CategoryList {
  category: string;
  parent_category: string;
  sequence: number;
  category_image: string;
  banner: string;
}

export async function getCategoryList(): Promise<CategoryList[]> {
  try {
    const { data } = await axios.get(
      `${BASE_URL}.category_list.get_category_list`,
      { withCredentials: true },
    );
    return (data.message?.messages || []).map((item: CategoryList) => ({
      ...item,
      category_image: item.banner
        ? `${DOMAIN}${item.banner}`
        : "images/placeholder.jpg",
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category list');
    }
    throw error;
  }
}

import axios from "axios";

const DOMAIN = process.env.DOMAIN;
const BASE_URL = `${DOMAIN}/api/method/myecom.api`;

export interface MenuItem {
  menu_name: string;
  parent_id?: number;
  child_id?: number;
  parent_name?: string;
  menu_type: "Parent" | "Child";
  slug: string;
}

export interface MenuResponse {
  parent: MenuItem;
  children: MenuItem[];
}

export async function getMenuList(): Promise<MenuResponse[]> {
  try {
    const response = await axios.get(`${BASE_URL}.menu_list.get_menu_list`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data.message?.menu || [];
  } catch (error) {
    console.error("Error fetching menu:", error);
    return [];
  }
}

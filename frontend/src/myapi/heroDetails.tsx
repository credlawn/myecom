import axios from "axios";
import { api, img } from "./apiPath"

export interface HeroItem {
  hero_title: string;
  hero_subtitle: string;
  price_text: string;
  price: string;
  hero_image: string;
  image_alt: string;
  hero_url: string;
  button_text: string;
}

export async function getHeroDetails(): Promise<HeroItem[]> {
  try {
    const { data } = await axios.get(api.HD, { withCredentials: true }, );

    return (data.message?.messages || []).map((item: HeroItem) => ({
      ...item,

      hero_image: item.hero_image ? img(item.hero_image) : "images/placeholder.jpg",
      hero_url: item.hero_url ? item.hero_url : img(),
    }));

  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch hero details');
    }
    throw error;
  }
}

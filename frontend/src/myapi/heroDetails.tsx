import axios from "axios";

const DOMAIN = process.env.DOMAIN;
const BASE_URL = `${DOMAIN}/api/method/myecom.api`;

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
    const { data } = await axios.get(
      `${BASE_URL}.hero_section.get_hero_details`,
      { withCredentials: true },
    );
    return (data.message?.messages || []).map((item: HeroItem) => ({
      ...item,
      hero_image: item.hero_image
        ? `${DOMAIN}${item.hero_image}`
        : "images/placeholder.jpg",

      hero_url: item.hero_url ? item.hero_url : `${DOMAIN}`,
    }));
  } catch (err) {
    console.error(err);
    return [];
  }
}

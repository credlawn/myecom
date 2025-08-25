import { getSiteSettings } from "./siteSettings";
import { getBannerMessages } from "./bannerMessages";
import { getMenuList } from "./menuList";
import { getHeroDetails, HeroItem } from "./heroDetails";
import { MenuResponse } from "./menuList";

export interface Settings {
  showBanner: number;
  showMobileLogo: number;
  autoSlideHero: number;
  url: string;
  logo_url: string;
  bannerMessages: string[];
  menuData: MenuResponse[];
  heroData: HeroItem[];
}

export async function getSettings(): Promise<Settings> {
  const [settingsResponse, bannerMessages, menuData, heroData] =
    await Promise.all([
      getSiteSettings(),
      getBannerMessages(),
      getMenuList(),
      getHeroDetails(),
    ]);

  return {
    showBanner: settingsResponse?.show_top_banner ?? 1,
    showMobileLogo: settingsResponse?.show_mobile_logo ?? 1,
    autoSlideHero: settingsResponse?.auto_slide_hero ?? 1,
    url: settingsResponse?.banner_url ?? "#",
    logo_url: settingsResponse?.logo_url ?? "",
    bannerMessages: bannerMessages,
    menuData: menuData,
    heroData: heroData.map((item) => ({
      ...item,
      hero_image: item.hero_image,
      hero_url: item.hero_url,
    })),
  };
}

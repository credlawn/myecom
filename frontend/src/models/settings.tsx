import { getSiteSettings } from "./siteSettings";
import { getBannerMessages } from "./bannerMessages";
import { getMenuList } from "./menuList";
import { getHeroDetails, HeroItem } from "./heroDetails";
import { MenuResponse } from "./menuList";
import { getCategoryList, CategoryList } from "./categoryList";
import { getProductList, ProductItem } from "./productList";

export interface Settings {
  showBanner: number;
  showMobileLogo: number;
  autoSlideHero: number;
  url: string;
  logo_url: string;
  currency: string;
  cardSize: number;
  mobileCardSize: number;
  tabCardSize: number;
  imageSize: number;
  mobileImageSize: number;
  tabImageSize: number;
  cardBg: string;
  imageBg: string;
  textColor: string;
  bannerMessages: string[];
  menuData: MenuResponse[];
  heroData: HeroItem[];
  categoryData: CategoryList[];
  productList: ProductItem[];
}

export async function getSettings(): Promise<Settings> {
  const [
    settingsResponse,
    bannerMessages,
    menuData,
    heroData,
    categoryData,
    productList,
  ] = await Promise.all([
    getSiteSettings(),
    getBannerMessages(),
    getMenuList(),
    getHeroDetails(),
    getCategoryList(),
    getProductList(),
  ]);

  return {
    showBanner: settingsResponse?.show_top_banner ?? 1,
    currency: settingsResponse?.currency ?? "₹",
    showMobileLogo: settingsResponse?.show_mobile_logo ?? 1,
    autoSlideHero: settingsResponse?.auto_slide_hero ?? 1,
    url: settingsResponse?.banner_url ?? "#",
    logo_url: settingsResponse?.logo_url ?? "",
    cardSize: settingsResponse?.card_size ?? 72,
    mobileCardSize: settingsResponse?.mobile_card_size ?? 72,
    tabCardSize: settingsResponse?.tab_card_size ?? 72,
    imageSize: settingsResponse?.image_size ?? 56,
    mobileImageSize: settingsResponse?.mobile_image_size ?? 56,
    tabImageSize: settingsResponse?.tab_image_size ?? 56,
    cardBg: settingsResponse?.card_bg ?? "white",
    imageBg: settingsResponse?.image_bg ?? "transparent",
    textColor: settingsResponse?.text_color ?? "black",
    bannerMessages: bannerMessages,
    menuData: menuData,
    heroData: heroData,
    categoryData: categoryData,
    productList: productList,
  };
}

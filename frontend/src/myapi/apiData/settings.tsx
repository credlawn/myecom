import { getSiteSettings } from "../siteSettings";
import { getBannerMessages } from "../bannerMessages";
import { getMenuList } from "../menuList";
import { getHeroDetails, HeroItem } from "../heroDetails";
import { MenuResponse } from "../menuList";
import { getCategoryList, CategoryList } from "../categoryList";
import { getProductList, ProductItem } from "../productList";

export interface Settings {
  showBanner: number;
  showMobileLogo: number;
  autoSlideHero: number;
  visitorTracking: number;
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
  priColor: string;
  secColor: string;
  thiColor: string;
  btn1Color: string;
  btn2Color: string;
  btn3Color: string;
  bt1Color: string;
  bt2Color: string;
  bt3Color: string;
  starColorPage: string;
  starColorCard: string;
  banAnimation: string;
  background: string;
  boxShadowColor: string;
  heightMobile: string;
  heightDesktop: string;

  fontWeightMobile: number;
  fontWeightDesktop: number;
  fontSizeMobile: number;
  fontSizeDesktop: number;
  fontColorMobile: string;
  fontColorDesktop: string;

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
    visitorTracking: settingsResponse?.visitor_tracking ?? 0,
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
    priColor: settingsResponse?.primary_color ?? "red-500",
    secColor: settingsResponse?.secondary_color ?? "natural-900",
    thiColor: settingsResponse?.third_color ?? "red-500",
    btn1Color: settingsResponse?.button_1_color ?? "red-500",
    btn2Color: settingsResponse?.button_2_color ?? "green-600",
    btn3Color: settingsResponse?.button_3_color ?? "blue-500",
    bt1Color: settingsResponse?.bt_1_color ?? "natural-900",
    bt2Color: settingsResponse?.bt_2_color ?? "white",
    bt3Color: settingsResponse?.bt_3_color ?? "blue",
    starColorPage: settingsResponse?.star_color_2 ?? "#f51818",
    starColorCard: settingsResponse?.star_color_1 ?? "#f51818",
    background: settingsResponse?.bg_color ?? "black",
    boxShadowColor: settingsResponse?.bg_shadow_color ?? "black",
    banAnimation: settingsResponse?.banner_animation ?? "zoom",
    heightMobile: settingsResponse?.mob_height ?? "h-8",
    heightDesktop: settingsResponse?.lap_height ?? "h-9",
    fontWeightMobile: settingsResponse?.mob_ft_weight ?? 500,
    fontWeightDesktop: settingsResponse?.lap_ft_weight ?? 600,
    fontSizeMobile: settingsResponse?.mob_ft_size ?? 14,
    fontSizeDesktop: settingsResponse?.lap_ft_size ?? 16,
    fontColorMobile: settingsResponse?.mob_font_color ?? "white",
    fontColorDesktop: settingsResponse?.lap_font_color ?? "white",

    bannerMessages: bannerMessages,
    menuData: menuData,
    heroData: heroData,
    categoryData: categoryData,
    productList: productList,
  };
}

import {
  getSiteSettings,
  getBannerMessages,
  getMenuList,
  MenuResponse,
} from "./api";

export interface Settings {
  showBanner: number;
  showMobileLogo: number;
  url: string;
  logo_url: string;
  bannerMessages: string[];
  menuData: MenuResponse[];
}

export async function getSettings(): Promise<Settings> {
  const [settingsResponse, bannerMessages, menuData] = await Promise.all([
    getSiteSettings(),
    getBannerMessages(),
    getMenuList(),
  ]);

  return {
    showBanner: settingsResponse?.show_top_banner ?? 1,
    showMobileLogo: settingsResponse?.show_mobile_logo ?? 1,
    url: settingsResponse?.banner_url ?? "#",
    logo_url: settingsResponse?.logo_url ?? "",
    bannerMessages: bannerMessages,
    menuData: menuData,
  };
}

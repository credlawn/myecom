import { getSiteSettings, getBannerMessages } from './api';

export interface Settings {
  showBanner: number;
  showMobileLogo: number;
  url: string;
  bannerMessages: string[]; 
}

export async function getSettings(): Promise<Settings> {
  const [settingsResponse, bannerMessages] = await Promise.all([
    getSiteSettings(),
    getBannerMessages()
  ]);
  
  return {
    showBanner: settingsResponse?.show_top_banner ?? 1,
    showMobileLogo: settingsResponse?.show_mobile_logo ?? 1,
    url: settingsResponse?.banner_url ?? "#",
    bannerMessages: bannerMessages
  };
}
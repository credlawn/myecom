import { getSiteSettings } from './api';

export interface Settings {
  showBanner: number;
  showMobileLogo: number;
  enableFooter: number;
  enableChatbot: number;
}

export async function getSettings(): Promise<Settings> {
  const response = await getSiteSettings();
  return {
    showBanner: response?.show_top_banner ?? 1,
    showMobileLogo: response?.show_mobile_logo ?? 1,
    enableFooter: 1,
    enableChatbot: 0,
  };
}

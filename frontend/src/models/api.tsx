import axios from 'axios';

const DOMAIN = process.env.DOMAIN; // e.g., http://localhost:8000
const BASE_URL = `${DOMAIN}/api/method/myecom.api`;

export interface SiteSettingsResponse {
  show_top_banner: number;
  show_mobile_logo: number;
  banner_url?: string | null;
}

export interface BannerMessage {
  banner_message: string;
}

export async function getSiteSettings(): Promise<SiteSettingsResponse | null> {
  try {
    const response = await axios.get(`${BASE_URL}.site_settings.get_site_settings`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const { message } = response.data;

    if (
      typeof message?.show_top_banner === 'number' &&
      typeof message?.show_mobile_logo === 'number'
    ) {
      return {
        show_top_banner: message.show_top_banner,
        show_mobile_logo: message.show_mobile_logo,
        banner_url: message?.banner_url ?? null,
      };
    }

    return null;
  } catch (error) {
    console.error('Axios API error:', error);
    return null;
  }
}

export async function getBannerMessages(): Promise<string[]> {
  try {
    const response = await axios.get(`${BASE_URL}.banner_message.get_banner_message`, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const messagesArray = response.data.message?.messages || [];
    return messagesArray
      .map((msg: any) => msg.banner_message)
      .filter((msg: string) => msg && msg.trim() !== "");
  } catch (error) {
    console.error('Error fetching banner messages:', error);
    return [];
  }
}
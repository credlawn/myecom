import axios from "axios";

const DOMAIN = process.env.DOMAIN;
const BASE_URL = `${DOMAIN}/api/method/myecom.api`;

export interface SiteSettingsResponse {
  show_top_banner: number;
  show_mobile_logo: number;
  auto_slide_hero: number;
  banner_url?: string | null;
  logo_url?: string | null;
}

export async function getSiteSettings(): Promise<SiteSettingsResponse | null> {
  try {
    const { data } = await axios.get(
      `${BASE_URL}.site_settings.get_site_settings`,
      { withCredentials: true },
    );
    const message = data.message;
    if (message) {
      return {
        show_top_banner: message.show_top_banner,
        show_mobile_logo: message.show_mobile_logo,
        auto_slide_hero: message.auto_slide_hero,
        banner_url: message.banner_url ? message.banner_url : null,
        logo_url: message.logo_url ? `${DOMAIN}${message.logo_url}` : null,
      };
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
}

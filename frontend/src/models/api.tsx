import axios from 'axios';

const DOMAIN = 'http://localhost:8000';
const BASE_URL = `${DOMAIN}/api/method/myecom.api`;

interface SiteSettingsResponse {
  show_top_banner: number;
  show_mobile_logo: number;
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
      };
    }

    return null;
  } catch (error) {
    console.error('Axios API error:', error);
    return null;
  }
}

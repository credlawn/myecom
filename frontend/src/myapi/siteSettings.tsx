import axios from "axios";
import { api, img } from "./apiPath";

export interface SiteSettingsResponse {
  show_top_banner: number;
  show_mobile_logo: number;
  visitor_tracking: number;
  auto_slide_hero: number;
  banner_url?: string | null;
  logo_url?: string | null;
  card_size?: number;
  mobile_card_size?: number;
  tab_card_size?: number;
  image_size?: number;
  mobile_image_size?: number;
  tab_image_size?: number;
  card_bg?: string | null;
  image_bg?: string | null;
  text_color?: string | null;
  currency?: string | null;
  primary_color?: string | null;
  secondary_color?: string | null;
  third_color?: string | null;
  button_1_color?: string | null;
  button_2_color?: string | null;
  button_3_color?: string | null;
  bt_1_color?: string | null;
  bt_2_color?: string | null;
  bt_3_color?: string | null;
  star_color_1?: string | null;
  star_color_2?: string | null;
  banner_animation?: string | null;
  bg_color?: string | null;
  bg_shadow_color?: string | null;
  mob_font_color?: string | null;
  lap_font_color?: string | null;
  mob_height?: string | null;
  lap_height?: string | null;
  mob_ft_weight?: number;
  lap_ft_weight?: number;
  mob_ft_size?: number;
  lap_ft_size?: number;
}

export async function getSiteSettings(): Promise<SiteSettingsResponse | null> {
  try {
    const { data } = await axios.get(api.SS, { withCredentials: true });
    const message = data.message;
    if (message) {
      return {
        show_top_banner: message.show_top_banner,
        show_mobile_logo: message.show_mobile_logo,
        visitor_tracking: message.visitor_tracking,
        auto_slide_hero: message.auto_slide_hero,
        banner_url: img(message.banner_url),
        logo_url: img(message.logo_url),
        card_size: message.card_size,
        mobile_card_size: message.mobile_card_size,
        tab_card_size: message.tab_card_size,
        image_size: message.image_size,
        mobile_image_size: message.mobile_image_size,
        tab_image_size: message.tab_image_size,
        card_bg: message.card_bg,
        image_bg: message.image_bg,
        text_color: message.text_color,
        currency: message.currency,
        primary_color: message.primary_color,
        secondary_color: message.secondary_color,
        third_color: message.third_color,
        button_1_color: message.button_1_color,
        button_2_color: message.button_2_color,
        button_3_color: message.button_3_color,
        bt_1_color: message.bt_1_color,
        bt_2_color: message.bt_2_color,
        bt_3_color: message.bt_3_color,
        star_color_1: message.star_color_1,
        star_color_2: message.star_color_2, 
        banner_animation: message.banner_animation,
        bg_color: message.bg_color,
        bg_shadow_color: message.bg_shadow_color,
        mob_font_color: message.mob_font_color,
        lap_font_color: message.lap_font_color,
        mob_height: message.mob_height,
        lap_height: message.lap_height,
        mob_ft_weight: message.mob_ft_weight,
        lap_ft_weight: message.lap_ft_weight,
        mob_ft_size: message.mob_ft_size,
        lap_ft_size: message.lap_ft_size,
      };
    }
    return null;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch site settings');
    }
    throw error;
  }
}

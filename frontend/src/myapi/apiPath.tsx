const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
const API_PATH = process.env.NEXT_PUBLIC_API_PATH;

function apiUrl(endpoint: string) {
  return `${DOMAIN}${API_PATH}.${endpoint}`;
}

export function img(path?: string | null): string {
    if (!path) return DOMAIN || '';
    if (path.startsWith("http")) return path;
    return `${DOMAIN}${path}`;
}

export const api = {
  SS: apiUrl("site_settings.get_site_settings"),

  BM: apiUrl("banner_message.get_banner_message"),

  CL: apiUrl("category_list.get_category_list"),

  HD: apiUrl("hero_section.get_hero_details"),

  ML: apiUrl("menu_list.get_menu_list"),

  PL: apiUrl("product_list.get_product_list"),
  PS: apiUrl("single_product.get_product_by_slug"),

  VR: apiUrl("visitors_record.update_session_time"),
  VC: apiUrl("visitors_record.create_or_update_visitor"),

  WL: apiUrl("wishlist.get_wishlist_items"),
  AW: apiUrl("wishlist.add_to_wishlist"),
  RW: apiUrl("wishlist.remove_from_wishlist"),
  CW: apiUrl("wishlist.clear_wishlist"),
  IW: apiUrl("wishlist.is_in_wishlist"),

  CP: apiUrl("check_pincode.get_delivery_time"),

};

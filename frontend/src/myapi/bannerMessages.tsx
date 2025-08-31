import axios from "axios";

const DOMAIN = process.env.DOMAIN;
const BASE_URL = `${DOMAIN}/api/method/myecom.api`;

export interface BannerMessage {
  banner_message: string;
}

export async function getBannerMessages(): Promise<string[]> {
  try {
    const response = await axios.get(
      `${BASE_URL}.banner_message.get_banner_message`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const messagesArray = response.data.message?.messages || [];
    return messagesArray
      .map((msg: { banner_message: string }) => msg.banner_message)
      .filter((msg: string) => msg && msg.trim() !== "");
  } catch (error) {
    console.error("Error fetching banner messages:", error);
    return [];
  }
}

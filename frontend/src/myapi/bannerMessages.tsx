import axios from "axios";
import { api } from "./apiPath";

export interface BannerMessage {
  banner_message: string;
}

export async function getBannerMessages(): Promise<string[]> {
  try {
    const response = await axios.get(api.BM, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    const messagesArray = response.data.message?.messages || [];
    return messagesArray
      .map((msg: { banner_message: string }) => msg.banner_message)
      .filter((msg: string) => msg && msg.trim() !== "");
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Failed to fetch banner messages");
    }
    throw error;
  }
}

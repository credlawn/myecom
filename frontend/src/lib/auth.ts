import axios from 'axios';
import { api } from '@/myapi/apiPath';

interface CurrentUserResponse {
  message: {
    status: "success" | "error";
    user?: string | null;
    full_name?: string | null;
  };
}

export interface User {
    name: string;
    fullName: string;
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const response = await axios.post<CurrentUserResponse>(
      api.CU,
      {},
      { headers: { "Content-Type": "application/json" }, withCredentials: true }
    );
    const status = response.data.message?.status;
    const user = response.data.message?.user || null;
    const fullName = response.data.message?.full_name || user || null;

    if (status === "success" && user && fullName) {
      return { name: user, fullName: fullName };
    }
    return null;
  } catch {
    return null;
  }
};

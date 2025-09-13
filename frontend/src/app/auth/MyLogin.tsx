import axios from 'axios';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { api } from '@/myapi/apiPath';

export interface LoginResponse {
  status: string;
  sid?: string;
  user?: string;
  full_name?: string;
  email?: string;
  message?: string;
}

class LoginAPI {
  private getHeaders() {
    const visitorId = getCookie('visitor_id');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (visitorId) {
      headers['X-Visitor-Id'] = visitorId as string;
    }
    return headers;
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axios.post(
        api.LGN,
        { usr: email, pwd: password },
        { 
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );

      const data = response.data.message || response.data;

      if (data.status === 'success') {
        document.cookie = "visitor_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        deleteCookie('visitor_id', { path: '/' });
        
        if (data.full_name || data.user) {
          setCookie('user', data.full_name || data.user, { path: '/' });
        }
      }

      return data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data?.message || error.response?.data;
        return {
          status: 'error',
          message: errorData?.message || 'Login failed',
        };
      }
      return {
        status: 'error',
        message: 'An unexpected error occurred',
      };
    }
  }

  async logout() {
    return await axios.post(api.LGT, {}, { withCredentials: true });
  }
}

export const loginAPI = new LoginAPI();
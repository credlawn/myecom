import axios from 'axios';

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN;
const API_URL = `${DOMAIN}/api/method/myecom.api.check_pincode.get_delivery_time`;

interface DeliveryResponse {
  message: {
    pincode?: string;
    city?: string;
    state?: string;
    country?: string;
    delivery_days?: number;
    cod_available?: number;
    serviceable?: number;
    extra_info?: string;
    last_updated_on?: string;
    delivery_date?: string;
    error?: string;
  };
}

export interface PincodeData {
  pincode: string;
  city?: string;
  state?: string;
  country?: string;
  delivery_days: number;
  cod_available: boolean;
  serviceable: boolean;
  extra_info?: string;
  last_updated_on?: string;
  delivery_date?: string;
}

function parseAxiosError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      return (
        error.response.data?.message?.error ||
        error.response.statusText ||
        'Request failed'
      );
    } else if (error.request) {
      return 'No internet connection or server unreachable';
    } else if (error.code === 'ECONNABORTED') {
      return 'Request timed out. Please try again.';
    } else {
      return error.message || 'Unexpected error occurred';
    }
  } else if (error instanceof Error) {
    return error.message;
  }
  return 'Unable to fetch pincode data';
}

export async function checkPinData(
  pincode: string | number
): Promise<PincodeData> {
  const pin = String(pincode).trim();
  if (!/^\d{6}$/.test(pin)) {
    throw new Error('Invalid pincode. Must be 6 digits.');
  }

  try {
    const { data } = await axios.post<DeliveryResponse>(
      API_URL,
      { pincode: pin },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000,
      }
    );

    const msg = data.message;

    if (msg && msg.delivery_days !== undefined) {
      return {
        pincode: msg.pincode || pin,
        city: msg.city,
        state: msg.state,
        country: msg.country,
        delivery_days: msg.delivery_days,
        cod_available: msg.cod_available === 1,
        serviceable: msg.serviceable !== 0,
        extra_info: msg.extra_info,
        last_updated_on: msg.last_updated_on,
        delivery_date: msg.delivery_date,
      };
    }

    throw new Error(msg?.error || 'Currently out of stock in this area');
  } catch (rawError: unknown) {
    throw new Error(parseAxiosError(rawError));
  }
}

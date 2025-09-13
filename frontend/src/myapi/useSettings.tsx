'use client';

import { useQuery } from '@tanstack/react-query';
import { getSettings } from '@/myapi/apiData/settings';

export const useSettings = () => {
  return useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

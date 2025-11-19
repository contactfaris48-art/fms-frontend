import { baseApi } from './baseApi';
import { StorageUsage, StorageStats } from '@/types/file.types';
import { ApiResponse } from '@/types/common.types';
import { API_ENDPOINTS } from '@/utils/constants';

export const storageApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStorageUsage: builder.query<ApiResponse<StorageUsage>, void>({
      query: () => API_ENDPOINTS.STORAGE.USAGE,
      providesTags: ['Storage'],
    }),

    getStorageStats: builder.query<ApiResponse<StorageStats>, void>({
      query: () => API_ENDPOINTS.STORAGE.STATS,
      providesTags: ['Storage'],
    }),
  }),
});

export const { useGetStorageUsageQuery, useGetStorageStatsQuery } = storageApi;
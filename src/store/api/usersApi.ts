import { baseApi } from './baseApi';
import { User, UpdateUserRequest, SetQuotaRequest, UserListFilters } from '@/types/user.types';
import { ApiResponse, PaginationData } from '@/types/common.types';
import { API_ENDPOINTS } from '@/utils/constants';

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<
      ApiResponse<{ users: User[]; pagination: PaginationData }>,
      UserListFilters & { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: API_ENDPOINTS.USERS.LIST,
        params,
      }),
      providesTags: ['Users'],
    }),

    getUser: builder.query<ApiResponse<{ user: User }>, string>({
      query: (userId) => API_ENDPOINTS.USERS.GET(userId),
      providesTags: ['Users'],
    }),

    updateUser: builder.mutation<
      ApiResponse<{ user: User }>,
      { userId: string; data: UpdateUserRequest }
    >({
      query: ({ userId, data }) => ({
        url: API_ENDPOINTS.USERS.UPDATE(userId),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Users'],
    }),

    deleteUser: builder.mutation<ApiResponse<void>, string>({
      query: (userId) => ({
        url: API_ENDPOINTS.USERS.DELETE(userId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Users', 'Storage'],
    }),

    setUserQuota: builder.mutation<
      ApiResponse<{ user: User }>,
      { userId: string; data: SetQuotaRequest }
    >({
      query: ({ userId, data }) => ({
        url: API_ENDPOINTS.USERS.SET_QUOTA(userId),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Users', 'Storage'],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useSetUserQuotaMutation,
} = usersApi;
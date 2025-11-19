import { baseApi } from './baseApi';
import {
  FileItem,
  FileUploadRequest,
  FileUploadResponse,
  ConfirmUploadRequest,
  FileUpdateRequest,
  FileDownloadResponse,
  FileListParams,
} from '@/types/file.types';
import { ApiResponse, PaginationData } from '@/types/common.types';
import { API_ENDPOINTS } from '@/utils/constants';

export const filesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getFiles: builder.query<
      ApiResponse<{ files: FileItem[]; pagination: PaginationData }>,
      FileListParams
    >({
      query: (params) => ({
        url: API_ENDPOINTS.FILES.LIST,
        params,
      }),
      providesTags: ['Files'],
    }),

    requestUploadUrl: builder.mutation<ApiResponse<FileUploadResponse>, FileUploadRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.FILES.UPLOAD_URL,
        method: 'POST',
        body: data,
      }),
    }),

    confirmUpload: builder.mutation<ApiResponse<{ file: FileItem }>, ConfirmUploadRequest>({
      query: (data) => ({
        url: API_ENDPOINTS.FILES.CONFIRM,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Files', 'Storage'],
    }),

    getDownloadUrl: builder.query<ApiResponse<FileDownloadResponse>, string>({
      query: (fileId) => API_ENDPOINTS.FILES.DOWNLOAD_URL(fileId),
    }),

    deleteFile: builder.mutation<ApiResponse<void>, string>({
      query: (fileId) => ({
        url: API_ENDPOINTS.FILES.DELETE(fileId),
        method: 'DELETE',
      }),
      invalidatesTags: ['Files', 'Storage'],
    }),

    updateFile: builder.mutation<
      ApiResponse<{ file: FileItem }>,
      { fileId: string; data: FileUpdateRequest }
    >({
      query: ({ fileId, data }) => ({
        url: API_ENDPOINTS.FILES.UPDATE(fileId),
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Files'],
    }),
  }),
});

export const {
  useGetFilesQuery,
  useRequestUploadUrlMutation,
  useConfirmUploadMutation,
  useGetDownloadUrlQuery,
  useLazyGetDownloadUrlQuery,
  useDeleteFileMutation,
  useUpdateFileMutation,
} = filesApi;
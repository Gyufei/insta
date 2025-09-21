import { useMutation } from '@tanstack/react-query';
import * as CryptoJS from 'crypto-js';
import { toast } from 'sonner';

import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@/config/const-msg';

import { Fetcher } from '../fetcher';
import { ApiPath } from './api-path';

// 生成每周token的函数（与后端完全一致）
const generateWeeklyToken = (): string => {
  const currentTimestamp = Date.now();
  const oneWeekInMs = 7 * 24 * 60 * 60 * 1000; // 一周的毫秒数
  const weekNumber = Math.floor(currentTimestamp / oneWeekInMs);

  // 使用crypto-js进行MD5加密，与后端Node.js crypto.createHash('md5')结果一致
  return CryptoJS.MD5(weekNumber.toString()).toString();
};

interface ImageUploadResponse {
  url: string;
  filename: string;
}

interface ImageUploadParams {
  image: File;
}

export function useImageUpload(onSuccess?: (data: ImageUploadResponse) => void) {
  const mutation = useMutation({
    mutationFn: async (params: ImageUploadParams): Promise<ImageUploadResponse> => {
      const formData = new FormData();
      formData.append('image', params.image);

      // 生成每周token
      const token = generateWeeklyToken();

      const response = await Fetcher<ImageUploadResponse>(ApiPath.imageUpload, {
        method: 'POST',
        body: formData,
        headers: {
          'x-auth-token': token,
        },
        // 不设置 Content-Type，让浏览器自动设置 multipart/form-data
      });

      return response;
    },
    onSuccess: (data: ImageUploadResponse) => {
      toast.success(SUCCESS_MESSAGES.IMAGE_UPLOAD_SUCCESS || 'Image upload success');
      onSuccess?.(data);
    },
    onError: (error: Error) => {
      let errorMessage = error.message;

      if (errorMessage.length > 60) {
        errorMessage = errorMessage.slice(0, 60) + '...';
      }

      toast.error(errorMessage || ERROR_MESSAGES.IMAGE_UPLOAD_FAILED || 'Image upload failed');
    },
  });

  return {
    ...mutation,
    uploadImage: (file: File) => mutation.mutate({ image: file }),
  };
}

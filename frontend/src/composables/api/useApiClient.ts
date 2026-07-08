import { API_BASE_URL } from '@/lib/config';
import { useToastStore } from '@/stores/toasts';
import type { ErrorMessage } from '@/types/api';
import axios from 'axios';
import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { useRoute, useRouter } from 'vue-router';

export interface ApiRequestConfig extends AxiosRequestConfig {
  /** Skip the global 401/403 redirect and error toast for this request -
   * for calls where a failure is an expected, normal outcome (e.g. probing
   * whether a session is still valid before sending the user to log in). */
  silent?: boolean;
}

const isValidDateString = (dateString: string): boolean => {
  // ISO 8601 full date/time. The backend serializes timezone-aware datetimes
  // with a numeric offset ("2023-08-08T12:34:56+00:00"), not just "Z".
  const iso8601Regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/;

  if (!iso8601Regex.test(dateString)) return false;

  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

const convertDatesInResponse = <T>(data: T): T => {
  if (Array.isArray(data)) {
    return data.map((d) => convertDatesInResponse(d)) as T;
  }

  if (data !== null && typeof data === 'object') {
    const convertedData: { [key: string]: unknown } = {};
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const val = (data as any)[key];
        if (typeof val === 'string' && isValidDateString(val)) {
          convertedData[key] = new Date(val);
        } else {
          convertedData[key] = convertDatesInResponse(val);
        }
      }
    }
    return convertedData as T;
  }

  return data;
};

export function useApiClient(config?: AxiosRequestConfig) {
  const toasts = useToastStore();
  const route = useRoute();
  const router = useRouter();
  const baseURL = API_BASE_URL;

  const instance = axios.create({
    baseURL,
    withCredentials: true,
    ...config,
  });

  instance.interceptors.request.use(async (config) => {
    return config;
  });

  instance.interceptors.response.use(
    (response) => {
      response.data = convertDatesInResponse(response.data);
      return response;
    },
    (error: AxiosError<ErrorMessage>) => {
      const statusCode = error.response?.status;
      const silent = (error.config as ApiRequestConfig | undefined)?.silent ?? false;

      if (!silent) {
        // Already on the status page itself - a background request (e.g.
        // one firing from that page, or a shared composable) failing with
        // the same status must not redirect again, or the redirect param
        // nests another encoded copy of this same URL into itself.
        const onStatusPage = route.name === 'unauthorized' || route.name === 'forbidden';

        if (!onStatusPage) {
          const uri = btoa(route.fullPath);

          if (statusCode === 401) {
            router.push(`/401?redirect=${uri}`);
          }

          if (statusCode === 403) {
            router.push(`/403?redirect=${uri}`);
          }
        }

        toasts.addToast({
          message: error.response?.data.message || error.message || 'Something went wrong.',
          type: 'error',
          duration: 5000,
        });
      }

      return Promise.reject(error);
    },
  );

  const get = async <T>(url: string, reqConfig?: ApiRequestConfig): Promise<AxiosResponse<T>> => {
    return await instance.get<T>(url, reqConfig);
  };

  const post = async <T, B>(
    url: string,
    data?: B,
    reqConfig?: ApiRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return await instance.post<T>(url, data, reqConfig);
  };

  const put = async <T, B>(
    url: string,
    data?: B,
    reqConfig?: ApiRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return await instance.put<T>(url, data, reqConfig);
  };

  const patch = async <T, B>(
    url: string,
    data?: B,
    reqConfig?: ApiRequestConfig,
  ): Promise<AxiosResponse<T>> => {
    return await instance.patch<T>(url, data, reqConfig);
  };

  const del = async <T>(url: string, reqConfig?: ApiRequestConfig): Promise<AxiosResponse<T>> => {
    return await instance.delete<T>(url, reqConfig);
  };

  return {
    instance,
    get,
    post,
    put,
    patch,
    delete: del,
  };
}

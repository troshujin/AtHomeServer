import type { AxiosRequestConfig } from "axios";
import type { BaseEntity } from "./base";

export interface Paginated<T> {
  data: T[];
  count: number;
  page: number;
  total: number;
}

export interface ApiOptions {
  disableCache?: boolean;
  disableAuth?: boolean;
  disableToasts?: boolean;
}

export interface CustomApiConfig<D = BaseEntity> extends AxiosRequestConfig<D> {
  cacheKey: string;
}

export interface ErrorMessage {
  message: string;
}

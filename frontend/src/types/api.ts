import type { AxiosRequestConfig } from "axios";
import type { BaseEntity } from "./base";

/** Matches the backend's `Page[T]` response wrapper (core/common/schema.py). */
export interface Paginated<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
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

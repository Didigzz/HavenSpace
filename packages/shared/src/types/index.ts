// Common types used across the application

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface SearchParams extends PaginationParams {
  query?: string;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface FilterOption extends SelectOption {
  count?: number;
}

export interface SortOption {
  field: string;
  direction: 'asc' | 'desc';
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  address?: Address;
}

// Error types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: ValidationError[];
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface AsyncState<T> extends LoadingState {
  data?: T | null;
}

// Form types
export interface FormFieldState<T = any> {
  value: T;
  error?: string;
  touched?: boolean;
  disabled?: boolean;
}

export interface FormState<T extends Record<string, any>> {
  fields: { [K in keyof T]: FormFieldState<T[K]> };
  isValid: boolean;
  isSubmitting: boolean;
  isDirty: boolean;
}
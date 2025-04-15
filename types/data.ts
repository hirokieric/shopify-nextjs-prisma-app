export interface DataFetcherOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: any;
}

export interface DataFetcherState<T = any> {
  data: T;
  loading: boolean;
  error: Error | null;
}

export interface DataCardProps {
  method: string;
  url: string;
  data: any;
  onRefetch: () => void;
}

export interface UseDataFetcherOptions extends DataFetcherOptions {
  initialState?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

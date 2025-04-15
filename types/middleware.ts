import { ApiRequest, ApiResponse } from "./api";

export type MiddlewareFunction = (
  req: ApiRequest,
  res: ApiResponse,
  next: () => void
) => Promise<void>;

export interface VerifyRequestOptions {
  accessMode: "online" | "offline";
  returnHeader?: boolean;
}

export interface VerifyHmacOptions {
  rawBody: string;
  hmac: string;
}

export interface VerifyProxyOptions {
  query: Record<string, string>;
  signature: string;
}

export interface VerifyCheckoutOptions {
  sessionId: string;
  shop: string;
}

export interface IsInitialLoadOptions {
  shop: string;
  session?: any;
}

import { ApiRequest, ApiResponse } from "./api";
import { ShopifySession } from "./shopify";

export interface MiddlewareFunction {
  (req: ApiRequest, res: ApiResponse, next: () => void): Promise<void>;
}

export interface SessionHandler {
  storeSession: (session: ShopifySession) => Promise<void>;
  loadSession: (id: string) => Promise<ShopifySession | null>;
  deleteSession: (id: string) => Promise<void>;
}

export interface ClientProvider {
  graphqlClient: (params: {
    shop?: string;
    req?: ApiRequest;
    res?: ApiResponse;
  }) => Promise<any>;
  storefrontClient: (params: {
    shop?: string;
    req?: ApiRequest;
    res?: ApiResponse;
  }) => Promise<any>;
}

export interface SetupCheckResult {
  isValid: boolean;
  errors: string[];
}

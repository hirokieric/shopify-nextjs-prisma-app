import { ApiRequest, ApiResponse } from "./api";
import { ShopifySession } from "./shopify";
import { GraphqlClient } from "@shopify/shopify-api";

export interface MiddlewareFunction {
  (req: ApiRequest, res: ApiResponse, next: () => void): Promise<void>;
}

export interface GraphQLClientOptions {
  shop?: string;
  req?: ApiRequest;
  res?: ApiResponse;
}

export interface GraphQLClientProvider {
  graphqlClient: (
    options: GraphQLClientOptions
  ) => Promise<{ client: GraphqlClient }>;
}

export interface ClientProvider {
  offline: GraphQLClientProvider;
  online: GraphQLClientProvider;
}

export interface SessionHandler {
  storeSession: (session: ShopifySession) => Promise<void>;
  loadSession: (id: string) => Promise<ShopifySession | null>;
  deleteSession: (id: string) => Promise<void>;
}

export interface SetupCheckResult {
  isValid: boolean;
  errors: string[];
}

import {
  Session,
  ApiVersion,
  LogSeverity,
  ConfigParams,
  Shopify,
  RequestedTokenType,
  GraphqlClient,
} from "@shopify/shopify-api";
import { IncomingMessage, ServerResponse } from "http";

export type ShopifyConfig = ConfigParams & {
  apiKey: string;
  apiSecretKey: string;
  scopes: string[];
  hostName: string;
  hostScheme?: "https" | "http";
  apiVersion: ApiVersion;
  isEmbeddedApp: boolean;
  logger?: {
    level: LogSeverity;
  };
};

export interface ShopifySession extends Session {
  shop: string;
  accessToken: string;
  scope: string;
  expires?: Date;
}

export type WebhookCallback = (
  topic: string,
  shop: string,
  body: any
) => Promise<void>;

export type ShopifyInstance = Shopify & {
  auth: {
    tokenExchange: (params: {
      sessionToken: string;
      shop: string;
      requestedTokenType: RequestedTokenType;
    }) => Promise<{ session: Session }>;
  };
  clients: {
    Graphql: new (params: { session: Session }) => GraphqlClient;
  };
  session: {
    getOfflineId: (shop: string) => string;
    getCurrentId: (params: {
      isOnline: boolean;
      rawRequest: IncomingMessage;
      rawResponse: ServerResponse;
    }) => Promise<string | undefined>;
  };
  user: {
    webhooks: Array<{
      topics: string[];
      url: string;
      callback: WebhookCallback;
    }>;
  };
};

export interface WebhookHandler {
  topic: string;
  shop: string;
  webhookRequestBody: any;
  webhookId: string;
  apiVersion: string;
}

export interface WebhookTopic {
  topic: string;
  url: string;
  callback: (payload: WebhookHandler) => Promise<void>;
  filter?: string;
  include_fields?: string[];
}

export interface WebhookTopics {
  [key: string]: WebhookTopic[];
}

export interface AppUninstalledPayload {
  shop_id: number;
  shop_domain: string;
}

export interface WebhookConfig {
  topics: string[];
  url: string;
  include_fields?: string[];
  filter?: string;
  callback: {
    name: string;
  };
}

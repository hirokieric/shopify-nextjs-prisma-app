import { ApiVersion, LogSeverity } from "@shopify/shopify-api";

export interface TomlConfig {
  name: string;
  handle: string;
  client_id: string;
  application_url: string;
  embedded: boolean;
  extension_directories: string[];
  auth: {
    redirect_urls: string[];
  };
  access_scopes: {
    scopes: string;
    optional_scopes?: string[];
    use_legacy_install_flow: boolean;
  };
  access?: {
    admin?: {
      direct_api_mode?: "online" | "offline";
      embedded_app_direct_api_access?: boolean;
    };
  };
  webhooks: {
    api_version: "2024-07" | "2024-10" | "2025-01" | "2025-04";
    privacy_compliance: {
      customer_data_request_url: string;
      customer_deletion_url: string;
      shop_deletion_url: string;
    };
    subscriptions?: Array<{
      topics: string[];
      url: string;
      callback: (topic: string, shop: string, body: any) => Promise<void>;
    }>;
  };
  app_proxy?: {
    url: string;
    prefix: "apps" | "a" | "community" | "tools";
    subpath: string;
  };
  pos?: {
    embedded: boolean;
  };
  build: {
    include_config_on_deploy: boolean;
  };
}

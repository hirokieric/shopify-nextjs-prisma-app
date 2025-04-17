import { TomlConfig } from "../types/toml";
import shopify from "../utils/shopify";

/**
 * Writes webhook configuration to the TOML config
 * @param {TomlConfig} config - The TOML configuration object
 */
export default function webhookWriter(config: TomlConfig): void {
  if (!config.webhooks) {
    config.webhooks = {
      api_version: process.env.SHOPIFY_API_VERSION as
        | "2024-07"
        | "2024-10"
        | "2025-01"
        | "2025-04",
      privacy_compliance: {
        customer_data_request_url: "",
        customer_deletion_url: "",
        shop_deletion_url: "",
      },
    };
  }

  if (!config.webhooks.subscriptions) {
    config.webhooks.subscriptions = [];
  }

  // Add webhooks from shopify.user.webhooks
  shopify.user.webhooks.forEach((webhook) => {
    webhook.topics.forEach((topic) => {
      config.webhooks.subscriptions?.push({
        topics: [topic],
        url: webhook.url,
        callback: webhook.callback,
      });
    });
  });
}

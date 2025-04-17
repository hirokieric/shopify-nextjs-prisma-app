import toml from "@iarna/toml";
import "dotenv/config";
import fs from "fs";
import path from "path";
import setupCheck from "../utils/setupCheck";
import webhookWriter from "./webhookWriter";
import type { TomlConfig } from "../types/toml";

let config: Partial<TomlConfig> = {};

try {
  setupCheck(); //Run setup check to ensure all env variables are accessible

  let appUrl = process.env.SHOPIFY_APP_URL;
  if (appUrl?.endsWith("/")) {
    appUrl = appUrl.slice(0, -1);
  }
  // Globals
  config.name = process.env.APP_NAME!;
  config.handle = process.env.APP_HANDLE!;
  config.client_id = process.env.SHOPIFY_API_KEY!;
  config.application_url = appUrl!;
  config.embedded = true;
  config.extension_directories = ["../extension/extensions/**"];

  // Auth
  config.auth = {
    redirect_urls: [`${appUrl}/api/`],
  };

  // Scopes
  config.access_scopes = {
    scopes: process.env.SHOPIFY_API_SCOPES!,
    use_legacy_install_flow: false,
  };

  if (process.env.SHOPIFY_API_OPTIONAL_SCOPES?.trim()) {
    config.access_scopes.optional_scopes =
      process.env.SHOPIFY_API_OPTIONAL_SCOPES.split(",")
        .map((scope) => scope.trim())
        .filter(Boolean);
  }

  if (
    process.env.DIRECT_API_MODE &&
    process.env.EMBEDDED_APP_DIRECT_API_ACCESS
  ) {
    // Access
    config.access = {
      admin: {
        direct_api_mode: process.env.DIRECT_API_MODE as "online" | "offline",
        embedded_app_direct_api_access:
          process.env.EMBEDDED_APP_DIRECT_API_ACCESS === "true",
      },
    };
  }

  // Webhook event version to always match the app API version
  config.webhooks = {
    api_version: process.env.SHOPIFY_API_VERSION as
      | "2024-07"
      | "2024-10"
      | "2025-01"
      | "2025-04",
    privacy_compliance: {
      customer_data_request_url: `${appUrl}/api/gdpr/customers_data_request`,
      customer_deletion_url: `${appUrl}/api/gdpr/customers_redact`,
      shop_deletion_url: `${appUrl}/api/gdpr/shop_redact`,
    },
  };

  // Webhooks
  webhookWriter(config as TomlConfig);

  // App Proxy
  const appProxyPrefix = process.env.APP_PROXY_PREFIX;
  const appProxySubpath = process.env.APP_PROXY_SUBPATH;
  if (appProxyPrefix && appProxySubpath) {
    config.app_proxy = {
      url: `${appUrl}/api/proxy_route`,
      prefix: appProxyPrefix as "apps" | "a" | "community" | "tools",
      subpath: appProxySubpath,
    };
  }

  // PoS
  const posEmbedded = process.env.POS_EMBEDDED;
  if (posEmbedded) {
    config.pos = {
      embedded: posEmbedded === "true",
    };
  }

  //Build
  config.build = {
    include_config_on_deploy: true,
  };

  //Write to toml
  let str = toml.stringify(config as TomlConfig);
  str =
    "# Avoid writing to toml directly. Use your .env file instead\n\n" + str;

  fs.writeFileSync(path.join(process.cwd(), "shopify.app.toml"), str);
  console.log("Written TOML to root");

  const extensionsDir = path.join("..", "extension");

  config.extension_directories = ["./extensions/**"];
  let extensionStr = toml.stringify(config as TomlConfig);
  extensionStr =
    "# Avoid writing to toml directly. Use your .env file instead\n\n" +
    extensionStr;

  config.extension_directories = ["extension/extensions/**"];
  let globalStr = toml.stringify(config as TomlConfig);
  globalStr =
    "# Avoid writing to toml directly. Use your .env file instead\n\n" +
    globalStr;

  if (fs.existsSync(extensionsDir)) {
    fs.writeFileSync(
      path.join(process.cwd(), "..", "shopify.app.toml"),
      globalStr
    );
    console.log("Written TOML to root");

    fs.writeFileSync(
      path.join(extensionsDir, "shopify.app.toml"),
      extensionStr
    );
    console.log("Written TOML to extension");
  }
} catch (e) {
  console.error("---> An error occured while writing toml files");
  console.log(e instanceof Error ? e.message : String(e));
}

import toml from "@iarna/toml";
import "dotenv/config";
import fs from "fs";
import path from "path";
import setupCheck from "../utils/setupCheck.js";
import webhookWriter from "./webhookWriter.js";

interface JsonMap {
  [key: string]: any;
}

interface AppConfig extends JsonMap {
  name?: string;
  handle?: string;
  client_id?: string;
  application_url?: string;
  embedded?: boolean;
  extension_directories?: string[];
  auth?: {
    redirect_urls?: string[];
  };
  access_scopes?: {
    scopes?: string;
    optional_scopes?: string[];
    use_legacy_install_flow?: boolean;
  };
  access?: {
    admin?: {
      direct_api_mode?: string;
      embedded_app_direct_api_access?: boolean;
    };
  };
  webhooks?: {
    api_version?: string;
    privacy_compliance?: {
      customer_data_request_url?: string;
      customer_deletion_url?: string;
      shop_deletion_url?: string;
    };
    subscriptions?: any[];
  };
  app_proxy?: {
    url?: string;
    prefix?: string;
    subpath?: string;
  };
  pos?: {
    embedded?: boolean;
  };
  build?: {
    include_config_on_deploy?: boolean;
  };
}

let config: AppConfig = {};

try {
  setupCheck();

  let appUrl = process.env.SHOPIFY_APP_URL;
  if (!appUrl) {
    throw new Error("SHOPIFY_APP_URL is not defined");
  }
  if (appUrl.endsWith("/")) {
    appUrl = appUrl.slice(0, -1);
  }

  config = {
    name: process.env.APP_NAME,
    handle: process.env.APP_HANDLE,
    client_id: process.env.SHOPIFY_API_KEY,
    application_url: appUrl,
    embedded: true,
    extension_directories: ["../extension/extensions/**"],
    auth: {
      redirect_urls: [`${appUrl}/api/`],
    },
    access_scopes: {
      scopes: process.env.SHOPIFY_API_SCOPES,
      use_legacy_install_flow: false,
    },
    webhooks: {
      api_version: process.env.SHOPIFY_API_VERSION,
      privacy_compliance: {
        customer_data_request_url: `${appUrl}/api/gdpr/customers_data_request`,
        customer_deletion_url: `${appUrl}/api/gdpr/customers_redact`,
        shop_deletion_url: `${appUrl}/api/gdpr/shop_redact`,
      },
    },
  };

  if (process.env.SHOPIFY_API_OPTIONAL_SCOPES?.trim()) {
    config.access_scopes!.optional_scopes =
      process.env.SHOPIFY_API_OPTIONAL_SCOPES.split(",")
        .map((scope) => scope.trim())
        .filter(Boolean);
  }

  if (
    process.env.DIRECT_API_MODE &&
    process.env.EMBEDDED_APP_DIRECT_API_ACCESS
  ) {
    config.access = {
      admin: {
        direct_api_mode: process.env.DIRECT_API_MODE,
        embedded_app_direct_api_access:
          process.env.EMBEDDED_APP_DIRECT_API_ACCESS === "true",
      },
    };
  }

  if (process.env.APP_PROXY_PREFIX && process.env.APP_PROXY_SUBPATH) {
    config.app_proxy = {
      url: `${appUrl}/api/proxy_route`,
      prefix: process.env.APP_PROXY_PREFIX,
      subpath: process.env.APP_PROXY_SUBPATH,
    };
  }

  if (process.env.POS_EMBEDDED) {
    config.pos = {
      embedded: process.env.POS_EMBEDDED === "true",
    };
  }

  config.build = {
    include_config_on_deploy: true,
  };

  webhookWriter(config);

  let str = toml.stringify(config);
  str =
    "# Avoid writing to toml directly. Use your .env file instead\n\n" + str;

  fs.writeFileSync(path.join(process.cwd(), "shopify.app.toml"), str);

  const extensionsDir = path.join("..", "extension");

  config.extension_directories = ["./extensions/**"];
  let extensionStr = toml.stringify(config);
  extensionStr =
    "# Avoid writing to toml directly. Use your .env file instead\n\n" +
    extensionStr;

  config.extension_directories = ["extension/extensions/**"];
  let globalStr = toml.stringify(config);
  globalStr =
    "# Avoid writing to toml directly. Use your .env file instead\n\n" +
    globalStr;

  if (fs.existsSync(extensionsDir)) {
    fs.writeFileSync(
      path.join(process.cwd(), "..", "shopify.app.toml"),
      globalStr
    );
    fs.writeFileSync(
      path.join(extensionsDir, "shopify.app.toml"),
      extensionStr
    );
  }
} catch (e) {
  const error = e as Error;
  console.error("---> An error occured while writing toml files");
  console.log(error.message);
}

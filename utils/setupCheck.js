export default function setupCheck() {
  // 必要な環境変数のチェック
  const requiredEnvVars = [
    "SHOPIFY_API_KEY",
    "SHOPIFY_API_SECRET",
    "SHOPIFY_API_SCOPES",
    "SHOPIFY_APP_URL",
    "SHOPIFY_API_VERSION",
    "DATABASE_URL",
    "ENCRYPTION_STRING",
    "APP_NAME",
    "APP_HANDLE",
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `以下の環境変数が設定されていません: ${missingEnvVars.join(", ")}`
    );
  }

  return true;
}

/**
 * 必要な環境変数が設定されているかチェックする関数
 * @returns {boolean} すべての環境変数が設定されている場合はtrueを返す
 * @throws {Error} 必要な環境変数が設定されていない場合にエラーをスローする
 */
export default function setupCheck(): boolean {
  // 必要な環境変数のチェック
  const requiredEnvVars: string[] = [
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

  const missingEnvVars: string[] = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    throw new Error(
      `以下の環境変数が設定されていません: ${missingEnvVars.join(", ")}`
    );
  }

  return true;
}

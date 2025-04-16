// lib/middleware/verifyProxy.ts
import crypto from "crypto";
import type { MiddlewareFn } from "@/types/middleware";

if (!process.env.SHOPIFY_API_SECRET) {
  throw new Error("SHOPIFY_API_SECRET is not defined");
}

export const verifyProxy: MiddlewareFn<{ shop: string }> = async (req) => {
  // URL をパースしてクエリパラメータをオブジェクト化
  const url = new URL(req.url);
  const query = Object.fromEntries(url.searchParams.entries());

  const signature = query.signature;
  if (!signature) {
    return {
      success: false,
      response: new Response("Missing signature", {
        status: 400,
        headers: { "content-type": "text/plain" },
      }),
    };
  }

  // 計算用に signature を除外
  const { signature: _, ...restQuery } = query;
  const queryURI = encodeQueryData(restQuery)
    .split("&")
    .map((x) => decodeURIComponent(x))
    .sort()
    .join("");

  const calculatedSignature = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET!)
    .update(queryURI, "utf-8")
    .digest("hex");

  if (calculatedSignature === signature) {
    const shop = query.shop;
    if (!shop) {
      return {
        success: false,
        response: new Response("Missing shop parameter", {
          status: 400,
          headers: { "content-type": "text/plain" },
        }),
      };
    }
    return { success: true, data: { shop } };
  } else {
    return {
      success: false,
      response: new Response(
        JSON.stringify({
          success: false,
          message: "Signature verification failed",
        }),
        {
          status: 401,
          headers: { "content-type": "application/json" },
        }
      ),
    };
  }
};

/**
 * 指定オブジェクトを URL クエリ文字列へエンコードするヘルパー関数
 */
function encodeQueryData(data: Record<string, any>): string {
  const queryString: string[] = [];
  for (let key in data) {
    queryString.push(`${key}=${encodeURIComponent(data[key])}`);
  }
  return queryString.join("&");
}

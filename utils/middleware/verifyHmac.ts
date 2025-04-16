import crypto from "crypto";
import shopify from "@/utils/shopify";
import type { MiddlewareFn } from "@/types/middleware";

export const verifyHmac: MiddlewareFn<{ rawBody: string }> = async (req) => {
  try {
    // Webhook の場合は本文が必要なので読み取る
    const rawBody = await req.text();
    const hmac = req.headers.get("x-shopify-hmac-sha256");

    if (!hmac) {
      return {
        success: false,
        response: new Response("Missing HMAC header", { status: 400 }),
      };
    }

    const generated = crypto
      .createHmac("sha256", process.env.SHOPIFY_API_SECRET as string)
      .update(rawBody, "utf8")
      .digest("base64");

    if (!shopify.auth.safeCompare(generated, hmac)) {
      return {
        success: false,
        response: new Response("HMAC verification failed", { status: 401 }),
      };
    }

    return { success: true, data: { rawBody } };
  } catch (e) {
    console.error("---> Error during HMAC verification:", e);
    return {
      success: false,
      response: new Response("HMAC verification error", { status: 500 }),
    };
  }
};

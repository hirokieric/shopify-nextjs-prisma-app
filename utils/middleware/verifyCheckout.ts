// lib/middleware/verifyCheckout.ts
import shopify from "@/utils/shopify";
import validateJWT from "../validateJWT";
import type { MiddlewareFn } from "@/types/middleware";

export const verifyCheckout: MiddlewareFn<{ shop: string }> = async (
  req: Request
) => {
  // OPTIONS リクエストの場合はプリフライトとして 200 を返す
  if (req.method === "OPTIONS") {
    return {
      success: false,
      response: new Response(null, { status: 200 }),
    };
  }

  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return {
        success: false,
        response: new Response("No authorization header found.", {
          status: 401,
        }),
      };
    }
    const token = authHeader.split(" ")[1];
    const payload = validateJWT(token);

    const shop = shopify.utils.sanitizeShop(
      payload.dest.replace("https://", "")
    );
    if (!shop) {
      return {
        success: false,
        response: new Response("No shop found, not a valid request", {
          status: 401,
        }),
      };
    }

    return { success: true, data: { shop } };
  } catch (e: any) {
    console.error(
      "---> An error happened at verifyCheckout middleware:",
      e.message
    );
    return {
      success: false,
      response: new Response(JSON.stringify({ error: "Unauthorized call" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      }),
    };
  }
};

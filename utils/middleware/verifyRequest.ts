import validateJWT from "../validateJWT";
import shopify from "@/utils/shopify";
import sessionHandler from "@/utils/sessionHandler";
import { RequestedTokenType, Session } from "@shopify/shopify-api";
import type { MiddlewareFn } from "@/types/middleware";

export const verifyRequest: MiddlewareFn<{
  session: Session;
  shop: string;
}> = async (req) => {
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
    const payload = validateJWT(token); // JWT の署名検証
    const shop = shopify.utils.sanitizeShop(
      payload.dest.replace("https://", "")
    );
    if (!shop) {
      return {
        success: false,
        response: new Response("Invalid shop in token", { status: 401 }),
      };
    }

    // Shopify のセッションID取得（公式ライブラリは Express 向けの想定の可能性があるので注意）
    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: undefined,
    });

    let session = await sessionHandler.loadSession(sessionId);

    if (
      !session ||
      !session.expires ||
      new Date(session.expires) <= new Date() ||
      !shopify.config.scopes?.equals(session.scope)
    ) {
      session = await getSession({ shop, authHeader });
    }

    return { success: true, data: { session, shop } };
  } catch (e) {
    console.error("---> verifyRequest failed:", e);
    return {
      success: false,
      response: new Response("Unauthorized", { status: 401 }),
    };
  }
};

async function getSession({
  shop,
  authHeader,
}: {
  shop: string;
  authHeader: string;
}) {
  const sessionToken = authHeader.split(" ")[1];

  const { session: onlineSession } = await shopify.auth.tokenExchange({
    sessionToken,
    shop,
    requestedTokenType: RequestedTokenType.OnlineAccessToken,
  });

  await sessionHandler.storeSession(onlineSession);

  const { session: offlineSession } = await shopify.auth.tokenExchange({
    sessionToken,
    shop,
    requestedTokenType: RequestedTokenType.OfflineAccessToken,
  });

  await sessionHandler.storeSession(offlineSession);

  return new Session(onlineSession);
}

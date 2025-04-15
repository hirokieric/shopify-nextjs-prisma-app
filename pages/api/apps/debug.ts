import { NextApiRequest, NextApiResponse } from "next";
import { ApiRequest, ApiResponse } from "../../../types/api";
import clientProvider from "../../../utils/clientProvider";
import shopify from "../../../utils/shopify";
import sessionHandler from "../../../utils/sessionHandler";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    // セッションIDを取得
    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req as ApiRequest,
      rawResponse: res as ApiResponse,
    });

    if (!sessionId) {
      return res.status(401).json({
        success: false,
        error: "No session found",
      });
    }

    // セッションを取得
    const session = await sessionHandler.loadSession(sessionId);

    if (!session) {
      return res.status(401).json({
        success: false,
        error: "Session not found",
      });
    }

    const { client } = await clientProvider.offline.graphqlClient({
      shop: session.shop,
    });

    const response = await client.request(`
      query {
        shop {
          name
          id
          myshopifyDomain
          plan {
            displayName
            partnerDevelopment
            shopifyPlus
          }
        }
      }
    `);

    res.status(200).json({
      success: true,
      data: response,
      session: {
        shop: session.shop,
        accessToken: session.accessToken ? "********" : null,
        isOnline: session.isOnline,
      },
    });
  } catch (error) {
    console.error("Debug endpoint error:", error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

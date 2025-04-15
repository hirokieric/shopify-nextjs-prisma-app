import { MiddlewareFunction } from "../../types/middleware";
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";
import { RequestedTokenType, Session } from "@shopify/shopify-api";
import validateJWT from "../validateJWT";

interface GetSessionParams {
  shop: string;
  authHeader: string;
}

/**
 *
 * @async
 * @function verifyRequest
 * @param {import('next').NextApiRequest} req - The Next.js API request object, expected to have an 'authorization' header.
 * @param {import('next').NextApiResponse} res - The Next.js API response object, used to send back error messages if needed.
 * @param {import('next').NextApiHandler} next - Callback to pass control to the next middleware function in the Next.js API route.
 * @throws Will throw an error if the authorization header is missing or invalid, or if no shop is found in the payload.
 */
const verifyRequest: MiddlewareFunction = async (req, res, next) => {
  try {
    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });

    if (!sessionId) {
      res
        .status(401)
        .json({ error: "Unauthorized", message: "No session found" });
      return;
    }

    const session = await sessionHandler.loadSession(sessionId);
    if (!session) {
      res
        .status(401)
        .json({ error: "Unauthorized", message: "No session found" });
      return;
    }

    if (
      session.expires &&
      new Date(session.expires) > new Date() &&
      shopify.config?.scopes?.equals(session.scope)
    ) {
      req.user_shop = session.shop;
      next();
    } else {
      res.status(401).json({
        error: "Unauthorized",
        message: "Session expired or scopes mismatch",
      });
    }
  } catch (error: unknown) {
    const err =
      error instanceof Error ? error : new Error("Unknown error occurred");
    console.error(
      `---> An error happened at verifyRequest middleware: ${err.message}`
    );
    res.status(401).json({ error: "Unauthorized", message: err.message });
  }
};

export default verifyRequest;

/**
 * Retrieves and stores session information based on the provided authentication header and offline flag.
 *
 * @async
 * @function getSession
 * @param {Object} params - The function parameters.
 * @param {string} params.shop - The xxx.myshopify.com url of the requesting store.
 * @param {string} params.authHeader - The authorization header containing the session token.
 * @returns {Promise<Session>} The online session object
 */

async function getSession({
  shop,
  authHeader,
}: GetSessionParams): Promise<Session | undefined> {
  try {
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
  } catch (error: unknown) {
    const err =
      error instanceof Error ? error : new Error("Unknown error occurred");
    console.error(
      `---> Error happened while pulling session from Shopify: ${err.message}`
    );
    return undefined;
  }
}

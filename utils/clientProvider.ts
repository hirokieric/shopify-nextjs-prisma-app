import { ApiRequest, ApiResponse } from "../types/api";
import { ShopifySession } from "../types/shopify";
import { ClientProvider, GraphQLClientOptions } from "../types/utils";
import sessionHandler from "./sessionHandler";
import shopify from "./shopify";

/**
 * Fetches the offline session associated with a shop.
 * @async
 * @param {string} shop - The shop's domain.
 */
const fetchOfflineSession = async (
  shop: string
): Promise<ShopifySession | null> => {
  try {
    const sessionId = shopify.session.getOfflineId(shop);
    const session = await sessionHandler.loadSession(sessionId);
    return session as ShopifySession;
  } catch (e) {
    console.error(
      `---> Error while fetching offline session: ${(e as Error).message}`
    );
    return null;
  }
};

/**
 * Provides methods to create clients for offline access.
 * @namespace offline
 */
const offlineClientProvider = {
  /**
   * Creates a Shopify GraphQL client for offline access.
   * @async
   * @param {Object} params - The request and response objects.
   * @param {string} params.shop - The shop's domain
   */
  graphqlClient: async (options: GraphQLClientOptions) => {
    const { shop } = options;
    if (!shop) {
      throw new Error("Shop is required for offline access");
    }
    const session = await fetchOfflineSession(shop);
    if (!session) {
      throw new Error("No session found");
    }
    const client = new shopify.clients.Graphql({ session });
    return { client };
  },
};

/**
 * Fetches the online session associated with a request.
 * @async
 * @param {Object} params - The request and response objects.
 * @param {import('next').NextApiRequest} params.req - The Next.js API request object
 * @param {import('next').NextApiResponse} params.res - The Next.js API response object
 */
const fetchOnlineSession = async (options: {
  req: ApiRequest;
  res: ApiResponse;
}): Promise<ShopifySession | null> => {
  try {
    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: options.req,
      rawResponse: options.res,
    });
    if (!sessionId) {
      return null;
    }
    const session = await sessionHandler.loadSession(sessionId);
    return session as ShopifySession;
  } catch (e) {
    console.error(
      `---> Error while fetching online session: ${(e as Error).message}`
    );
    return null;
  }
};

/**
 * Provides methods to create clients for online access.
 * @namespace online
 */
const onlineClientProvider = {
  /**
   * Creates a Shopify GraphQL client for online access.
   * @async
   * @param {Object} params - The request and response objects.
   * @param {import('next').NextApiRequest} params.req - The Next.js API request object
   * @param {import('next').NextApiResponse} params.res - The Next.js API response object
   */
  graphqlClient: async (options: GraphQLClientOptions) => {
    const { req, res } = options;
    if (!req || !res) {
      throw new Error("Request and response objects are required");
    }
    const session = await fetchOnlineSession({ req, res });
    if (!session) {
      throw new Error("No session found");
    }
    const client = new shopify.clients.Graphql({ session });
    return { client };
  },
};

/**
 * Provides GraphQL client providers for both online and offline access.
 * @namespace clientProvider
 */
const clientProvider: ClientProvider = {
  offline: offlineClientProvider,
  online: onlineClientProvider,
};

export default clientProvider;

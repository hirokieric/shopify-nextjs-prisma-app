import { RequestedTokenType } from "@shopify/shopify-api";
import sessionHandler from "../sessionHandler";
import shopify from "../shopify";
import freshInstall from "../freshInstall";
import prisma from "../prisma";
import { GetServerSidePropsContext } from "next";

/**
 * @async
 * @param {{
 *   params: { [key: string]: string | undefined },
 *   req: import('http').IncomingMessage,
 *   res: import('http').ServerResponse,
 *   query: { [key: string]: string | string[] },
 *   preview?: boolean,
 *   previewData?: any,
 *   resolvedUrl: string,
 *   locale?: string,
 *   locales?: string[],
 *   defaultLocale?: string
 * }} context
 * @returns {Promise<{props: { [key: string]: any } | undefined}>} Object with props to be passed to the page component.
 */
const isInitialLoad = async (context: GetServerSidePropsContext) => {
  try {
    const shop = context.query.shop as string;
    const idToken = context.query.id_token as string;

    //Initial Load
    if (idToken && shop) {
      const { session: offlineSession } = await shopify.auth.tokenExchange({
        sessionToken: idToken,
        shop,
        requestedTokenType: RequestedTokenType.OfflineAccessToken,
      });

      const { session: onlineSession } = await shopify.auth.tokenExchange({
        sessionToken: idToken,
        shop,
        requestedTokenType: RequestedTokenType.OnlineAccessToken,
      });

      await sessionHandler.storeSession(offlineSession);
      await sessionHandler.storeSession(onlineSession);

      const isFreshInstall = await prisma.stores.findFirst({
        where: {
          shop: onlineSession.shop,
        },
      });

      if (!isFreshInstall || isFreshInstall?.isActive === false) {
        // !isFreshInstall -> New Install
        // isFreshInstall?.isActive === false -> Reinstall
        await freshInstall({ shop: onlineSession.shop });
      }
    } else {
      // The user has visited the page again.
      // We know this because we're not preserving any url params and idToken doesn't exist here
    }
    return {
      props: {
        data: "ok",
      },
    };
  } catch (e) {
    const error = e as Error;
    if (
      error.message.includes("Failed to parse session token") &&
      process.env.NODE_ENV === "development"
    ) {
      console.warn(
        "JWT Error - happens in dev mode and can be safely ignored, but not in prod."
      );
    } else {
      console.error(
        `---> An error occured at isInitialLoad: ${error.message}`,
        error
      );
      return {
        props: {
          serverError: true,
        },
      };
    }
    return {
      props: {
        data: "ok",
      },
    };
  }
};

export default isInitialLoad;

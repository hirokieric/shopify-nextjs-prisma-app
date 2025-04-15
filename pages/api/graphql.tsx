import withMiddleware from "@/utils/middleware/withMiddleware";
import shopify from "@/utils/shopify";
import sessionHandler from "@/utils/sessionHandler";
import { ApiRequest, ApiResponse } from "@/types/api";
/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req: ApiRequest, res: ApiResponse) => {
  //Reject anything that's not a POST
  if (req.method !== "POST") {
    return res.status(400).send({ text: "We don't do that here." });
  }

  try {
    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });

    if (!sessionId) {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "No session ID found" });
    }

    const session = await sessionHandler.loadSession(sessionId);
    if (!session) {
      return res
        .status(401)
        .json({ error: "Unauthorized", message: "No session found" });
    }
    const response = await shopify.clients.graphqlProxy({
      session,
      rawBody: req.body,
    });

    res.status(200).send(response.body);
  } catch (e) {
    console.error("An error occured at /api/graphql", e);
    return res.status(403).send(e);
  }
};

withMiddleware("verifyRequest")(handler);

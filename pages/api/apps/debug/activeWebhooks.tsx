import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";
import { ApiRequest, ApiResponse } from "@/types/api";
/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req: ApiRequest, res: ApiResponse) => {
  if (req.method === "GET") {
    try {
      const { client } = await clientProvider.offline.graphqlClient({
        shop: req.user_shop,
      });

      const activeWebhooks = await client.request(/* GraphQL */ `
        {
          webhookSubscriptions(first: 25) {
            edges {
              node {
                topic
                endpoint {
                  __typename
                  ... on WebhookHttpEndpoint {
                    callbackUrl
                  }
                }
              }
            }
          }
        }
      `);
      return res.status(200).send(activeWebhooks);
    } catch (e) {
      const error = e as Error;
      console.error(`---> An error occured`, error);
      return res.status(400).send({ text: "Bad request" });
    }
  } else {
    res.status(400).send({ text: "Bad request" });
  }
};

export default withMiddleware("verifyRequest")(handler);

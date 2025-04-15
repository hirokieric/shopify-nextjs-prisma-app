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
      const { client } = await clientProvider.online.graphqlClient({
        req,
        res,
      });
      const shop = await client.request(/* GraphQL */ `
        {
          shop {
            name
          }
        }
      `);
      return res.status(200).send({ text: shop.data.shop.name });
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

import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";
import { ApiRequest, ApiResponse } from "@/types/api";
/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req: ApiRequest, res: ApiResponse) => {
  try {
    const { client } = await clientProvider.offline.graphqlClient({
      shop: req.user_shop, //req.user_session isn't available in proxy routes
    });

    return res.status(200).send({ content: "Proxy Be Working" });
  } catch (e) {
    const error = e as Error;
    console.error(
      `---> An error occured at /api/proxy_route/json: ${error.message}`,
      error
    );
    return res.status(400).send({ error: true });
  }
};

export default withMiddleware("verifyProxy")(handler);

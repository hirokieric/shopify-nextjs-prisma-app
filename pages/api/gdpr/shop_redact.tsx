import withMiddleware from "@/utils/middleware/withMiddleware";
import { ApiRequest, ApiResponse } from "@/types/api";

/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req: ApiRequest, res: ApiResponse) => {
  if (req.method !== "POST") {
    return res.status(401).send("Must be POST");
  }
  try {
    const { body } = req;
    const shop = req.body.shop_domain;
    console.log("gdpr/shop_redact", body, shop);
    return res.status(200).send({ message: "ok" });
  } catch (e) {
    const error = e as Error;
    console.error(
      `---> An error occured at /api/gdpr/shop_redact: ${error.message}`,
      error
    );
    return res.status(500).send({ error: true });
  }
};

export default withMiddleware("verifyHmac")(handler);

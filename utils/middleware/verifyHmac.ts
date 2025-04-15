import crypto from "crypto";
import shopify from "@/utils/shopify";
import { NextApiRequest, NextApiResponse } from "next";

type NextApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse
) => Promise<void>;

if (!process.env.SHOPIFY_API_SECRET) {
  throw new Error("SHOPIFY_API_SECRET is not defined");
}

/**
 * @param {import('next').NextApiRequest} req - The incoming request object.
 * @param {import('next').NextApiResponse} res - The response object.
 * @param {import('next').NextApiHandler} next - Callback to pass control to the next middleware function in the Next.js API route.
 */
const verifyHmac = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextApiHandler
) => {
  try {
    const generateHash = crypto
      .createHmac("SHA256", process.env.SHOPIFY_API_SECRET!)
      .update(JSON.stringify(req.body), "utf8")
      .digest("base64");

    const hmac = req.headers["x-shopify-hmac-sha256"] as string;

    if (shopify.auth.safeCompare(generateHash, hmac)) {
      await next(req, res);
    } else {
      return res
        .status(401)
        .send({ success: false, message: "HMAC verification failed" });
    }
  } catch (e) {
    const error = e as Error;
    console.log(`---> An error occured while verifying HMAC`, error.message);
    return res
      .status(401)
      .json({ success: false, message: "HMAC verification failed" });
  }
};

export default verifyHmac;

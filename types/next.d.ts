import { NextApiRequest } from "next";

declare module "next" {
  interface NextApiRequest {
    user_shop?: string;
  }
}

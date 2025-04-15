import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "@shopify/shopify-api";

export interface ApiRequest extends NextApiRequest {
  user_shop?: string;
  session?: Session;
}

export interface ApiResponse extends NextApiResponse {}

export type ApiHandler = (req: ApiRequest, res: ApiResponse) => Promise<void>;

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface SuccessResponse<T = any> {
  data: T;
}

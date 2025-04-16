import { verifyRequest } from "./verifyRequest";
import { verifyHmac } from "./verifyHmac";
import { verifyProxy } from "./verifyProxy";
import { verifyCheckout } from "./verifyCheckout";
import type { MiddlewareFn } from "@/types/middleware";
import { Session } from "@shopify/shopify-api";

type MiddlewareData = {
  verifyRequest: { session: Session; shop: string };
  verifyProxy: { shop: string };
  verifyHmac: { rawBody: string };
  verifyCheckout: { shop: string };
};

const middlewareMap: {
  [K in keyof MiddlewareData]: MiddlewareFn<MiddlewareData[K]>;
} = {
  verifyRequest,
  verifyProxy,
  verifyHmac,
  verifyCheckout,
} as const;

export function withMiddleware<K extends keyof MiddlewareData>(
  name: K
): (
  handler: (req: Request, data: MiddlewareData[K]) => Promise<Response>
) => (req: Request) => Promise<Response> {
  const middlewareFn = middlewareMap[name];

  return (
      handler: (req: Request, data: MiddlewareData[K]) => Promise<Response>
    ) =>
    async (req: Request): Promise<Response> => {
      const result = await middlewareFn(req);
      if (!result.success) return result.response;
      return handler(req, result.data);
    };
}

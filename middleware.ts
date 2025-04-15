/**
 * Middleware to add Content Security Policy headers to matched requests.
 */

import { NextResponse, type NextRequest } from "next/server";

export const config = {
  matcher: [
    /*
     * Exceptions:
     * /api/webhooks, /api/proxy_route, /api/gdpr, /_next,
     * /_proxy, /_auth, /_static, /_vercel, /public (/favicon.ico, etc)
     */
    "/((?!api/webhooks|api/proxy_route|api/gdpr|_next|_proxy|_auth|_static|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

/**
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} The response object with modified headers.
 */
export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // セキュリティヘッダーのみ設定
  response.headers.set(
    "Content-Security-Policy",
    "frame-ancestors https://*.myshopify.com https://admin.shopify.com;"
  );

  return response;
}

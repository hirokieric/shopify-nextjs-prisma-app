import { NextRequest } from "next/server";
import withMiddleware from "@/utils/middleware/withMiddleware";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const shop = body.shop_domain;
    console.log("gdpr/shop_redact", body, shop);

    return new Response(JSON.stringify({ message: "ok" }), { status: 200 });
  } catch (e) {
    const error = e as Error;
    console.error(
      `---> An error occurred at /api/gdpr/shop_redact: ${error.message}`,
      error
    );
    return new Response(JSON.stringify({ error: true }), { status: 500 });
  }
}

// Other HTTP methods are not allowed
export async function GET() {
  return new Response("Method not allowed", { status: 405 });
}

export async function PUT() {
  return new Response("Method not allowed", { status: 405 });
}

export async function DELETE() {
  return new Response("Method not allowed", { status: 405 });
}

export async function PATCH() {
  return new Response("Method not allowed", { status: 405 });
}

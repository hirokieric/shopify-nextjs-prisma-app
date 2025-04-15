import clientProvider from "@/utils/clientProvider";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const shop = req.headers.get("x-shopify-shop");
    if (!shop) {
      return new Response(JSON.stringify({ error: "Shop not found" }), {
        status: 400,
      });
    }

    const { client } = await clientProvider.offline.graphqlClient({
      shop,
    });

    return new Response(JSON.stringify({ content: "Proxy Be Working" }), {
      status: 200,
    });
  } catch (e) {
    const error = e as Error;
    console.error(
      `---> An error occurred at /api/proxy_route: ${error.message}`,
      error
    );
    return new Response(JSON.stringify({ error: true }), { status: 400 });
  }
}

// Other HTTP methods are not allowed
export async function POST() {
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

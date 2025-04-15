import clientProvider from "@/utils/clientProvider";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log("Request came from checkout extension");

    const shop = req.headers.get("x-shopify-shop");
    if (!shop) {
      return new Response(JSON.stringify({ error: "Shop not found" }), {
        status: 400,
      });
    }

    //Example GraphQL request
    const { client } = await clientProvider.offline.graphqlClient({
      shop,
    });

    const response = await client.request(/* GraphQL */ `
      {
        shop {
          id
        }
      }
    `);

    return new Response(JSON.stringify({ content: "Checkout Be Working" }), {
      status: 200,
    });
  } catch (e) {
    const error = e as Error;
    console.error(
      `---> An error occurred in /api/checkout: ${error.message}`,
      error
    );
    return new Response(JSON.stringify({ error: true }), { status: 403 });
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

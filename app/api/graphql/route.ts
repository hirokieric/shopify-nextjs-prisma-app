import { NextRequest } from "next/server";
import shopify from "@/utils/shopify";
import sessionHandler from "@/utils/sessionHandler";

export async function POST(req: NextRequest) {
  try {
    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: new Response(),
    });

    if (!sessionId) {
      return new Response(
        JSON.stringify({
          error: "Unauthorized",
          message: "No session ID found",
        }),
        { status: 401 }
      );
    }

    const session = await sessionHandler.loadSession(sessionId);
    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized", message: "No session found" }),
        { status: 401 }
      );
    }

    const body = await req.json();
    const response = await shopify.clients.graphqlProxy({
      session,
      rawBody: body,
    });

    return new Response(JSON.stringify(response.body), { status: 200 });
  } catch (e) {
    console.error("An error occurred at /api/graphql", e);
    return new Response(JSON.stringify(e), { status: 403 });
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

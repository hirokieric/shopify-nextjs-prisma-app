import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    return new Response(JSON.stringify({ text: "This is an example route" }), {
      status: 200,
    });
  } catch (e) {
    console.error(e);
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

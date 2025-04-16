import clientProvider from "@/utils/clientProvider";
import { withMiddleware } from "@/utils/middleware/withMiddleware";
import { Session } from "@shopify/shopify-api";

export const POST = withMiddleware("verifyRequest")(async (
  req: Request,
  { session, shop }: { session: Session; shop: string }
) => {
  console.log("🚀 ~ shop:", shop);
  console.log("🚀 ~ session:", session);
  try {
    const { client } = await clientProvider.offline.graphqlClient({
      shop,
    });
    console.log("🚀 ~ client:", client);

    const body = await req.json();
    const { input } = body;

    console.log("Request input:", JSON.stringify(input, null, 2));

    // 入力データのバリデーション
    if (
      !input.destinationLocationId ||
      !input.originLocationId ||
      !input.lineItems
    ) {
      return new Response(
        JSON.stringify({
          message: "必須フィールドが不足しています",
          required: ["destinationLocationId", "originLocationId", "lineItems"],
        }),
        { status: 400 }
      );
    }

    const mutation = `
      mutation inventoryTransferCreate($input: InventoryTransferCreateInput!) {
        inventoryTransferCreate(input: $input) {
          userErrors {
            message
            field
            code
          }
          inventoryTransfer {
            id
            name
            note
            status
            tags
            totalQuantity
          }
        }
      }
    `;

    try {
      const response = await client.request(mutation, {
        variables: {
          input: {
            ...input,
            dateCreated: new Date().toISOString().split(".")[0] + "Z",
          },
        },
      });

      console.log("GraphQL Response:", JSON.stringify(response, null, 2));

      const result = response as {
        inventoryTransferCreate?: {
          userErrors?: Array<{
            message: string;
            field: string[];
            code: string;
          }>;
          inventoryTransfer?: {
            id: string;
            name: string;
            note: string;
            status: string;
            tags: string[];
            totalQuantity: number;
          };
        };
      };

      if (!result.inventoryTransferCreate) {
        return new Response(
          JSON.stringify({
            message: "在庫移動の作成に失敗しました",
            errors: [{ message: "予期せぬレスポンス形式です" }],
          }),
          { status: 500 }
        );
      }

      const userErrors = result.inventoryTransferCreate.userErrors;
      if (userErrors && userErrors.length > 0) {
        return new Response(
          JSON.stringify({
            message: "在庫移動の作成に失敗しました",
            errors: userErrors,
          }),
          { status: 400 }
        );
      }

      return new Response(JSON.stringify(result), { status: 200 });
    } catch (e: any) {
      console.error("GraphQL Error:", e);
      console.error("Error Response:", e.response);
      console.error("Error Body:", e.body);

      const errorMessage =
        e instanceof Error ? e.message : "Unknown error occurred";
      const errorResponse = {
        message: errorMessage,
        requestId: e?.response?.headers?.get("x-request-id"),
        status: e?.response?.status,
        statusText: e?.response?.statusText,
        body: e?.response?.body,
        graphQLErrors: e?.response?.body?.errors,
      };

      return new Response(JSON.stringify(errorResponse), {
        status: e?.response?.status || 500,
      });
    }
  } catch (e: any) {
    console.error("An error occurred at /api/apps/test", e);
    const errorMessage =
      e instanceof Error ? e.message : "Unknown error occurred";
    const errorResponse = {
      message: errorMessage,
      requestId: e?.response?.headers?.get("x-request-id"),
      status: e?.response?.status,
      statusText: e?.response?.statusText,
      body: e?.response?.body,
    };
    return new Response(JSON.stringify(errorResponse), { status: 403 });
  }
});

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

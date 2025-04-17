//This is the same as `pages/api/index.js`.

import withMiddleware from "@/utils/middleware/withMiddleware";
import { ApiRequest, ApiResponse } from "@/types/api";
import clientProvider from "@/utils/clientProvider";
/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req: ApiRequest, res: ApiResponse) => {
  if (req.method === "GET") {
    return res
      .status(200)
      .send({ text: "This text is coming from `/api/apps/debug route`" });
  }

  if (req.method === "POST") {
    try {
      console.log("POSTリクエストを受信しました");
      const { client } = await clientProvider.offline.graphqlClient({
        shop: req.user_shop,
      });
      console.log("GraphQLクライアントの初期化が完了しました");

      const input = {
        dateCreated: new Date().toISOString(),
        destinationLocationId: "gid://shopify/Location/97834762514",
        lineItems: [
          {
            inventoryItemId: "gid://shopify/InventoryItem/52828230811922",
            quantity: 1,
          },
        ],
        note: "test note",
        originLocationId: "gid://shopify/Location/97834828050",
        referenceName: "test reference",
        tags: ["mytag"],
      };

      console.log("リクエスト入力:", JSON.stringify(input, null, 2));

      const response = await client.request(
        /* GraphQL */ `
          mutation inventoryTransferCreate(
            $input: InventoryTransferCreateInput!
          ) {
            inventoryTransferCreate(input: $input) {
              inventoryTransfer {
                name
                note
                status
                tags
                totalQuantity
              }
              userErrors {
                code
                field
                message
              }
            }
          }
        `,
        {
          variables: { input },
        }
      );
      console.log("GraphQLレスポンス:", JSON.stringify(response, null, 2));

      if (response.errors) {
        console.error("GraphQLエラー:", response.errors);
        return res.status(400).json({
          error: "GraphQL Error",
          details: response.errors,
        });
      }

      if (response.data?.inventoryTransferCreate?.userErrors?.length > 0) {
        console.error(
          "ユーザーエラー:",
          response.data.inventoryTransferCreate.userErrors
        );
        return res.status(400).json({
          error: "User Error",
          details: response.data.inventoryTransferCreate.userErrors,
        });
      }

      return res.status(200).json(response.data);
    } catch (error: any) {
      console.error("エラーが発生しました:", error);
      return res
        .status(500)
        .json({ error: "Internal Server Error", details: error.message });
    }
  }

  return res.status(400).send({ text: "Bad request" });
};

export default withMiddleware("verifyRequest")(handler);

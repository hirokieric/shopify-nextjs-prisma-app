import withMiddleware from "@/utils/middleware/withMiddleware";
import { ApiRequest, ApiResponse } from "@/types/api";
import clientProvider from "@/utils/clientProvider";
/**
 * @param {import("next").NextApiRequest} req - The HTTP request object.
 * @param {import("next").NextApiResponse} res - The HTTP response object.
 */
const handler = async (req: ApiRequest, res: ApiResponse) => {
  if (req.method !== "GET" && req.method !== "POST") {
    //GET, POST, PUT, DELETE
    console.log("Serve this only if the request method is GET");
    return res.status(405).send({ error: true });
  }

  try {
    if (req.method === "GET") {
      return res.status(200).send({ text: "This is an example route" });
    } else if (req.method === "POST") {
      const { client } = await clientProvider.offline.graphqlClient({
        shop: req.user_shop,
      });

      const response = await client.request(
        /* GraphQL */ `
          mutation MyMutation($input: InventoryTransferCreateInput!) {
            inventoryTransferCreate(input: $input) {
              userErrors {
                message
                field
                code
              }
              inventoryTransfer {
                name
                note
                status
                tags
                totalQuantity
              }
            }
          }
        `,
        {
          input: {
            destinationLocationId: "gid://shopify/Location/97834762514",
            lineItems: [
              {
                inventoryItemId: "gid://shopify/InventoryItem/50868311163154",
                quantity: 1,
              },
            ],
            note: "test note",
            originLocationId: "gid://shopify/Location/97834828050",
            referenceName: "wtf reference",
            tags: ["mytag"],
          },
        }
      );
    }
  } catch (e) {
    const error = e as Error;
    console.error(
      `---> An error occured at /api/apps: ${error.message}`,
      error
    );
    return res.status(403).send({ error: true });
  }
};

export default withMiddleware("verifyRequest")(handler);

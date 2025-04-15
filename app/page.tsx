"use client";

import {
  BlockStack,
  Button,
  Card,
  InlineStack,
  Layout,
  Page as PolarisPage,
  Text,
} from "@shopify/polaris";
import { ExternalIcon } from "@shopify/polaris-icons";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const router = useRouter();
  const isDev = process.env.NODE_ENV === "development";

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shop = window.shopify?.config?.shop;
      if (!shop) {
        router.push("/error");
      }
    }
  }, []);

  return (
    <PolarisPage title="Home">
      <Layout>
        <Layout.Section variant="oneHalf">
          <Card>
            <BlockStack gap="200">
              <Text as="h2" variant="headingMd">
                App Bridge CDN
              </Text>
              <Text as="p">AppBridge has moved from an npm package to CDN</Text>
              <InlineStack wrap={false} align="end">
                <Button
                  variant="primary"
                  external
                  icon={ExternalIcon}
                  onClick={() => {
                    open(
                      "https://shopify.dev/docs/api/app-bridge-library/reference",
                      "_blank"
                    );
                  }}
                >
                  Explore
                </Button>
              </InlineStack>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </PolarisPage>
  );
}

"use client";

import { Banner, Page } from "@shopify/polaris";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <Page>
      <Banner
        title="エラーが発生しました"
        tone="critical"
        onDismiss={() => reset()}
      >
        <p>{error.message}</p>
      </Banner>
    </Page>
  );
}

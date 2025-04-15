"use client";

import { Loading } from "@shopify/polaris";

export default function LoadingPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Loading />
    </div>
  );
}

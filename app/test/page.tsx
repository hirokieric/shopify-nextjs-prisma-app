"use client";

import { useState } from "react";
import { Page, Layout, Card, Button, Text } from "@shopify/polaris";

export default function TestPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const handleTest = async () => {
    setIsLoading(true);
    addLog("在庫移動のテストを開始します...");

    try {
      const response = await fetch("/api/apps/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            dateCreated: new Date().toISOString().split(".")[0] + "Z",
            destinationLocationId: "gid://shopify/Location/97834828050",
            lineItems: [
              {
                inventoryItemId: "gid://shopify/InventoryItem/50868311163154",
                quantity: 1,
              },
            ],
            note: "テスト用の在庫移動",
            originLocationId: "gid://shopify/Location/97834762514",
            referenceName: "TEST-001",
            tags: ["test", "transfer"],
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "APIリクエストに失敗しました");
      }

      const data = await response.json();
      addLog(`レスポンス: ${JSON.stringify(data, null, 2)}`);
    } catch (error) {
      addLog(`エラーが発生しました: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page
      title="在庫移動テスト"
      primaryAction={
        <Button variant="primary" onClick={handleTest} loading={isLoading}>
          在庫移動テストを実行
        </Button>
      }
    >
      <Layout>
        <Layout.Section>
          <Card>
            <div style={{ padding: "16px" }}>
              <Text variant="headingMd" as="h2">
                ログ
              </Text>
            </div>
            <div
              style={{
                height: "400px",
                overflowY: "auto",
                backgroundColor: "#f6f6f7",
                padding: "16px",
              }}
            >
              {logs.map((log, index) => (
                <Text key={index} as="p" variant="bodyMd">
                  {log}
                </Text>
              ))}
            </div>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

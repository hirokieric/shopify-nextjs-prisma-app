import { Head, Html, Main, NextScript } from "next/document";
import { DocumentContext, DocumentInitialProps } from "next/document";

export default function Document() {
  const HtmlComponent = Html as any;
  const HeadComponent = Head as any;
  const MainComponent = Main as any;
  const NextScriptComponent = NextScript as any;
  return (
    <HtmlComponent lang="en">
      <HeadComponent>
        <script
          src={`https://cdn.shopify.com/shopifycloud/app-bridge.js?apiKey=${process.env.CONFIG_SHOPIFY_API_KEY}`}
        ></script>
      </HeadComponent>
      <body>
        <MainComponent />
        <NextScriptComponent />
      </body>
    </HtmlComponent>
  );
}

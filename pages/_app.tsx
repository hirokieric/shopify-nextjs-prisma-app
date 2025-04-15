import AppBridgeProvider from "@/components/providers/AppBridgeProvider";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import Link from "next/link";
import { AppProps } from "next/app";
import { NextPage } from "next";
import { FC } from "react";

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  const ComponentWithProps = Component as any;
  const LinkComponent = Link as any;
  return (
    <>
      <PolarisProvider i18n={translations}>
        <AppBridgeProvider>
          <nav>
            <LinkComponent href="/debug">Debug Cards</LinkComponent>
          </nav>
          <ComponentWithProps {...pageProps} />
        </AppBridgeProvider>
      </PolarisProvider>
    </>
  );
};

export default App;

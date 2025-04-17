import AppBridgeProvider from "@/components/providers/AppBridgeProvider";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import Link from "next/link";
import { AppProps } from "next/app";
import { NextPage } from "next";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "ui-nav-menu": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      >;
    }
  }
}

const App: NextPage<AppProps> = ({ Component, pageProps }) => {
  const ComponentWithProps = Component as any;
  const LinkComponent = Link as any;
  return (
    <>
      <PolarisProvider i18n={translations}>
        <AppBridgeProvider>
          <ui-nav-menu>
            <LinkComponent href="/debug">Debug Cards</LinkComponent>
          </ui-nav-menu>
          <ComponentWithProps {...pageProps} />
        </AppBridgeProvider>
      </PolarisProvider>
    </>
  );
};

export default App;

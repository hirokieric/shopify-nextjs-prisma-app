"use client";

import { Frame, AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import { FC, ReactNode } from "react";
import Link from "next/link";
import AppBridgeProvider from "@/components/providers/AppBridgeProvider";

interface ClientLayoutProps {
  children: ReactNode;
}

const ClientLayout: FC<ClientLayoutProps> = ({ children }) => {
  return (
    <PolarisProvider i18n={translations}>
      <AppBridgeProvider>
        <ui-nav-menu>
          <Link href="/debug">Debug Cards</Link>
        </ui-nav-menu>
        <Frame>{children}</Frame>
      </AppBridgeProvider>
    </PolarisProvider>
  );
};

export default ClientLayout;

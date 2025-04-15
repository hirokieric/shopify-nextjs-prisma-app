import { FC, ReactNode } from "react";
import ClientLayout from "./ClientLayout";
interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <script
          src={`https://cdn.shopify.com/shopifycloud/app-bridge.js?apiKey=${process.env.CONFIG_SHOPIFY_API_KEY}`}
        ></script>
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
};

export default RootLayout;

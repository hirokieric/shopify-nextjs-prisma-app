declare global {
  interface Window {
    shopify?: {
      resourcePicker: (options: {
        type: string;
        query: string;
        filter: {
          hidden: boolean;
          variants: boolean;
        };
        action: string;
        multiple: boolean;
      }) => Promise<any>;
      scopes: {
        query: () => Promise<{
          granted: string[];
          required: string[];
          optional: string[];
        }>;
        request: (scopes: string[]) => Promise<{ result: string }>;
      };
    };
  }
}

export {};

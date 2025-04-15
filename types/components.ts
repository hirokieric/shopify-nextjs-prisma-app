import { ReactNode } from "react";

export interface AppBridgeProviderProps {
  children: ReactNode;
}

export interface DataCardProps {
  method: string;
  url: string;
  data: any;
  onRefetch: () => void;
}

export interface ResourcePickerProps {
  onSelection: (resources: any) => void;
}

export interface BillingTableProps {
  subscriptions: any[];
  onManage: (subscriptionId: string) => void;
}

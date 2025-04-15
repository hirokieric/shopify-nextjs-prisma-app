export interface BillingPlan {
  name: string;
  price: number;
  interval: string;
  trialDays?: number;
}

export interface BillingSubscription {
  id: string;
  name: string;
  status: string;
  test: boolean;
  lineItems: {
    plan: {
      pricingDetails: {
        price: number;
      };
    };
  }[];
}

export interface BillingTableProps {
  subscriptions: BillingSubscription[];
  onManage: (subscriptionId: string) => void;
}

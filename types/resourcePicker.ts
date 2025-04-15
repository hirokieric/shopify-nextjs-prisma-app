export interface ResourcePickerOptions {
  type: "product" | "collection" | "order" | "customer";
  action: "select" | "add" | "remove";
  multiple?: boolean;
  filter?: string;
  query?: string;
}

export interface ResourcePickerResult {
  selection: any[];
}

export interface ResourcePickerProps {
  onSelection: (resources: ResourcePickerResult) => void;
  options?: ResourcePickerOptions;
}

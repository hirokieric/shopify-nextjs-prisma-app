export interface ScopeResult {
  granted: string[];
  required: string[];
  optional: string[];
}

export interface ScopeRequestOptions {
  scopes: string[];
  shop: string;
}

export interface ScopeTableProps {
  scopes: ScopeResult;
  onRequest: (scopes: string[]) => Promise<void>;
}

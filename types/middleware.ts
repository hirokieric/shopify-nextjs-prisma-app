export type MiddlewareResult<T = void> =
  | { success: true; data: T }
  | { success: false; response: Response };

export type MiddlewareFn<T = void> = (
  req: Request
) => Promise<MiddlewareResult<T>>;

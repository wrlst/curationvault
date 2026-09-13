export type Database = {
  prepare(query: string): {
    bind(...values: (string | number | null)[]): {
      first<T>(): Promise<T | null>;
      all<T>(): Promise<{ results: T[] }>;
      run(): Promise<unknown>;
    };
  };
};

export type Env = {
  DB?: Database;
  ADMIN_PASSWORD?: string;
  ASSETS?: { fetch(request: Request | string | URL): Promise<Response> };
};

export type Context<Params extends Record<string, string> = Record<string, string>> = {
  request: Request;
  env: Env;
  params: Params;
};

export function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
  });
}

export function sameOrigin(request: Request) {
  const origin = request.headers.get("Origin");
  return origin === new URL(request.url).origin;
}

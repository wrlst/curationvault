import { json, sameOrigin, type Context } from "../../_lib/types";

export function onRequestPost({ request }: Context) {
  if (!sameOrigin(request)) return json({ error: "Invalid request." }, 403);
  const response = json({ ok: true });
  response.headers.set("Set-Cookie", "cv_admin=; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=0; Secure");
  return response;
}

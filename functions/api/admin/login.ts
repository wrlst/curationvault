import { isConfigured, passwordMatches, sessionCookie } from "../../_lib/auth";
import { json, sameOrigin, type Context } from "../../_lib/types";

const windowSeconds = 15 * 60;
const maxAttempts = 5;

export async function onRequestPost({ request, env }: Context) {
  if (!isConfigured(env)) return json({ error: "Admin is not configured." }, 503);
  if (!sameOrigin(request) || !request.headers.get("Content-Type")?.startsWith("application/json")) {
    return json({ error: "Invalid request." }, 403);
  }

  const body = await request.text();
  if (body.length > 1024) return json({ error: "Invalid request." }, 400);
  let password: unknown;
  try {
    password = (JSON.parse(body) as { password?: unknown }).password;
  } catch {
    return json({ error: "Invalid request." }, 400);
  }
  if (typeof password !== "string") return json({ error: "Invalid request." }, 400);

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const now = Math.floor(Date.now() / 1000);
  const attempt = await env.DB!.prepare("SELECT attempts, window_start FROM admin_login_attempts WHERE ip = ?1")
    .bind(ip).first<{ attempts: number; window_start: number }>();
  if (attempt && now - attempt.window_start < windowSeconds && attempt.attempts >= maxAttempts) {
    return json({ error: "Too many attempts. Try again in 15 minutes." }, 429);
  }

  if (!(await passwordMatches(password, env.ADMIN_PASSWORD!))) {
    const attempts = attempt && now - attempt.window_start < windowSeconds ? attempt.attempts + 1 : 1;
    const windowStart = attempt && now - attempt.window_start < windowSeconds ? attempt.window_start : now;
    await env.DB!.prepare("INSERT INTO admin_login_attempts (ip, attempts, window_start) VALUES (?1, ?2, ?3) ON CONFLICT(ip) DO UPDATE SET attempts = excluded.attempts, window_start = excluded.window_start")
      .bind(ip, attempts, windowStart).run();
    return json({ error: "Incorrect password." }, 401);
  }

  await env.DB!.prepare("DELETE FROM admin_login_attempts WHERE ip = ?1").bind(ip).run();
  const response = json({ ok: true });
  response.headers.set("Set-Cookie", await sessionCookie(env.ADMIN_PASSWORD!, request));
  return response;
}

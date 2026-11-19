// Password gate for the private stats dashboard. Username is ignored; the password is STATS_PASSWORD.
export function proxy(req: Request) {
  const pass = process.env.STATS_PASSWORD;
  if (!pass) return new Response("Not found", { status: 404 });

  const auth = req.headers.get("authorization") ?? "";
  let given = "";
  try {
    given = auth.startsWith("Basic ") ? atob(auth.slice(6)).split(":").slice(1).join(":") : "";
  } catch {}
  // Constant-time compare so response timing does not leak the password.
  let diff = given.length ^ pass.length;
  for (let i = 0; i < pass.length; i++) diff |= pass.charCodeAt(i) ^ (given.charCodeAt(i) || 0);
  if (diff === 0) return;

  return new Response("Sign in to view stats", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="stats", charset="UTF-8"', "Cache-Control": "no-store" },
  });
}

export const config = { matcher: ["/stats", "/stats/:path*"] };

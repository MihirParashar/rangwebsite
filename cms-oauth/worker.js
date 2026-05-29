// GitHub OAuth proxy for Decap CMS, running on Cloudflare Workers.
// It exists only to complete the GitHub login handshake, which needs the
// OAuth Client Secret server-side (a static site can't hold a secret).
//
// Required secrets (set with `wrangler secret put ...`):
//   GITHUB_CLIENT_ID      - from your GitHub OAuth App
//   GITHUB_CLIENT_SECRET  - from your GitHub OAuth App

const GITHUB_AUTHORIZE = "https://github.com/login/oauth/authorize";
const GITHUB_TOKEN = "https://github.com/login/oauth/access_token";
const PROVIDER = "github";

function postMessagePage(status, payload) {
  // Decap listens for a message in the exact form:
  //   authorization:github:success:{"token":"...","provider":"github"}
  const data = JSON.stringify(payload);
  return `<!doctype html>
<html><head><meta charset="utf-8"><title>Authorizing…</title></head>
<body>
<script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage('authorization:${PROVIDER}:${status}:${data}', e.origin);
    window.removeEventListener('message', receiveMessage, false);
  }
  window.addEventListener('message', receiveMessage, false);
  window.opener.postMessage('authorizing:${PROVIDER}', '*');
})();
</script>
<p>Authorizing… you can close this window.</p>
</body></html>`;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname, searchParams } = url;

    if (pathname === "/") {
      return new Response("Decap CMS GitHub OAuth proxy is running.", {
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Step 1: send the user to GitHub to authorize.
    if (pathname === "/auth") {
      const params = new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID,
        redirect_uri: `${url.origin}/callback`,
        scope: searchParams.get("scope") || "repo",
        state: crypto.randomUUID(),
      });
      return Response.redirect(`${GITHUB_AUTHORIZE}?${params.toString()}`, 302);
    }

    // Step 2: GitHub redirects back here with a code; exchange it for a token.
    if (pathname === "/callback") {
      const code = searchParams.get("code");
      if (!code) return new Response("Missing ?code", { status: 400 });

      const res = await fetch(GITHUB_TOKEN, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          client_id: env.GITHUB_CLIENT_ID,
          client_secret: env.GITHUB_CLIENT_SECRET,
          code,
        }),
      });
      const result = await res.json();

      const html = result.access_token
        ? postMessagePage("success", { token: result.access_token, provider: PROVIDER })
        : postMessagePage("error", { error: result.error || "Could not get token" });

      return new Response(html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    return new Response("Not found", { status: 404 });
  },
};

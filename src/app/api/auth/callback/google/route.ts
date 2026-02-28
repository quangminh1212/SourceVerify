import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

/**
 * OAuth 2.0 Implicit Flow callback.
 * Google redirects here with id_token in the URL hash (#id_token=...).
 * Since hash fragments are not sent to the server, we return HTML
 * that reads the hash client-side, sends it to the opener via postMessage,
 * then closes the popup.
 */
export async function GET(req: NextRequest) {
    const origin = req.nextUrl.origin;

    const html = `<!DOCTYPE html>
<html>
<head><title>Signing in...</title></head>
<body>
<p style="font-family:system-ui;text-align:center;margin-top:40vh;color:#666">Signing in, please wait...</p>
<script>
(function() {
    try {
        var hash = window.location.hash.substring(1);
        var params = new URLSearchParams(hash);
        var idToken = params.get("id_token");
        if (idToken && window.opener) {
            window.opener.postMessage({ type: "google-auth", id_token: idToken }, "${origin}");
        }
    } catch(e) {
        console.error("Auth callback error:", e);
    }
    setTimeout(function() { window.close(); }, 500);
})();
</script>
</body>
</html>`;

    return new NextResponse(html, {
        headers: { "Content-Type": "text/html; charset=utf-8" },
    });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. Handle Metadata Requests
    if (url.searchParams.get("metadata") === "true") {
      const metadata = {
        ip: request.headers.get("cf-connecting-ip") || "Unknown",
        country: request.headers.get("cf-ipcountry") || "Unknown",
        ray: request.headers.get("cf-ray") || "Unknown",
        securityHeaders: "Strict-Transport-Security\nContent-Security-Policy\nX-Frame-Options\nX-Content-Type-Options"
      };

      return new Response(JSON.stringify(metadata), {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "https://secure.alexsanchez.site", //alow fetch
          "Access-Control-Allow-Methods": "GET"
        }
      });
    }

    // 2. Handle Normal Site Traffic
    const response = await fetch(request);
    const newHeaders = new Headers(response.headers);

    // Hardening Headers
    newHeaders.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    newHeaders.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://ajax.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; upgrade-insecure-requests");
    newHeaders.set("X-Frame-Options", "SAMEORIGIN");
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    newHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    newHeaders.set("Server", "Cloudflare-Edge-Shield");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }
};
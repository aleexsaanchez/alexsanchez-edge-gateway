export default {
  async fetch(request, env) {
    const response = await fetch(request);
    const newHeaders = new Headers(response.headers);

    // 1. Strict-Transport-Security (Required for A+)
    newHeaders.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

    // 2. Simplified Content-Security-Policy
    // Note: No trailing semicolon at the very end, and 'self' must have single quotes.
    newHeaders.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://ajax.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; upgrade-insecure-requests");

    // 3. X-Frame-Options
    newHeaders.set("X-Frame-Options", "SAMEORIGIN");

    // 4. Permissions-Policy
    newHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");

    // 5. X-Content-Type-Options
    newHeaders.set("X-Content-Type-Options", "nosniff");

    // 6. Referrer-Policy
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // 7. Remove identifying headers
    newHeaders.delete("x-powered-by");
    newHeaders.set("Server", "Cloudflare");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
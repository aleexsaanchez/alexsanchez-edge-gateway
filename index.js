export default {
  async fetch(request, env) {
    const response = await fetch(request);

    // Create a new response so we can modify headers (they are immutable by default)
    const newHeaders = new Headers(response.headers);

    // 1. HSTS - Tells browsers to only use HTTPS (Required for A+)
    newHeaders.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");

    // 2. CSP - The most important one for security. 
    // This allows scripts/styles from your own site ('self') and Cloudflare's helper scripts.
    newHeaders.set("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline' https://ajax.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; upgrade-insecure-requests;");

    // 3. X-Frame-Options - Prevents clickjacking
    newHeaders.set("X-Frame-Options", "SAMEORIGIN");

    // 4. Permissions-Policy - Disables features like camera/microphone unless you need them
    newHeaders.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");

    // 5. X-Content-Type-Options - Prevents MIME-sniffing
    newHeaders.set("X-Content-Type-Options", "nosniff");

    // 6. Referrer-Policy - Protects privacy when clicking links
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // 7. Cleanup - Remove headers that reveal your tech stack
    newHeaders.delete("x-powered-by");
    newHeaders.set("Server", "Cloudflare"); 

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
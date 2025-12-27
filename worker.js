export default {
  async fetch(request, env) {
    const response = await fetch(request);
    const newHeaders = new Headers(response.headers);

    // Security Hardening
    newHeaders.set("X-Frame-Options", "DENY");
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");
    newHeaders.set("Content-Security-Policy", "upgrade-insecure-requests");
    
    // Remove headers that leak info
    newHeaders.delete("x-powered-by");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  },
};
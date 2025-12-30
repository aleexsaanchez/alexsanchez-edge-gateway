# Security Validation & Attack Mitigation

This document validates the security controls protecting [alexsanchez.site](http://alexsanchez.site) and its related subdomains. The goal is to demonstrate how an edge-first security architecture actively enforces identity, reduces attack surface, and mitigates common real-world threats before they reach application logic.

---

![1.1.1.png](1.1.1.png)

## Zero Trust & Identity Enforcement

Application access is enforced at the edge using Cloudflare Access, ensuring that identity verification occurs before any request reaches application infrastructure. This removes anonymous exposure entirely and shifts authentication responsibility away from the origin.

![1.1.2.png](1.1.2.png)

Unauthenticated requests are intercepted at the edge and redirected to the Access login flow. The origin is never exposed to anonymous traffic. Authentication is validated through both GitHub OAuth and one-time PIN flows, demonstrating support for federated identity and fallback access.

![1.2.1.png](1.2.1.png)

![1.3.3.png](1.3.3.png)

Evidence includes unauthenticated access redirection, Access login flow, and successful authentication via both supported methods.

![1.2.2.png](1.2.2.png)

## Web Application Firewall

The Web Application Firewall proactively inspects all traffic at the edge, mitigating attacks before they reach application logic.

### XSS Mitigation

The application is protected by Cloudflare’s managed WAF rules, which actively inspect inbound requests for malicious payloads.

![2.1.1.png](2.1.1.png)

Reflected XSS attempts delivered through query parameters are intercepted by Cloudflare’s managed WAF ruleset. Malicious payloads are identified and blocked at the edge, with enforcement confirmed through Security Events showing the triggered rule, action taken, and associated Ray ID.

![2.1.2.png](2.1.2.png)

### Path Scanning & Reconnaissance Protection

Automated scanners commonly probe known administrative paths regardless of application stack.

![2.3.2.png](2.3.2.png)

Requests to common sensitive paths (e.g., `/wp-admin`) are blocked immediately at the edge. The browser receives a block page, and the event is logged in Cloudflare with full request metadata.

![2.3.3.png](2.3.3.png)

### Non-Browser User-Agent Filtering

A dedicated rule filters out non-browser User-Agents to limit automated and scripted traffic.

![3.1.1.png](3.1.1.png)

Requests issued via curl without a legitimate browser signature were blocked and logged. This helps ensure that the application primarily serves real browser traffic while reducing automated probing.

![3.1.2.png](3.1.2.png)

### **Malformed / Unauthorized Host Header Blocking**

The edge enforces strict request integrity by validating the `Host` header against the expected domain. Requests attempting to override or inject an unauthorized host value are rejected before reaching the origin, preventing common abuse scenarios such as cache poisoning, virtual host confusion, and password reset manipulation.

![Screenshot 2025-12-30 003733.png](Screenshot_2025-12-30_003733.png)

### IP Reputation & Risk-Based Challenges

Traffic from IPs classified as high risk is handled using a challenge-based approach rather than an immediate block.

![image.png](image.png)

High-risk requests are presented with a challenge page, allowing legitimate users to pass while deterring automated abuse. Corresponding events confirm IP reputation scoring and challenge enforcement.

![image.png](image%201.png)

## Edge Security Enforcement via Cloudflare Workers

A globally deployed Cloudflare Worker acts as a dedicated edge security enforcement layer. Rather than trusting application defaults, critical browser-facing security controls are enforced uniformly at the edge, guaranteeing consistent behavior regardless of origin implementation details.

This guarantees that browser-side protections such as HTTPS enforcement, script execution restrictions, clickjacking prevention, and feature isolation remain consistently applied regardless of origin behavior or future application changes.

Raw HTTP inspection using `curl` confirms that these headers are present at the protocol level, demonstrating that enforcement occurs at the edge rather than within frontend logic.

![image.png](image%202.png)

In addition to response hardening, the Worker exposes a controlled metadata endpoint used by the protected dashboard. This endpoint returns sanitized request context (IP, country, Ray ID) as seen by Cloudflare, providing live visibility into edge processing while enforcing strict cross-origin access controls.

---

## Security Posture Summary

This deployment demonstrates a layered, edge-first security model:

- Identity is enforced before application access
- Common web attacks are blocked automatically
- Reconnaissance and automation are filtered early
- Risky traffic is challenged rather than trusted

All controls are validated through direct testing, with observable enforcement and logged security events confirming correct behavior.
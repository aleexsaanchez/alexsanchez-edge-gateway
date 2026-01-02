# ⚙️ Security Controls & Design Rationale

This document outlines the strategic reasoning behind the security layers implemented for `alexsanchez.site`. The architecture follows a **Defense-in-Depth** strategy, where each layer is designed to fail safely without compromising the integrity of the entire system.

---

## 🛂 1. Identity-First Architecture (Zero Trust)
**Control:** Cloudflare Access (ZTNA) replacing traditional VPN/IP-based whitelisting.

**The Rationale:**
* **Reduced Attack Surface:** Unlike a VPN that grants access to a network, Zero Trust grants access to a specific application. This prevents "Lateral Movement"—if one part of the system is breached, the rest remains hidden.
* **Continuous Authentication:** The "Bouncer" at the edge evaluates every single request. Even with a valid session, the system continuously verifies identity before allowing traffic through.
* **Identity Federation:** By integrating GitHub OAuth, we offload the risk of password management to a world-class identity provider while maintaining a secondary One-Time PIN (OTP) flow for guest auditors.

---

## 🛡️ 2. Web Application Firewall (WAF)
I utilized the full capacity of the Cloudflare Free Tier (5/5 rules) to implement a "Negative Security Model"—blocking known malicious behavior before it reaches the origin.

| Rule Name | Logic / Selector | Security Purpose (The "Why") |
| :--- | :--- | :--- |
| **1. Reconnaissance Block** | `uri.path contains "/.env"` or `"/wp-admin"` | **Information Disclosure Prevention.** Stops automated scanners from finding configuration files or admin panels. |
| **2. SQL Injection (SQLi)** | `query contains "union select"` or `"or 1=1"` | **Data Integrity.** Identifies and challenges database exfiltration attempts at the protocol level. |
| **3. XSS Filter** | `query contains "<script>"` | **Client-Side Protection.** Identifies malicious script tags in URLs to protect visitor sessions from Cross-Site Scripting. |
| **4. Bot & CLI Filtering** | `user_agent contains "curl"` or `"python"` | **Noise Reduction.** Filters out automated scripts and scrapers, ensuring resources are reserved for legitimate human users. |
| **5. Threat Score Intel** | `cf.threat_score gt 10` | **Proactive Defense.** Challenges IPs with a known history of malicious activity across the global Cloudflare network. |



---

## ⚡ 3. Programmable Hardening (Cloudflare Workers)
**Control:** Edge-based Header Injection and Masking.

**The Rationale:**
* **Security Header Consistency:** By injecting `Content-Security-Policy` (CSP) and `HSTS` at the edge, we guarantee security enforcement even if the backend application is updated or misconfigured.
* **Anti-Fingerprinting:** We proactively remove or override the `Server` header. This prevents attackers from identifying the underlying technology stack, making it much harder to target specific vulnerabilities.
* **Clickjacking Protection:** Enforcing `X-Frame-Options: SAMEORIGIN` ensures the site cannot be embedded in malicious iFrames.

---

## 🔍 4. Observability & Verification Logic
**Control:** Edge Diagnostics Endpoint (`/?metadata=true`).

**The Rationale:**
* **Proof of Execution:** In a serverless environment, visibility is key. This diagnostic tool provides absolute proof that our security logic is executing at the Cloudflare Edge by surfacing live `Ray ID` and `Country` data.
* **Identity Transparency:** This endpoint verifies that identity data is successfully "propagating" from the Zero Trust bouncer to the final application.

---

## 🎓 Lessons Learned & Professional Growth

This project marked a significant transition from building applications to **architecting and securing** them. As this was my first time managing the full production lifecycle, several key insights were gained:

### 🌐 DNS, SSL, and the "Handshake"
Previously, DNS and SSL were abstract concepts. This project made them tangible. Setting up **CNAME flattening** and configuring **SSL/TLS Full Mode** taught me how traffic is encrypted and routed globally. Seeing the "Locked" padlock icon was a validation of the underlying protocols I had studied.

### 🔑 The Zero Trust Paradigm Shift
The biggest "lightbulb moment" was realizing that **identity is the new perimeter**. Troubleshooting the One-Time PIN delivery (specifically with encrypted providers like Proton Mail) highlighted the real-world complexities of transactional email and the importance of having redundant Identity Providers (like GitHub OAuth).

### 🛠️ Troubleshooting the "Source of Truth"
When security headers didn't appear in browser-based scanners, I learned to look deeper. Using **Command Line tools like `curl -I`** taught me about **Edge Caching** and how to verify security at the protocol level rather than relying on cached browser views.

### 🎯 Final Reflection
Seeing the Cloudflare logs catch a simulated SQL injection attempt made months of theoretical study feel real. This project proved that security isn't a "plugin" added at the end; it is a **continuous layer of logic** that exists between the user and the code.

---

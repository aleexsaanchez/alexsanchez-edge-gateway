# 🔐 Cloudflare Zero Trust Edge Security Stack

![Cloudflare](https://img.shields.io/badge/Cloudflare-Edge%20Security-orange)
![Zero Trust](https://img.shields.io/badge/Security-Zero%20Trust-blue)
![Serverless](https://img.shields.io/badge/Architecture-Serverless-green)
![Status](https://img.shields.io/badge/Status-Production--Style-success)

**Author:** Alex Sanchez  
**Domain:** `alexsanchez.site`

---

> **TL;DR**  
> This repository documents a **production-style Zero Trust security architecture** built entirely on Cloudflare’s edge.  
> Identity, traffic inspection, and security enforcement happen **before application code executes** — without traditional servers.

---

## 🧠 Project Overview

This project uses **Cloudflare as a global security control plane** to protect both:

- A **public-facing site**
- A **restricted internal dashboard**

All security decisions are enforced at the edge using:
- Zero Trust access
- Web Application Firewall (WAF)
- Bot & threat intelligence
- Edge-executed logic via Cloudflare Workers

🎯 **Goal:** Demonstrate real-world security engineering, not just configuration.

---

## 🏗️ High-Level Architecture

> All traffic enters through Cloudflare’s Anycast network, where security is enforced *before* reaching the application.


📌 **No origin servers are exposed**, dramatically reducing attack surface.

---

## 📦 Repository Purpose

This repository represents the **security control plane** of the system.

| Component | Purpose |
|--------|--------|
| Cloudflare Worker | Edge security logic & headers |
| Documentation | Architecture, controls, validation |
| Metadata API | Proof of edge execution |

🧩 Other repositories (public site & secure dashboard) are **applications protected by this stack**.

---

## 🔑 Core Security Layers

### 🛂 Zero Trust & Identity
- Cloudflare Access enforcing **identity-aware access**
- GitHub OAuth as the primary Identity Provider
- Email-restricted internal access
- OTP-based guest access for recruiters
- JWT validation verified in protected dashboard

---

### ⚙️ Edge Security Logic (Workers)
- Globally deployed Cloudflare Worker
- Dynamic injection of security headers:
  - `Strict-Transport-Security`
  - `Content-Security-Policy`
  - `X-Frame-Options`
  - `Permissions-Policy`
- Custom edge endpoint:
  - `/?metadata=true` → live request metadata (IP, country, Ray ID)
- Strict CORS enforcement between subdomains

---

### 🛡️ WAF & Threat Mitigation
- Custom WAF rules protecting against:
  - XSS & SQL injection patterns
  - Sensitive path scanning (`.env`, `/wp-admin`)
  - Automated bots & scrapers
  - Abuse & rate-based attacks
  - High-risk IPs (threat score intelligence)
- Scrape Shield (email obfuscation)
- Page Shield (third-party script monitoring)
- Global security level set to **High**

---

### ☁️ Serverless Architecture
- Cloudflare Pages for static hosting
- No backend servers
- No exposed APIs
- Security enforced **before** app logic

---

## 🔬 Security Validation

> This project does not assume security — it **verifies it**.

All security controls were tested using **controlled, non-destructive attack simulations** against infrastructure owned by the author.

Validated areas include:
- WAF rule effectiveness
- Zero Trust access enforcement
- Bot mitigation behavior
- Edge security header enforcement
- Threat intelligence challenges

📄 **Full testing methodology & results:**  
➡️ `docs/security-validation.md`

---

## 📚 Documentation Structure

This repository follows a **security-first documentation model**:

| Document | Purpose |
|------|------|
| `README.md` | High-level overview (this file) |
| `docs/architecture.md` | Traffic flow & system design |
| `docs/security-controls.md` | Defensive controls & rationale |
| `docs/security-validation.md` | Proof controls work |
| `docs/threat-model.md` | Risk assumptions *(optional)* |

---

<details>
<summary>🧠 Why this documentation structure?</summary>

Security systems are not documented like apps.

This mirrors real-world practice:
- **README** → Executive summary
- **Architecture** → Design review
- **Controls** → Defense inventory
- **Validation** → Evidence & verification

</details>

---

## 🎯 What This Project Demonstrates

✅ Zero Trust architecture  
✅ Identity-aware access control  
✅ Edge-based security enforcement  
✅ WAF rule design & threat modeling  
✅ Bot & abuse mitigation  
✅ Security validation & documentation  
✅ Production-style repo organization  

---

## ⚠️ Ethical Notice

All testing documented in this project was:
- Performed only on systems owned by the author
- Non-destructive
- Intended solely for defensive validation

---

## 🚀 Future Enhancements

- Centralized logging / SIEM-style telemetry
- Risk-based access policies
- Device posture checks
- Advanced edge anomaly detection

---

> **This repository documents a security system — not just an application.**

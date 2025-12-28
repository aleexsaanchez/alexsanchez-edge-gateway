🔐 Cloudflare Zero Trust Edge Security Stack

Author: Alex Sanchez
Domain: alexsanchez.site

This project implements a production-style Zero Trust security architecture using Cloudflare as the global edge control plane.
It secures both a public application and a protected internal dashboard without relying on traditional servers, enforcing identity, inspecting traffic, and applying security controls entirely at the edge.

The goal of this project is not to build a website, but to design, implement, and validate a real-world edge security system.

🧠 High-Level Architecture

All traffic enters through Cloudflare’s global Anycast network, where security decisions are enforced before any application code executes.

User
 └── HTTPS Request
      └── Cloudflare Edge
           ├── WAF & Bot Management
           ├── Zero Trust Access (GitHub OAuth / OTP)
           ├── Cloudflare Worker (Edge Logic & Headers)
           └── Cloudflare Pages (Serverless Hosting)


📌 No origin servers are exposed, significantly reducing attack surface.

🏗️ What This Repository Is

This repository acts as the security control plane for the entire system.

It contains:

The Cloudflare Worker that injects security headers and exposes edge APIs

Documentation for the overall security architecture

Validation evidence proving that controls work as intended

Other repositories (public site and secure dashboard) are applications protected by this stack, not the security system itself.

🔑 Core Security Layers
Zero Trust & Identity

Cloudflare Access enforcing identity-aware access

GitHub OAuth as the primary Identity Provider

Email-restricted access for internal users

One-Time Pin (OTP) bypass policy for controlled guest access

JWT propagation validated in the protected dashboard

Edge Security Logic (Workers)

Globally deployed Cloudflare Worker

Dynamic injection of:

Strict-Transport-Security

Content-Security-Policy

X-Frame-Options

Permissions-Policy

Custom edge endpoint (?metadata=true) exposing live request metadata

Strict CORS policy between public and secure subdomains

WAF & Threat Mitigation

Custom WAF rules for:

XSS & SQL injection patterns

Sensitive path scanning (.env, /wp-admin, etc.)

Bot and automation mitigation

Rate limiting and abuse prevention

Threat score–based challenges

Scrape Shield (email obfuscation)

Page Shield (third-party script monitoring)

Global security level set to High

Serverless Architecture

Cloudflare Pages for static hosting

No backend servers or exposed APIs

Security enforced before application execution

🔬 Security Validation

All security controls implemented in this project were actively tested using controlled, non-destructive attack simulations against infrastructure owned by the author.

Testing includes validation of:

WAF rule effectiveness

Zero Trust access enforcement

Bot mitigation behavior

Edge security header enforcement

Threat intelligence–based challenges

➡️ Detailed testing methodology and results:
📄 docs/security-validation.md

📚 Documentation Structure

This repository follows a security-first documentation model:

Architecture Overview
📄 docs/architecture.md

Security Controls & Design Decisions
📄 docs/security-controls.md

Security Testing & Validation (Proof of Effectiveness)
📄 docs/security-validation.md

Threat Model & Risk Assumptions (optional)
📄 docs/threat-model.md

🎯 What This Project Demonstrates

Zero Trust architecture design

Identity-aware access enforcement

Edge-based security controls

Web Application Firewall rule design

Bot and threat intelligence mitigation

Security validation and documentation practices

Production-style repo and documentation structure

⚠️ Ethical Notice

All testing documented in this project was:

Performed only against systems owned by the author

Non-destructive

Intended solely to validate defensive security controls

🚀 Next Steps

This project is designed to be extended with:

Centralized logging (SIEM-style)

Risk-based access policies

Device posture checks

Advanced anomaly detection at the edge

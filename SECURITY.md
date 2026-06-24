# Security Policy

## Reporting a Vulnerability

The Pets Santa team and community take security seriously. We appreciate
your efforts to responsibly disclose your findings, and will make every
effort to acknowledge your contribution.

**Please do not report security vulnerabilities through public GitHub
issues, discussions, or pull requests.**

Instead, please report them privately by emailing:

📧 **ellnazhang520@gmail.com**

Please include as much of the following information as possible to help us
triage your report more quickly:

- A description of the vulnerability and its potential impact
- Step-by-step instructions to reproduce the issue
- The affected component (e.g. authentication, billing/Stripe webhook,
  file upload, AI generation pipeline, a specific API route)
- Any proof-of-concept code, requests, or screenshots
- Your assessment of severity, if you have one

## Response Process

- **Acknowledgement**: We aim to acknowledge receipt of your report within
  **3 business days**.
- **Initial assessment**: We will provide an initial assessment of the
  report's validity and severity within **7 business days**.
- **Resolution**: We will work to release a fix as quickly as possible
  depending on complexity and severity, and will keep you informed of
  progress.
- **Disclosure**: We ask that you give us a reasonable amount of time to
  address the issue before any public disclosure. We're happy to credit
  reporters (with permission) once a fix has shipped.

## Supported Versions

This project does not currently maintain multiple long-term release
branches. Security fixes are applied to the `main` branch, and we recommend
always running the latest commit in production.

| Version | Supported |
| --- | --- |
| `main` (latest) | ✅ |
| Older commits / forks | ❌ |

## Scope

This policy covers the application code in this repository, including
(non-exhaustively):

- Authentication flows (email/password, Google OAuth, session handling via
  Better Auth)
- The credit/billing system and Stripe Checkout/webhook integration
- File upload handling and Vercel Blob storage
- The AI generation pipeline (Kie.ai task creation, callback, and polling
  endpoints)
- Database access patterns (Drizzle ORM / Supabase)

**Out of scope**:

- Vulnerabilities in third-party services themselves (Stripe, Supabase,
  Vercel, Kie.ai, Google OAuth) — please report these directly to the
  respective provider.
- Issues that require physical access to a user's device or already
  compromised credentials.
- Social engineering attacks against maintainers or contributors.

## Good Practices for Self-Hosting

If you deploy your own instance of this project, please keep in mind:

- Never commit `.env.local` or any file containing real secrets
  (`STRIPE_SECRET_KEY`, `KIE_AI_API_KEY`, `DATABASE_URL`,
  `BLOB_READ_WRITE_TOKEN`, etc.) to version control.
- Always verify Stripe webhook signatures using `STRIPE_WEBHOOK_SECRET` (this
  is already implemented in `src/app/api/webhook/route.ts` — do not remove
  it).
- Rotate API keys and Stripe secrets periodically, and immediately if you
  suspect a leak.
- Restrict your Supabase database to accept connections only from trusted
  sources where possible.
- Keep dependencies up to date to receive upstream security patches.

---

Thank you for helping keep Pets Santa and its users safe. 🐾🔒

# Contributing to Pets Santa

First off, thank you for considering contributing to **Pets Santa**! 🎅
Contributions of all kinds are welcome — bug reports, new features,
documentation improvements, design polish, and more.

By participating in this project, you agree to abide by our
[Code of Conduct](./CODE_OF_CONDUCT.md).

## Table of Contents

- [Before You Start](#before-you-start)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Reporting Bugs](#reporting-bugs)
- [Suggesting Features](#suggesting-features)
- [Pull Request Process](#pull-request-process)
- [Coding Style](#coding-style)
- [Commit Message Convention](#commit-message-convention)
- [Project Areas](#project-areas)

## Before You Start

- Check the [issue tracker](../../issues) to see if your bug/feature has
  already been reported or requested.
- For significant changes (new features, architecture changes), please open
  an issue first to discuss the approach before investing a lot of time.

## Development Setup

1. **Fork** the repository and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/<your-fork>.git
   cd <your-fork>
   ```

2. **Install dependencies** (pnpm is recommended):

   ```bash
   pnpm install
   ```

3. **Set up environment variables** by creating a `.env.local` file. See the
   [README](./README.md#environment-variables) for the full list of
   required variables (Supabase database URL, Stripe keys, Vercel Blob
   token, Kie.ai API key, etc.).

4. **Push the database schema**:

   ```bash
   pnpm db:push
   ```

5. **Run the dev server**:

   ```bash
   pnpm dev
   ```

6. If you're working on billing-related features, use the
   [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward webhook
   events to your local server:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhook
   ```

## How to Contribute

- 🐛 **Bug fixes**
- ✨ **New features** (outfits, backgrounds, UI improvements, etc.)
- 📝 **Documentation** improvements (README, code comments, docs/)
- ♻️ **Refactoring** for readability or performance
- 🧪 **Tests** for existing functionality
- 🌐 **i18n / accessibility** improvements

## Reporting Bugs

When filing a bug report, please include:

- A clear, descriptive title
- Steps to reproduce the issue
- Expected vs. actual behavior
- Screenshots or screen recordings, if applicable (e.g. for UI/Portrait
  Studio issues)
- Environment details (OS, browser, Node.js version)
- Relevant logs from the terminal or browser console

**Never include real API keys, Stripe secrets, or `.env.local` contents in
an issue or PR.** See [SECURITY.md](./SECURITY.md) for reporting security
vulnerabilities privately instead.

## Suggesting Features

We love new ideas! When suggesting a feature, please describe:

- The problem it solves or the experience it improves
- How it fits with the existing Pets Santa experience (outfits, backgrounds,
  billing, etc.)
- Any relevant mockups, references, or examples

## Pull Request Process

1. Create a new branch from `main`:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes, following the [coding style](#coding-style) below.

3. Run lint before committing:

   ```bash
   pnpm lint
   ```

4. If you changed the database schema, generate a migration:

   ```bash
   pnpm db:generate
   ```

5. Commit your changes using the
   [commit message convention](#commit-message-convention) below.

6. Push to your fork and open a Pull Request against `main`.

7. In your PR description, explain **what** changed and **why**, and link
   any related issues (e.g. `Closes #123`).

8. Make sure the app builds successfully (`pnpm build`) and there are no
   TypeScript or lint errors.

9. A maintainer will review your PR. Please be responsive to review
   feedback — small, focused PRs are easier and faster to review than large
   ones.

## Coding Style

- **TypeScript** everywhere — avoid `any` where possible.
- Follow the existing folder conventions under `src/`:
  - `src/app/` — routes & API handlers (Next.js App Router)
  - `src/components/` — UI components, with feature-specific components
    under `src/components/pets-santa/`
  - `src/lib/` — business logic grouped by domain (`auth/`, `billing/`,
    `generation/`, `kie/`)
  - `src/db/schema/` — Drizzle schema, grouped by domain
- Validate all external/user input with **Zod** schemas, matching the
  pattern used in existing API routes (see `src/app/api/generate/route.ts`).
- Keep server-only secrets (`STRIPE_SECRET_KEY`, `KIE_AI_API_KEY`, etc.) out
  of client components — only reference them in server-side code
  (`route.ts`, server actions, `src/lib/*`).
- Prefer Tailwind utility classes consistent with the existing design
  (see `src/app/globals.css` and `components.json` for the shadcn/ui setup).
- Run `pnpm lint` before pushing; fix all reported issues.

## Commit Message Convention

We loosely follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short summary>

[optional longer description]
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

Examples:

```
feat(portrait-studio): add drag-to-resize for stickers
fix(billing): prevent double-crediting on duplicate webhook events
docs(readme): clarify Supabase connection string setup
```

## Project Areas

A quick map of where things live, to help you find the right place for your
contribution:

| Area | Location |
| --- | --- |
| Landing page & marketing copy | `src/components/pets-santa/pets-santa-landing.tsx`, `data.ts` |
| Portrait Studio (sticker editor) | `src/components/pets-santa/portrait-studio.tsx` |
| Authentication | `src/lib/auth/`, `src/app/(routes)/(auth)/`, `src/app/api/auth/` |
| Billing & credits | `src/lib/billing/`, `src/app/api/billing/`, `src/app/api/checkout/`, `src/app/api/webhook/` |
| AI generation pipeline | `src/lib/kie/`, `src/lib/generation/`, `src/app/api/generate/` |
| Database schema | `src/db/schema/` |
| Shared UI primitives | `src/components/ui/` |

---

Thank you for helping make Pets Santa better! 🐾🎄

---
description: This document contains all development rules and guidelines for this project, applicable to all AI agents (Claude, Cursor, Codex, Gemini, etc.).
alwaysApply: true
---

## 0. Project at a glance

CosaVela is the online store for a Costa Rican artisan candle and gift-box business. Next.js 16 (App Router) + React 19 + Tailwind CSS 4 + TypeScript (strict), deployed on Vercel. No database: the catalog lives in `src/lib/productos.ts`, the cart lives in the browser, orders are sent through WhatsApp and company quotes through one API route (`/api/cotizacion`, optional email via Resend).

## 1. Core Principles

- **Small tasks, one at a time**: Always work in baby steps, one at a time. Never go forward more than one step.
- **Test-Driven Development**: Start with failing tests for any new logic (TDD). Unit tests use Vitest (`npm test`); keep business logic in `src/lib/` so it can be tested without React.
- **Type Safety**: All code must be fully typed.
- **Clear Naming**: Use clear, descriptive names for all variables and functions.
- **Incremental Changes**: Prefer incremental, focused changes over large, complex modifications.
- **Question Assumptions**: Always question assumptions and inferences.
- **Pattern Detection**: Detect and highlight repeated code patterns.

## 2. Language Standards

This project has two audiences, so it uses two languages. Keep the existing split; do not translate existing code.

- **Spanish (Costa Rica)** — this is the established convention of the codebase:
    - All user-facing copy, formal "usted" form (labels, errors shown to customers, WhatsApp messages, metadata).
    - Code identifiers that model the domain or UI (`productos`, `calcularCaja`, `FormularioPedido`, `lineas`), matching existing files.
    - Code comments and server log messages, matching existing files.
- **English**:
    - Technical documentation in `docs/`, `ai-specs/` and OpenSpec artifacts.
    - Test names and descriptions.
    - Git commit messages and pull request descriptions.
    - Configuration files and scripts.
- Framework names and Next.js conventions (`generateMetadata`, `runtime`, `page.tsx`) stay as the framework defines them.

## 3. Specific standards

For detailed standards and guidelines specific to different areas of the project, refer to:

- [Backend Standards](./backend-standards.md) - Next.js route handlers, validation, security and testing for the server side
- [Frontend Standards](./frontend-standards.md) - App Router structure, Server/Client Components, Tailwind, accessibility and SEO
- [Documentation Standards](./documentation-standards.md) - Technical documentation structure, formatting, and maintenance guidelines, including AI standards like this document
- [Development Guide](./development_guide.md) - Local setup, environment variables, scripts, testing and deployment
- [Data Model](./data-model.md) - Catalog, cart and quote types (no database)
- [API Spec](./api-spec.yml) - OpenAPI spec of `/api/cotizacion`
- [OpenSpec Tasks Mandatory Steps](./openspec-tasks-mandatory-steps.md) - Required checklist and execution rules when creating or updating OpenSpec `tasks.md` files

## 4. Project Skills

- Skills live in `ai-specs/skills`.
- When a request matches a skill, load and follow the corresponding `SKILL.md` automatically before continuing.
- Also load any referenced files in the skill folder (for example, `references/*.md`) when the skill requires them.

## 5. Planning Model Requirement

Planning workflows (`enrich-us`, `openspec-propose`, `openspec-ff-change`, `openspec-continue-change`) should run with the most capable Opus model available and high reasoning. If the session runs a smaller model, say so before planning. Do not edit `.claude/settings.json` to change the model without the user's approval.

## 6. Symlink Integrity and Multi-Agent Portability

- **Canonical Source**: Keep reusable artifacts in `ai-specs` as the canonical source. Agent-specific paths (such as `.claude` and `.cursor`) should reference them through symlinks when possible.
- **Update Safety**: Whenever a file is renamed, moved, or its suffix changes, verify and update all symlinks that target it before considering the change complete.
- **New Artifact Linking**: Whenever creating a new artifact that requires multi-agent exposure (for example new agents or skills in `ai-specs`), create the corresponding symlinks from the expected agent-specific reference paths.
- **External Customization Review**: Whenever customization is introduced outside `ai-specs`, evaluate whether it should be moved into `ai-specs` and replaced with symlinks from the original locations.
- **Completion Gate**: A change is incomplete if it leaves broken symlinks, stale targets, or duplicated canonical artifacts across agent-specific folders.

## 7. Mandatory OpenSpec Artifact Updates for Post-Apply Changes

When a new fix/change request appears after `opsx:apply` (or `/apply`) and before `opsx:archive` (or `/archive`), agents must treat it as a spec update first, not as an informal "fix this quickly". It's the core principle of openspec, documentation is the source of truth.

Required order:

1. Update the current OpenSpec change artifacts that are affected (for example: scenarios, requirements/specs, and `tasks.md`). Don't add tasks as "bugfixes" but as part of the initial design, thus in the proper section
2. If artifact regeneration is needed, run the corresponding OpenSpec step (`opsx:continue`, `opsx:ff`, or equivalent) before coding.
3. Implement code only after artifacts reflect the new request.
4. Re-run verification against the updated artifacts before archiving.

Do not apply direct code-only fixes in this window without updating OpenSpec artifacts.


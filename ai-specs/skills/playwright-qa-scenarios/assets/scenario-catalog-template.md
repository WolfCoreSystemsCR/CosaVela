# E2E Test Case Catalog — <TICKET-KEY or SLUG>

## Meta

| Field | Value |
|-------|-------|
| Story source | Ticket `<KEY>` / enriched file `<path>` / paste |
| Actor | |
| Feature / route | |
| Screens / routes / controllers | |
| Generated | YYYY-MM-DD |
| Evidence quality | CONFIRMED / MIXED / ASSUMED |
| playwright-skill guides used | e.g. `forms-and-validation.md`, `when-to-mock.md` |

## Story summary

- **Goal:**
- **In scope:**
- **Out of scope:**
- **ACs (numbered):**
  1. …

## Constraint matrix

| ID | Constraint | Source | Layer | Boundaries | Error / success signal | Status |
|----|------------|--------|-------|------------|------------------------|--------|
| C01 | | AC / `path:line` | UI / API / both | | | CONFIRMED |

## Open questions

| ID | Question | Blocks scenarios | Resolution trigger |
|----|----------|------------------|--------------------|
| O01 | | | |

## Scenarios

### HP — Happy path

#### E2E-HP-01 — <short title>

| | |
|--|--|
| Priority | P0 |
| Test layer | E2E / API / Minitest |
| Mock policy | none (real stack) / route third-party / route UI-error / clock / storageState only |
| Tags | `@smoke` / `@regression` (optional) |
| Maps to | AC-1, C01 |
| Guides | `test-architecture.md`, … |
| Preconditions | Logged in as … (`storageState`) |
| Steps | 1. … 2. … |
| Expected | … |
| Playwright | `test.describe('<Feature>')` → `test('user can …')`; locate with `getByRole`/`getByLabel`; web-first `expect`; mocks only per Mock policy |

### RQ — Required / empty

#### E2E-RQ-01 — …

### FMT — Format / type

### BND — Boundaries

### BR — Business rules

### API — Server / transport errors

### AUTH — Auth / role

### STATE — Stateful UX

### REG — Regression / scope

### A11Y — Smoke a11y

## Coverage checklist

| Category | Covered? | Skip reason (if any) |
|----------|----------|----------------------|
| HP | | |
| RQ | | |
| FMT | | |
| BND | | |
| BR | | |
| API | | |
| AUTH | | |
| STATE | | |
| REG | | |
| A11Y | | |

## Layer mix (from `test-architecture.md`)

| Layer | Scenario ids | Notes |
|-------|--------------|-------|
| E2E | | Playwright suite, thin critical path |
| API | | Playwright `request`, JSON routes only |
| Minitest | | Validation permutations, model/controller rules (sections 8-9) |

## Suggested Playwright suite map

Follow `playwright-skill` `core/test-organization.md` (feature-based, max 2 `describe` levels):

```text
e2e/<feature>/<slug>.spec.ts            # E2E and API scenarios (Playwright)
  describe('<Feature>')
    describe('happy path') … E2E-HP-*     # real stack
    describe('validation') … E2E-RQ-*/FMT-*/BND-*  # only the cases that need a browser
    describe('business rules') … E2E-BR-*
    describe('server errors') … E2E-API-*  # UI-error routes only where Mock policy says
test/…                                  # Minitest-layer scenarios (cited, not written here)
```

## Priority counts

| P0 | P1 | P2 | Total |
|----|----|----|-------|
| | | | |

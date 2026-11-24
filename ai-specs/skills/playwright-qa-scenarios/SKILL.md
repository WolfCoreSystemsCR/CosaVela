---
name: playwright-qa-scenarios
description: >-
  Use when a story or change touches the frontend and needs a list of E2E test
  cases (from `enrich-us`), or when the apply E2E step (section 11) must turn
  that list into Playwright test code and run it as a suite. Derives happy-path,
  boundary, negative and business-rule cases from acceptance criteria plus the
  Rails/Hotwire code (validations, controllers, routes, Stimulus).
author: LIDR.co
version: 2.0.0
---

# Playwright QA Scenarios

Turn a user story into an **exhaustive** list of Playwright-oriented E2E test cases grounded in **acceptance criteria + technical project context**, and later turn those cases into executable Playwright code. Happy path alone is never enough.

**Core principle:** Every constraint found in code, routes or business rules becomes one or more scenarios. If the model says "name is required, max 120 chars", those cases are mandatory, not optional.

**REQUIRED SUB-SKILL:** Use `playwright-skill` for all Playwright practice. Read [`../playwright-skill/SKILL.md`](../playwright-skill/SKILL.md) (Golden Rules, Guide Index and the "Peripheral Insights conventions" section), then load the guides listed in [Playwright practice gate](#playwright-practice-gate). Do not invent locator, wait, mock or suite-layout patterns that contradict those guides.

## Modes

| Mode | Invoked by | Output |
|------|------------|--------|
| **catalog** (default) | `enrich-us`, when the story has frontend behavior to verify | The scenario list, written into the enriched file (see [Catalog output](#catalog-output)). No code. |
| **suite** | The testing/verification subagent, in the apply E2E step (`tasks.md` section 11) | Playwright spec files under `e2e/`, executed as a suite. See [Suite mode](#suite-mode-apply-e2e-step). |
| **standalone** | A user asking for QA scenarios for a story | Same as catalog; write to `tmp/enriched-us/<ticket-key-or-slug>-e2e-cases.md`. |

## Arguments

`$ARGUMENTS`: one of

| Input | Example |
|-------|---------|
| **Enriched file** (preferred, from `enrich-us`) | `tmp/enriched-us/<change-name>.md` |
| **Jira key** | `PER-123` (fetch with the Atlassian MCP `getJiraIssue`, `responseContentFormat: markdown`) |
| **Local file** | path to markdown/txt with the story |
| **Paste** | full story and ACs in the message |

If the input is ambiguous, ask which one before inventing content. Do not invent ACs: missing product rules become `OPEN` questions.

## Catalog workflow

```
QA Scenario Progress:
- [ ] 0. Load playwright-skill Golden Rules + relevant guides
- [ ] 1. Resolve story input
- [ ] 2. Gather technical context (mandatory)
- [ ] 3. Build constraint matrix
- [ ] 4. Expand scenarios (categories + control heuristics)
- [ ] 5. Assign test layer + mock policy per scenario
- [ ] 6. Prioritize and emit the catalog
```

### 0. Playwright practice gate

Apply the `playwright-skill` Golden Rules (role locators, no `waitForTimeout`, web-first assertions, isolated tests, `baseURL`, fixtures, one behavior per test, mock policy). Guides live under `ai-specs/skills/playwright-skill/`:

| Feature shape | Load |
|---------------|------|
| Suite layout / naming / tags | `core/test-organization.md`, `core/test-architecture.md` |
| Forms, validators | `core/forms-and-validation.md`, `core/error-and-edge-cases.md` |
| Dates / "today" | `core/clock-and-time-mocking.md`, `core/forms-and-validation.md` |
| File upload / download | `core/file-upload-download.md`, `core/file-operations.md` |
| Network errors / intercepts | `core/network-mocking.md`, `core/when-to-mock.md`, `core/error-and-edge-cases.md` |
| Auth / session / roles | `core/authentication.md`, `core/auth-flows.md` |
| Locators / assertions | `core/locators.md`, `core/locator-strategy.md`, `core/assertions-and-waiting.md` |
| Lists, filters, search | `core/search-and-filter.md`, `core/crud-testing.md` |
| Responsive layout | `core/mobile-and-responsive.md` |
| A11y smoke | `core/accessibility.md` |
| Writing the code (suite mode) | also `core/fixtures-and-hooks.md`, `pom/page-object-model.md`, `core/test-data-management.md`, `core/configuration.md` |

### 1. Resolve story input

Read the enriched file, ticket text or pasted story. Extract: actor, goal, scope in/out, acceptance criteria, explicit business rules, linked Figma or OpenSpec context. Do **not** invent ACs.

### 2. Gather technical context (mandatory)

Never produce the final catalog from the story text alone when the workspace has code. For the feature's vertical slice:

1. Find the UI entry: route in `config/routes.rb`, controller action, ERB view and partials (`app/views/**`, `app/views/shared/portal/`), Stimulus controllers (`app/javascript/controllers/`), Turbo Frames and Streams involved.
2. Collect **constraints** from:
   - Model validations, enums, `before_*` callbacks, state machines (`app/models/**`)
   - Controller strong params, authorization and `Current.user` / company scoping (`app/controllers/**`)
   - HTML constraints in the view (`required`, `maxlength`, `pattern`, `accept`, `min`/`max`)
   - Stimulus behavior (toggle, debounce, disable-on-submit, client-side checks)
   - Background work with user-visible effects (Sidekiq jobs, status polling, Turbo broadcasts)
   - Flash messages and error copy (including `config/locales/**`)
   - Roles, tenancy and feature flags
3. Cite file paths in the constraint matrix. Prefer `Grep`/`Glob` and targeted reads.

If code cannot be found, say so and mark derived cases `ASSUMED` instead of `CONFIRMED`.

### 3. Build the constraint matrix

For every field or action:

| Constraint | Source (file or AC) | Layer (UI / server / both) | Boundary values | Error signal |
|------------|---------------------|----------------------------|-----------------|--------------|

**Rule:** each row maps to at least one scenario. Boundaries need **below / at / above** (or invalid / exact / valid) where applicable. For "today" or age boundaries, note `page.clock` (see `clock-and-time-mocking.md`) so the case is deterministic.

### 4. Expand scenarios

Use [references/edge-case-catalog.md](references/edge-case-catalog.md) for control-specific heuristics. Always cover these **categories**, skipping one only with an explicit reason (for example "N/A: read-only screen"):

| ID | Category | Must include |
|----|----------|--------------|
| HP | Happy path | Primary success and the observable outcome (navigation, flash, rendered state) |
| RQ | Required / empty | Empty, whitespace-only for strings |
| FMT | Format / type | Wrong type, pattern violations, charset |
| BND | Boundaries | min/max/length/size/date: below, at, above |
| BR | Business rules | Domain rules from the AC **and** from code |
| API | Server / transport errors | Business 4xx, 5xx, abort; split by signal |
| AUTH | Auth / role / tenancy | Logged out, wrong role, another company's data |
| STATE | Stateful UX | Fix after error, resubmit, back navigation, Turbo updates, double submit |
| REG | Regression / scope | Explicit out-of-scope or "must not break" from the story |
| A11Y | Smoke a11y | Accessible name for the primary control, keyboard submit for forms |

| Excuse | Reality |
|--------|---------|
| "Happy path is enough for v1" | The catalog must be exhaustive. Prioritization (`P0`/`P1`/`P2`) comes after, not instead. |
| "Edge cases are optional" | If a constraint exists in code, the case is required. |
| "The AC didn't mention the max length" | Code and validators define testable truth. Include it. |
| "I'll add boundaries when writing the tests" | Boundaries belong in the catalog now. |
| "One 'upload fails' covers all errors" | Split by signal (MIME, size, 401, 5xx): different asserts and mocks. |
| "Skip playwright-skill, I know Playwright" | Golden Rules and guides are mandatory for notes and code. |

**Dedup:** one observable behavior is one scenario id. If a guard is both RQ and BR, keep one scenario and list both tags in `Maps to`.

### 5. Assign test layer and mock policy

Per scenario, use `playwright-skill` `core/test-architecture.md` and `core/when-to-mock.md`. The project has a Minitest suite (`test/`), so permutations that need no browser belong there:

| Test layer | Use when | Where it runs |
|------------|----------|---------------|
| **E2E** | Critical multi-step flows, Turbo/Stimulus behavior, auth, cross-page state, anything only a browser proves | Playwright suite (`e2e/`), run in section 11 |
| **API** | JSON endpoints: status codes, error shapes, permissions | Playwright `request` fixture (suite) when the route is JSON; otherwise Minitest |
| **Minitest** | Validation permutations, model rules, controller authorization, service logic | `test/` (sections 8-9), **not** the Playwright suite |

Only `E2E` and `API` scenarios become Playwright code. `Minitest` scenarios stay in the catalog so the unit-test sections can cite them.

| Mock policy | When |
|-------------|------|
| `none (real stack)` | Anything against **this** app. Never mock the Rails backend on the happy path. |
| `route third-party` | OpenAI and any other external service. Always mocked, or the call is stubbed server-side in the test environment. |
| `route UI-error` | Only to prove the UI handles a 4xx/5xx/abort. Pair it with a server-level case for the code itself. |
| `clock` | Date/age/"today" sensitive cases (`page.clock`). |
| `storageState only` | Auth set-up with no mocking. |

Tag with `@smoke` / `@regression` / `@slow` per `test-organization.md` when useful.

### 6. Emit the catalog

Use [assets/scenario-catalog-template.md](assets/scenario-catalog-template.md). Each scenario has:

- Stable id (`E2E-HP-01`, `E2E-BND-03`; keep the `E2E-` prefix for every layer, including `Minitest` scenarios, so ids stay unique and match test titles; the layer field says where the case runs)
- Priority `P0` / `P1` / `P2`
- Test layer and Mock policy
- Preconditions, steps, expected result
- Playwright notes: `getByRole`/`getByLabel` first, web-first `expect`, no `waitForTimeout`, suggested `test.describe` (max 2 levels) and behavior-based `test('...')` title, guide filenames used
- Traceability: AC id and/or constraint id

#### Catalog output

- **From `enrich-us`:** do **not** create a separate file. Add the catalog as a section `### E2E test cases (Playwright)` inside `## Enhanced` of `tmp/enriched-us/<change-name>.md` (or `<ticket-key>.md`). In the enriched file keep it compact: the constraint matrix summary, the scenario table (id, priority, layer, mock policy, title, maps to) and, per `E2E`/`API` scenario, one block with preconditions, steps and expected result. Put the open questions in the enriched story's own open questions.
- **Standalone:** write the full template to `tmp/enriched-us/<ticket-key-or-slug>-e2e-cases.md` (slug: kebab-case feature title plus `-<YYYY-MM-DD>`; never `draft.md`).

Do **not** generate `.spec.ts` in catalog mode.

## Suite mode (apply E2E step)

Used by the **testing/verification subagent** for `tasks.md` section 11. The development subagent never runs this. The report for the step is the suite run, **not** a Playwright MCP walkthrough.

1. **Read the cases.** Open `tmp/enriched-us/<change-name>.md` and take the `### E2E test cases (Playwright)` section. If it is missing but the change touches the UI, run catalog mode first and append the section to the enriched file before writing code. Cross-check the cases against the change's `proposal.md`, `design.md` and `specs/` (when present) and record any case that no longer matches.
2. **Re-read** `playwright-skill` Golden Rules, the "Peripheral Insights conventions" section, and `core/test-organization.md`, `core/fixtures-and-hooks.md`, `core/locators.md`, `core/assertions-and-waiting.md` plus the guides the cases need.
3. **Use the existing project.** Follow [references/e2e-suite-conventions.md](references/e2e-suite-conventions.md): the project (`playwright.config.ts`, `bin/e2e`, `e2e/`) already exists, so extend it and mirror its layout. Run `npm install` first if `node_modules/` is missing. Never recreate the project or run it against the development database.
4. **Write the specs** under `e2e/<feature>/<slug>.spec.ts`, one `test()` per scenario with the scenario id in the title (for example `test('E2E-HP-01 user can ...')`). Cover every `E2E`/`API` scenario of priority P0 and P1; implement P2 or mark them `test.fixme` with the reason and list them in the report. `Minitest` scenarios are not written here: confirm each is covered by a test cited in the section 8/9 report, or flag it.
5. **Run the suite**, never single tests as evidence, and capture the real output:

   ```bash
   bin/e2e e2e/<feature> --reporter=list
   ```

   Run it again with `--reporter=html` only when you need the artifact. Retry rules, traces and failures follow `core/flaky-tests.md` and `core/debugging.md`. A flaky test is fixed, not retried until green.
6. **Report** under `openspec/changes/<change>/reports/YYYY-MM-DD-step-N+3-e2e-playwright-suite.md`: the command, the verbatim suite output (a summary line is allowed above it, never instead of it), a table mapping each scenario id to its test file and result, skipped/`fixme` cases with reasons, and database restoration.
7. **Playwright MCP is optional tooling**, only for exploring the UI to find locators or to debug a failing test. Its output is never the report evidence.

## Stop conditions

- [ ] `playwright-skill` Golden Rules applied; guides cited in notes
- [ ] Input resolved and cited
- [ ] Constraint matrix has `CONFIRMED` rows from code (or documented gaps)
- [ ] Every matrix row maps to at least one scenario
- [ ] Every scenario has test layer and mock policy
- [ ] Categories reviewed; skips justified
- [ ] Catalog written into the enriched file (or standalone file)
- [ ] Suite mode only: specs written, suite executed, report with verbatim output on disk

## Common mistakes

- Catalog mirrors the ACs only, missing min/max/length rules from validations
- One "invalid input" scenario instead of one per signal (format vs range vs business rule)
- Putting every validation permutation in E2E; use `Minitest` for those
- Mocking this app's own endpoints on the happy path (violates `when-to-mock.md`)
- CSS selectors or `waitForTimeout` in the notes or the code
- Using Playwright MCP navigation as the E2E report instead of running the suite
- Inventing product rules not in the AC or code
- Dropping cases instead of deprioritizing them

## Additional resources

- **Required:** [`../playwright-skill/SKILL.md`](../playwright-skill/SKILL.md)
- Template: [assets/scenario-catalog-template.md](assets/scenario-catalog-template.md)
- Control heuristics: [references/edge-case-catalog.md](references/edge-case-catalog.md)
- Suite layout, `bin/e2e` and conventions: [references/e2e-suite-conventions.md](references/e2e-suite-conventions.md)
- Worked example: [examples.md](examples.md)

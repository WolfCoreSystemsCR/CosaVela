# E2E suite conventions (Peripheral Insights)

Used in **suite mode** by the testing/verification subagent. The Playwright suite is a Node-side test project next to a Rails app, so it stays small and isolated.

> Status: the Playwright project exists (`package.json`, `playwright.config.ts`, `bin/e2e`, `e2e/`) and the sign-in suite in `e2e/auth/` was run green against `peripheral_test` (PER-53). Extend it; do not recreate it. If a command here stops matching reality, fix this file in the same change.

## Layout

```text
package.json              # devDependency @playwright/test (pinned) only; script "e2e"
package-lock.json
playwright.config.ts      # baseURL, webServer, projects, list reporter
bin/e2e                   # the only supported entry point (mirrors bin/test)
e2e/
  auth.setup.ts           # logs in once, saves storageState
  support/                # shared locators/helpers (for example sign-in-form.ts)
  fixtures/               # test.extend() fixtures when needed
  pages/                  # page objects only when 3+ specs share a screen (pom/page-object-model.md)
  <feature>/<slug>.spec.ts
  .auth/                  # storageState files (gitignored)
```

`node_modules/`, `playwright-report/`, `test-results/` and `e2e/.auth/` are in `.gitignore`.

## Running

Always run through `bin/e2e`; it is the only path that guarantees the test database:

```bash
bin/e2e --reporter=list                     # whole suite (report evidence)
bin/e2e e2e/auth --reporter=list            # one feature
bin/e2e --ui                                # local debugging only
```

`bin/e2e` sets `RAILS_ENV=test`, unsets `DATABASE_URL`, defaults `POSTGRES_*` like `bin/test` (Docker Postgres on `127.0.0.1:5433`; override `POSTGRES_HOST`/`POSTGRES_PORT`/`POSTGRES_USER`/`POSTGRES_PASSWORD` when your Postgres runs elsewhere), runs `db:test:prepare`, loads fixtures, builds Tailwind (`tailwindcss:build`, because the hidden/visible state of elements depends on the CSS), then calls `npx playwright test`. Playwright's `webServer` starts `bin/rails server -e test -p 3100`.

## Config essentials

- `baseURL`: `http://127.0.0.1:3100` (not the dev server's 3000). No hardcoded URLs in specs.
- `retries: 0` locally and `2` in CI, `trace: 'on-first-retry'`, one worker and `fullyParallel: false` because all specs share one database.
- Reporter `list` (its output is the report evidence); add `html` only when you need the artifact.
- Projects: `setup` (logs in), `chromium` (logged in via `storageState`, every spec outside `e2e/auth/`) and `chromium-logged-out` (specs under `e2e/auth/`, which exercise the real sign-in form).
- Chromium: `/opt/pw-browsers` is pre-installed in cloud sessions with a matching Playwright; do not reinstall it there. `@playwright/test` is pinned to that version (1.63.0); bump both together. Locally: `npx playwright install chromium`.

## Database rules (never break these)

- The suite runs against **`peripheral_test` only**, the same rule as `bin/test`. Never point it at `peripheral_development`.
- Load known data before the run, for example `RAILS_ENV=test bin/rails db:fixtures:load`, and use the fixture users (`test/fixtures/users.yml`; password `password`).
- Tests that create or change data must clean up what they created, or the run reloads fixtures first. Record in the report how the database was restored (section 11 requires restoration).
- Do not touch the development database from E2E. If a scenario truly needs it, stop and ask.

## Authentication

- Login form: `/session/new`, fields labelled "Email" and "Password", button "Sign In". The page also contains a hidden "forgot password" form and a marketing signup form that match the same labels, so always go through `signInForm(page)` in `e2e/support/sign-in-form.ts`, which scopes locators to the form that owns the "Sign In" button.
- **Role matrix (required):**
  - **Intranet / portal consumer UI** → **manager**. Suite fixture: `one@example.com` / `password` → `e2e/.auth/manager.json` (default `chromium` project). Seeded/dev: `manager@peripheral-insights.com` (see `db/seeds/users.rb`).
  - **Superadmin-only UI** (for example `report_analysis`) → **admin**. Suite fixture: `admin@example.com` / `password` → `e2e/.auth/admin.json` (`chromium-admin` project; specs under `e2e/admin/`). Seeded/dev: `admin@peripheral-insights.com`.
- Log in once per role in `e2e/auth.setup.ts`, save each `storageState`, and reuse it (`authentication.md`). Keep specs that exercise the real login form under `e2e/auth/`.
- `SessionsController#create` is rate-limited (10 per 3 minutes). Specs must not log in through the form on every test; use the saved `storageState`, and keep real-form login specs few.
- **Canonical completed report:** Colorifix. Seeded/dev id **18**. On `peripheral_test`, look up by title `Colorifix` (do not invent temporary reports for happy-path reader/download/analysis checks).
- Example (PER-11 style): intranet Download menu as manager on Colorifix; `report_analysis` Download docx as admin.

## Hotwire specifics

- Turbo Drive navigations: wait on the resulting URL or a heading with web-first assertions (`await expect(page).toHaveURL(...)`), never `waitForTimeout`.
- Turbo Frames/Streams: assert on the updated region by role/name; the assertion itself auto-retries.
- Stimulus: drive it as a user does (click, type, key press). Do not call controller methods through `evaluate`.
- Animations/transitions: wait for the control to be actionable via the normal actionability checks. The Capybara helper `wait_until_position_stable` in `test/application_system_test_case.rb` exists for the same reason; in Playwright, prefer `expect(locator).toBeVisible()` then act, and see `core/flaky-tests.md` if a click lands on a moving element.
- Prefer `getByRole`, `getByLabel`, `getByText`. If a control has no accessible name, fix the view (that is also an A11Y finding) or add `data-testid` sparingly and say so in the report.

## Third parties

OpenAI and any other external HTTP call must not happen during E2E. Stub them server-side in the test environment, or intercept with `page.route` only when the call is made from the browser. This app's own routes are never mocked on a happy path.

## Naming and traceability

- File: `e2e/<feature>/<slug>.spec.ts`, feature-based per `core/test-organization.md`, max 2 `describe` levels.
- Title starts with the scenario id: `test('E2E-HP-01 user can ...', ...)`.
- Skipped cases use `test.fixme('E2E-... reason', ...)`, never an unexplained `test.skip`.

Failure analysis: `npx playwright show-trace test-results/<run>/trace.zip` (traces are recorded on first retry).

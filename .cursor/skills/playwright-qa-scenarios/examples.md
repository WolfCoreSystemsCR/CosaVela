# Example: sign-in form

Illustrative only. Facts marked CONFIRMED come from `app/controllers/sessions_controller.rb` and `app/views/sessions/new.html.erb`; a real catalog must re-check them against the code at the time.

## Input (enriched story excerpt)

**Story:** As a registered user, I want to sign in with my email and password so I can reach the intranet.

**ACs:** valid credentials start a session and redirect; invalid credentials show an error and stay on the sign-in screen.

**Technical context (CONFIRMED):**

- `POST /session` calls `User.authenticate_by(email_address, password)`.
- Success: `start_new_session_for user`, redirect to `after_authentication_url`.
- Failure: redirect to `new_session_path` with alert "Try another email address or password."
- Form: labels "Email" and "Password", submit button "Sign In".

**playwright-skill guides:** `forms-and-validation.md`, `authentication.md`, `auth-flows.md`, `error-and-edge-cases.md`, `when-to-mock.md`, `test-architecture.md`

## Constraint matrix (excerpt)

| ID | Constraint | Layer | Boundaries |
|----|------------|-------|------------|
| C01 | Valid credentials start a session | both | known fixture user |
| C02 | Wrong password rejected with a single generic message | server | existing email + wrong password |
| C03 | Unknown email rejected with the same generic message | server | unknown email (no user enumeration) |
| C04 | Empty email or password | both | empty email, empty password |
| C05 | Unauthenticated access to an intranet page redirects to sign-in | both | direct URL while logged out |
| C06 | After sign-in the user lands on the originally requested page | both | deep link, then sign in |

## Scenarios that must appear (not optional)

| ID | Priority | Layer | Mock policy | Title |
|----|----------|-------|-------------|-------|
| E2E-HP-01 | P0 | E2E | none (real stack) | Valid credentials land on the intranet |
| E2E-AUTH-01 | P0 | E2E | none | Logged-out visit to an intranet URL redirects to sign-in |
| E2E-BR-01 | P0 | E2E | none | Wrong password shows the generic alert and stays on sign-in |
| E2E-BR-02 | P1 | E2E | none | Unknown email shows the same alert (no enumeration) |
| E2E-RQ-01 | P1 | E2E | none | Empty submit does not start a session |
| E2E-STATE-01 | P1 | E2E | none | Fix credentials after a failure and sign in |
| E2E-STATE-02 | P2 | E2E | none | Deep link to a protected page returns there after sign-in |
| E2E-A11Y-01 | P2 | E2E | none | Fields have accessible names and Enter submits the form |
| E2E-FMT-02 | P1 | Minitest | none | Email with surrounding whitespace or different case, per model normalization |

**Anti-pattern:** a single scenario "invalid login shows error". It hides wrong password vs unknown email vs empty fields: three different signals.

**Anti-pattern:** mocking `POST /session` on the happy path. It is this app's own endpoint (`when-to-mock.md`).

Scenario ids always keep the `E2E-` prefix, whatever the layer: the layer column says where the case runs, and `E2E-FMT-02` above is written as a Minitest, not a Playwright test.

**Anti-pattern:** putting every permutation of malformed email in E2E. Those are Minitest cases; keep E2E thin.

## Thin AC lesson

If the AC only says "user can upload a PDF", still open the model validations and the controller for content type, size limit and error messages. Those become BND/FMT/API scenarios tagged CONFIRMED. Load `file-upload-download.md` and `when-to-mock.md`. Do not mark them optional.

## Suite-mode sketch (apply step)

```ts
// e2e/auth/sign-in.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Sign in', () => {
  test('E2E-BR-01 wrong password shows the generic alert', async ({ page }) => {
    await page.goto('/session/new');
    await page.getByLabel('Email').fill('one@example.com');
    await page.getByLabel('Password').fill('not-the-password');
    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/session\/new/);
    await expect(page.getByText('Try another email address or password.')).toBeVisible();
  });
});
```

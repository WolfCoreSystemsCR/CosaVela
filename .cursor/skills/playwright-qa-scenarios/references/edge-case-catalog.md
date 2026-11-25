# Edge-case heuristics by control type

Use after the constraint matrix exists. For each control present in the UI, apply the matching block. Only keep cases that map to a real constraint (CONFIRMED or explicitly ASSUMED).

**Playwright practice:** After picking cases, assign Test layer + Mock policy per `playwright-skill` (`test-architecture.md`, `when-to-mock.md`). Prefer Minitest for validation permutations and server-level checks for error codes; keep E2E thin.

Guides live under `ai-specs/skills/playwright-skill/core/` unless noted.

## Date / date of birth

**Guides:** `forms-and-validation.md`, `clock-and-time-mocking.md`, `error-and-edge-cases.md`

- Empty / cleared
- Invalid format (wrong separators, ISO vs display format, letters)
- Impossible calendar date (`31/02/…`)
- Partial input
- **max:** tomorrow (invalid), today (valid for range; may fail business age)
- **min:** day before min (invalid), exact min (valid for range)
- Business age: under threshold, **exactly** threshold (birthday today), above threshold
- Freeze “today” with `page.clock.install` / `setFixedTime` — never depend on real system date
- Timezone sensitivity only if code shows local vs UTC handling

## Text / name

**Guides:** `forms-and-validation.md`

- Empty, whitespace-only
- Min/max length: below, at, above
- Forbidden characters / script injection smoke per sanitizers
- Leading/trailing trim if sanitize exists
- Prefer the Minitest layer for most permutations

## Email / phone

**Guides:** `forms-and-validation.md`

- Empty
- Missing `@` / TLD; valid format wrong domain if business checks domain
- Phone: missing country code, too short/long, non-digits vs mask

## Number / money / percent

**Guides:** `forms-and-validation.md`, `error-and-edge-cases.md`

- Empty, non-numeric
- Min/max/step: below, at, above
- Precision (too many decimals)
- Zero / negative if disallowed
- Thousand separators / locale if UI accepts them

## Select / radio / checkbox

**Guides:** `forms-and-validation.md`

- None selected (if required)
- Each meaningful option that changes flow (branch coverage)
- Disabled options not selectable
- Default vs explicit change

## File upload

**Guides:** `file-upload-download.md`, `file-operations.md`, `error-and-edge-cases.md`, `when-to-mock.md`

- No file
- Allowed type (happy: **real stack** E2E)
- Disallowed MIME/extension
- Empty file (0 bytes)
- At / over max size
- Corrupted / non-parseable if backend validates content
- Replace / re-upload
- Cancel mid-upload (if UI supports)
- Filename edge: spaces, unicode, very long name (if constrained)
- Virus / business error codes: server-level assert for the code; UI-error `route` only for flash/toast mapping

## Password / OTP / PIN

**Guides:** `authentication.md`, `auth-flows.md`, `forms-and-validation.md`

- Wrong length, wrong charset
- Paste behavior
- Resend / cooldown if present
- Expired OTP if API distinguishes codes
- Prefer real login for a few smoke tests (`/session/new`); `storageState` for the rest

## Navigation / multi-step wizards

**Guides:** `forms-and-validation.md`, `test-architecture.md` (E2E for wizards)

- Continue with invalid step blocked
- Back preserves or clears data per product rules
- Deep link to later step while earlier incomplete (guards)
- Refresh mid-flow
- Prefer E2E for cross-step state; Minitest for single-step validation

## Lists / tables / filters

**Guides:** `search-and-filter.md`, `error-and-edge-cases.md`

- Empty state
- Pagination boundary (last page)
- Filter with no results
- Sort toggle

## Permissions / session

**Guides:** `authentication.md`, `auth-flows.md`, `test-architecture.md` (Minitest/API for authz)

- Logged out → redirect to login; another company's record → not found/forbidden (multi-tenant scoping)
- Wrong role → forbidden UI or API 403
- Session expiry mid-action if the redirect to login is user-visible

## Network / API

**Guides:** `when-to-mock.md`, `network-mocking.md`, `error-and-edge-cases.md`, `api-testing.md`

- Success against **your** API: do not mock backend
- Business 4xx with known error codes → server-level scenario (Minitest, or API when the route is JSON) for shape/code; optional E2E with `route` for UI copy
- 500 / network abort → UI recoverable error (`route.abort` / fulfill) per `error-and-edge-cases.md`
- Third-party only: always mock
- Duplicate submit / double-click if no debounce

## i18n (when feature is localized)

**Guides:** `i18n-and-localization.md`

- Primary CTA and error strings resolve (one secondary locale smoke) — only if story/i18n scope includes it

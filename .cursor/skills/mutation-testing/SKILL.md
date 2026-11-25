---
name: mutation-testing
description: Verify test effectiveness with mutation-style analysis (would a small code change still pass?). Use when reviewing a branch for weak or missing tests, when adversarial-review runs its test-effectiveness pass, or after TDD to strengthen assertions beyond line coverage.
author: LIDR.co
version: 1.0.0
---

# mutation-testing Skill

Answer: **"Would our tests catch a small, deliberate bug in this change?"**

Line coverage shows what code ran. Mutation analysis asks whether tests would **detect** a change. A suite with high coverage can still miss meaningful bugs.

This skill is adapted from [eferro's mutation-testing skill](https://github.com/eferro/skill-factory/tree/main/output_skills/testing/mutation-testing) for Peripheral Insights (Rails 8 / Minitest / Hotwire Stimulus). Prefer AI-assisted triage of the top 5–10 critical survivors over chasing a score.

## Core concept

1. Mentally (or with a future tool) introduce a small change (**mutant**) into production code.
2. Ask whether existing tests would **fail**.
3. Classify the outcome:

| State | Meaning | Action |
|-------|---------|--------|
| **Killed** | A test would fail | Effective — no action |
| **Survived** | Tests would still pass | Strengthen or add a test |
| **No coverage** | No test exercises the path | Add a behavior test |
| **Equivalent** | Observable behavior unchanged | Document and accept |

A surviving mutant is a bug the suite would not catch.

## When to use

- Always when invoked from **`adversarial-review` Step 3** on a branch/PR that changes production code.
- After TDD GREEN, to check that assertions would kill relevant mutants.
- When reviewing a branch for weak tests that look covered but do not assert enough.
- When validating that a refactor did not dilute detection power.

Skip deep analysis when the branch touches only docs, OpenSpec artifacts, skills, or fixtures with no production logic.

## Non-goals

- Do **not** install or configure Mutineer, Mutant, or Stryker in this skill.
- Do **not** change Gemfile, CI, or introduce a mutation gate.
- Do **not** chase 100% mutation score; equivalent and low-value survivors may be documented and accepted.
- Mutineer (or similar) may become an optional future platform tool; this skill stays mental / AI-triage first.

## Branch analysis process

### 1. Identify changed production files

```bash
git diff main...HEAD --name-only
```

Include production paths under `app/` (and related lib used by the app). **Exclude** tests, fixtures, factories, generated noise, docs, OpenSpec, and skill files:

```bash
git diff main...HEAD --name-only -- \
  ':(exclude)test/' ':(exclude)e2e/' ':(exclude)spec/' \
  ':(exclude)**/*fixture*' ':(exclude)db/schema.rb'
```

Prefer the merge base vs `main` when the branch is long-lived (`git merge-base main HEAD`).

### 2. Prioritize subjects

| Priority | Paths / kinds |
|----------|----------------|
| High | `app/services/**`, models with non-trivial logic, jobs, authz/permission helpers, money/date/status transitions |
| Medium | Controllers/form objects with branching; serializers that gate fields |
| Low / skip for ROI | Marketing Stimulus animations, pure presentational CSS, copy-only view tweaks |

Limit deep mutants to high-ROI changed methods. Cap actionable survivors at roughly **top 5–10** critical gaps (eferro economics: AI triage, not exhaustive automation).

### 3. Apply operators and check tests

For each prioritized change, apply universal operators (below), then for each mutant ask:

1. Does any test exercise this path?
2. Would that test **fail** if the mutant were applied?
3. Is the assertion specific enough (value, state, side effect) — not only "did not raise"?

### 4. Record survivors

Feed survivors into the adversarial-review findings table (Area `tests/mutation`) and optionally write a short report (see Output).

## Universal mutation operators

### Arithmetic

| Original | Mutant | Weak vs strong |
|----------|--------|----------------|
| `a + b` | `a - b` | Weak: `+ 0`. Strong: non-zero operands where sum ≠ difference |
| `a * b` | `a / b` | Weak: `* 1`. Strong: factors where product ≠ quotient |

### Comparison boundaries

| Original | Mutant | Test should hit |
|----------|--------|-----------------|
| `a < b` | `a <= b` | Equality at the boundary |
| `a >= b` | `a > b` | Exact boundary value |

### Boolean / logical

| Original | Mutant | Test should hit |
|----------|--------|-----------------|
| `a && b` | `a \|\| b` | One true, one false |
| `!a` | `a` | Outcome that depends on negation |

### Return / early-return / statement removal

| Original | Mutant | Test should verify |
|----------|--------|-------------------|
| `return x` | `return nil` / other value | Exact return or persisted state |
| Early `return` / guard | Removed | Guarded path still blocked |
| Side-effect line | Removed | Observable side effect (DB, job enqueue, mail) |

### String / collection literals

| Original | Mutant | Test should verify |
|----------|--------|-------------------|
| `"text"` | `""` | Non-empty / exact content when it matters |
| `[a, b]` | `[]` | Non-empty behavior |

**Red flags for surviving mutants:** assert_nothing_raised only; one side of a condition; identity operands (0, 1); stub called without args/result; no return or state assertion; boundary never tested.

## Ruby / Rails notes

- Prefer Minitest under `test/`. Assertions must be **specific**: `assert_equal`, `assert_predicate`, state on records, enqueued jobs — not only "no exception."
- Hit **boundary values** for ranges, statuses, and role checks (`>=` / `>`).
- Cover **error and authz paths** (forbidden roles, invalid params, failed service results).
- Do **not** treat system tests or Playwright E2E as reliable mutant killers for service/model logic; they are too coarse and flaky for this purpose. Unit/integration tests that target the changed subject count.
- Service objects and jobs: mutants that drop a side effect or flip a status should be killable by focused tests.

## JavaScript / Stimulus notes

- There is **no JS unit harness** today. For changed Stimulus controllers or pure helpers, run **mental mutants only** and note survivors as findings when behavior is non-trivial (state machine, validation, fetch error handling).
- Deprioritize animation/marketing controllers.
- **Stryker is deferred** until Vitest (or similar) exists for pure helpers. Do not set up Stryker in this skill.

## Survivor categorization and severity

| Category | Description | Adversarial severity guidance |
|----------|-------------|-------------------------------|
| Survived — business / auth / money / error path | Tests would not catch a meaningful logic flip | **Major** (or Blocker if security/privacy) |
| Survived — weak assertion | Path covered but assert too loose | **Major** if acceptance-critical; else **Minor** |
| No coverage | Changed production path untested | **Major** when behavior is required by the change |
| Survived — logging / message copy only | Log string or non-contract message mutant | **Minor** or **Question** |
| Equivalent | No observable difference | Document; do not inflate score pressure |

Put survivors that indicate real gaps in the adversarial **Findings** table with Area like `tests/mutation`.

## Output

Findings suitable for the adversarial-review table:

| Severity | Area | Finding | Evidence | Suggested fix |
|----------|------|---------|----------|---------------|
| Major | tests/mutation | `<mutant summary>` | `<file:method>` + why tests would pass | tests (and code/spec if needed) |

Optionally, when the review is part of OpenSpec apply verification, write:

`openspec/changes/<change>/reports/YYYY-MM-DD-mutation-analysis.md`

Keep it short: subjects analyzed, top survivors, equivalents accepted, severity recommendations.

## Integration

**`adversarial-review` Step 3** loads and follows this skill for changed production code on the branch/PR. Survivors that show real detection gaps become adversarial findings; equivalents and log-only mutants stay Minor/Question or documented acceptance.

## Quick checklist

For each prioritized changed method:

- [ ] Arithmetic / operator swap would fail a test?
- [ ] Boundary (`>=` vs `>`) covered?
- [ ] `&&` / `||` mixed truth values covered?
- [ ] Removed early-return or side-effect line would fail a test?
- [ ] Return value / persisted state asserted specifically?
- [ ] Error and forbidden paths covered where relevant?

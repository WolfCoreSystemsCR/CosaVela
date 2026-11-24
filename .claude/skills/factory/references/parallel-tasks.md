# Parallel tasks queue

Tasks listed here run when the user invokes **factory** without inline task arguments.

**Current run (2026-06-02):** `admin-report-assignment` (superadmin cross-user report operations). Parent branch: **`main`**.

**Worktree rule (mandatory):** Each task runs in `.worktrees/<change-name>/` on branch `feature/<change-name>`. Main checkout stays on `main` unless noted.

**Branching process:** See [portal-branching-process.md](./portal-branching-process.md).

**Enriched US source (this run):** `tmp/enriched-us/admin-report-assignment-enriched-us.md`.

**Pipeline:** enrich-us (skip — use enriched artifacts) → `openspec new` → `openspec ff` → `apply` → `verify` — **no archive, no commit**.

---

## Task: Admin report assignment and superadmin cross-user access

| Field | Value |
|-------|--------|
| **User story** | Superadmin can access all user reports, copy/assign reports, and delete reports |
| **Change name** | `admin-report-assignment` |
| **Branch** | `feature/admin-report-assignment` |
| **Parent branch** | `main` |
| **Worktree** | `.worktrees/admin-report-assignment` |
| **Epic** | Admin operations and superadmin report management |
| **Plan source** | `tmp/enriched-us/admin-report-assignment-enriched-us.md` |
| **Depends on** | Existing intranet/admin auth boundaries and report ownership model |
| **Queue status** | **queued** |
| **Skip enrich-us** | Yes — use pre-enriched artifact in `tmp/enriched-us/admin-report-assignment-enriched-us.md` |

### Original

Implement an admin feature so superadmins can copy a report from one user to another, access reports from every user as if they were their own (including rerun/synthesis actions), and delete user reports. Keep plan/report limits out of scope for this feature.

### Enhanced (implementation summary)

**Superadmin cross-user access:**
- Add global report accessibility (`accessible_by`) so superadmins can access all non-deleted reports from intranet.
- Keep regular users scoped to own reports only.
- Allow existing report actions on cross-user reports for superadmins (`report_analysis`, `retry`, synthesis actions, exports, progress endpoints).

**Copy and assign:**
- Add `ReportAssignmentService` to deep-copy latest report graph and assign ownership to target user.
- Add admin UI endpoints/form to select source report and target user.
- Copy report data graph: report version, steps, step data fields, synthesis sections, executive summary, key terms.

**Delete:**
- Add report soft-delete (`deleted_at`) action.
- Superadmin can delete any report; regular users cannot delete others.

**Explicit limit handling:**
- Do not integrate or call plan-tier limit checks in admin assign/copy flow.

### Definition of done

- [ ] OpenSpec change `admin-report-assignment`: proposal, design, tasks, specs; verify passes
- [ ] Superadmin cross-user intranet access implemented
- [ ] Admin copy/assign flow implemented
- [ ] Report soft-delete and scoping implemented
- [ ] Tests green for service + controller permissions + regressions
- [ ] Mandatory steps in `tasks.md` per `docs/openspec-tasks-mandatory-steps.md`

### Files likely in scope

- `config/routes.rb`
- `app/controllers/intranet/reports_controller.rb`
- `app/controllers/intranet/report_version_steps_controller.rb`
- `app/controllers/intranet/synthesis_sections_controller.rb`
- `app/controllers/intranet/executive_summaries_controller.rb`
- `app/controllers/intranet/key_terms_controller.rb`
- `app/controllers/admin/reports_controller.rb`
- `app/services/report_assignment_service.rb`
- `app/models/report.rb`
- `app/models/concerns/report_accessible.rb`
- `app/views/admin/reports/assign_new.html.erb`
- `app/views/intranet/reports/index.html.erb`
- `config/routes.rb`
- `openspec/changes/admin-report-assignment/*`
- `test/services/report_assignment_service_test.rb`
- `test/controllers/admin/reports_controller_test.rb`
- `test/controllers/intranet/reports_controller_test.rb`

### Enriched US detail files (read all before ff/apply)

1. `tmp/enriched-us/admin-report-assignment-enriched-us.md`

---

<!-- Previous task portal-details-ask (US-D11) — merged into integration/portal-accessibility -->
<!-- Previous task portal-settings-enablement — merged into integration/portal-accessibility -->

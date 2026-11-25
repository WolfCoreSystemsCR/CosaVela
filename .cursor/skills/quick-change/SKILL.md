---
name: quick-change
description: Use when the user asks for a change (feature tweak, bug fix, harness/platform change, or any other kind of work) informally, without a Jira ticket and without explicitly invoking enrich-us, an opsx command or factory (formerly run-parallel-tasks). Creates the Jira ticket, branch and OpenSpec change first (or afterwards in retroactive mode).
author: LIDR.co
version: 1.3.0
---

# Quick Change

**Announce at start:** "I'm using the quick-change skill to bring this request into the SpecBoot flow."

## Purpose

Small changes are often requested informally. This skill gives them the same trail as the full flow: Jira ticket in the active sprint, correctly named branch, OpenSpec change, verification, PR, In Review when the PR is open and Done once it is merged. OpenSpec is **always** used, even for minor changes and even when the user gives no Jira id.

## When it runs

Run it for any change request that has **no Jira ticket** and **no explicit SpecBoot command**.

Do **not** run it when the user invokes `enrich-us`, any `opsx:*` / `openspec-*` command, or `factory` (formerly `run-parallel-tasks`, including its queue keywords). Follow that pipeline unchanged.

## Steps

1. **Classify by request type.** The classification yields a pair: the Jira issue type and the branch prefix. Decide from the intent of the request, except Platform, which is decided by paths.

   | Kind of request | Jira issue type | Branch prefix |
   |-----------------|-----------------|---------------|
   | Platform: every touched file matches `ai-specs/**`, `.claude/**`, `.cursor/**`, `CLAUDE.md` / `docs/base-standards.md`, `docs/*standards*.md`, `docs/openspec-tasks-mandatory-steps.md`, `docs/platform-changelog.md`, `openspec/config.yaml`, `packages/specboot/**` | `Platform` | `platform/` |
   | Bug: something that worked is broken, or a defect | `Bug` | `bug/` |
   | Feature, Story, Task: new or changed product behavior, including small tweaks | the project issue type that best fits (`Feature` by default) | `feature/` |

   **Kinds not in the table.** Use common sense, not a fixed list:
   - Read the project's issue types with `listJiraProjectIssueTypesMetadata` and use the closest existing one. Never guess a type. If none fits, use `Task` and say so.
   - The prefix is a short lowercase kebab-case noun naming the kind of work (for example `hotfix`, `refactor`, `docs`, `chore`, `perf`).
   - Prefer an existing prefix when one fits (a small UI tweak is `feature/`, not `ui/`). Refactors, docs-only edits and chores are not product behavior, so they go through this fallback (`refactor/`, `docs/`, `chore/`).
   - State the chosen issue type and prefix, and the reason, in the announcement to the user.
   - Ask only when two reasonable options differ materially (for example Bug vs Feature for ambiguous wording).
   - Add a new prefix to the table above in the same change.

   The prefix does not change the lane: size gate, OpenSpec change and verification are identical. Delta specs are written only when a requirement changes: Platform changes never have them, and a non-Platform change with no spec-level behavior change (for example a refactor or a README edit) sets `skip_specs: true` too.
2. **Size gate.** Quick lane only if the change touches at most 5 files (count only the files the change itself edits; OpenSpec artifacts under `openspec/changes/`, reports and the `docs/platform-changelog.md` entry do not count) and does not touch `db/`, `config/routes.rb` or any API contract. Otherwise stop, report that the gate failed and why, and escalate to `enrich-us` followed by `openspec-ff-change`.
3. **Create the Jira ticket** in project `PER`. Use the issue type chosen in step 1 (read from the project's issue types, never guessed). Description: context, change, acceptance criteria, in English.
4. **Assign the active sprint.** Run `project = PER AND sprint in openSprints()` with `customfield_10020` and take the sprint id from the result. Assign it, then read the ticket's sprint field back to verify. Never guess a sprint id.
   **Link related tickets.** When the request modifies or extends the work of earlier tickets, link the new ticket to each of them:
   - Find the related tickets in this order: the conversation, archived OpenSpec changes in `openspec/changes/archive/`, `docs/platform-changelog.md` entries, and Jira keys in the last 10 commits of each file the change is expected to touch (advisory only: a key found just this way is confirmed with the user before linking). Ask once if unsure. If none exists, skip this sub-step and say so.
   - Read the site's link type names with `listJiraIssueLinkTypes` (never guess them) and create a `Relates` link from the new ticket to each related earlier ticket with `createJiraIssueLink` (Atlassian `executeWrite`).
   - Use `Blocks` or `Duplicate` only for a real dependency or duplicate. For `Blocks`, `inwardIssue` is the ticket that blocks and `outwardIssue` the blocked one. When the request redoes or replaces an earlier ticket's work, use `Duplicate` only if the earlier ticket is being abandoned; otherwise `Relates`, and ask once if unclear. A parent or epic is a field, not a link.
   - Read `issuelinks` back with `getJiraIssue` (view `evidence`, or `fields` including `issuelinks`) and report the links to the user.
5. **Create the branch** `<prefix>/PER-<n>-<short-description>` with the prefix from step 1 (for example `platform/PER-39-quick-change-branch-prefixes`, `bug/PER-40-fix-download-link`). The description is lowercase kebab-case, about 5 words at most. The Jira key is mandatory.
6. **Create the OpenSpec change** with `openspec new change "<name>"` and generate the artifacts following `openspec-ff-change` and `docs/openspec-tasks-mandatory-steps.md` (including the Platform lane). Planning runs with Opus high reasoning (CLAUDE.md §5).
   - Platform only: set `skip_specs: true` in `.openspec.yaml`; no delta specs.
   - Every other kind: write delta specs as usual, unless no requirement changes (refactor, docs-only edit): then set `skip_specs: true` and say why in the proposal.
7. **Apply** with separate development and testing/verification subagents (`openspec-apply-change`). The development subagent must not check off sections 8-16.
8. **Validate:** `openspec validate "<name>" --strict`.
9. **Document.**
   - Platform: add an entry to `docs/platform-changelog.md` (English, Keep a Changelog style, ends with the Jira link).
   - Every other kind: update the affected specs and canonical docs.
10. **Commit, PR and Jira status.**
    - Commit with the Jira key in the subject. Use the `commit` skill for commit, push and PR **only**: skip its step 7 (Jira status update); its step 6 (link the PR from Jira) still applies. `quick-change` owns the Jira status.
    - Open the PR (or reuse the existing one for this branch), then move the ticket to `In Review`: call `listJiraIssueTransitions`, pick the transition whose target status name is `In Review` (case-insensitive), call `transitionJiraIssue`, and read the status back. If no transition targets `In Review`, report the key, the current status and the available targets. Never substitute another status.
    - Link the PR from the ticket right after the PR exists and confirm the link is still present after a merge (step 11).
    - Merge only when the user asked for it. Move the ticket to `Done` only after the PR is merged (the user asked for the merge, or confirms it was merged), with the same transition-by-name procedure. Verification passing alone is not Done.
    - In the final summary report the Jira status action (moved to In Review or Done, skipped with the reason, or failed with the available transitions) and the PR URL.
11. **Link the PR from Jira** whenever GitHub is touched, whether the PR is created or merged. Link the PR URL from the ticket right after the PR exists (the `commit` skill does this) and confirm the link is still present after a merge. Skip a URL that is already linked. A Jira failure is reported, never hidden, and does not undo git work.

## Retroactive mode

Use it when changes already exist (uncommitted diff or commits) and neither the branch name nor the commits carry a Jira key.

1. Read the diff and commits, classify by request type (step 1) and apply the size gate (step 2).
2. Create the ticket from the diff (step 3), assign the sprint and link related tickets (step 4).
3. Rename the branch to include the key and amend or reword the commit messages to start with it. Do not rewrite history that was already pushed to a branch the user did not authorize.
4. Create the OpenSpec change describing the diff (step 6, artifacts only; mark already-implemented tasks done once verified).
5. Continue from step 8 (validate), then step 10: PR, `In Review`, and `Done` only after merge. Report the Jira status action and the PR URL.

## Notes

- Never inspect or reuse other branches, worktrees or in-progress OpenSpec changes to decide what to do. The only exception is looking up related tickets in step 4, which reads archived changes, the platform changelog and commit history, read-only, to find Jira keys.
- Jira errors are reported, never hidden. A Jira failure does not undo git work; report it and list what is left.
- Do not push to branches the user did not authorize.
- All artifacts, commits and tickets are in English.

| Excuse | Reality |
|--------|---------|
| "It is a one-line change, skip OpenSpec" | OpenSpec is always used. Use the quick lane, not no lane. |
| "No Jira id was given, so skip the ticket" | Create the ticket first, or use retroactive mode. |
| "The sprint id is probably 1" | Resolve it with `sprint in openSprints()` and read it back. |
| "It is a platform change, so no documentation" | The changelog entry is mandatory. |
| "The kind is not in the table, so use `feature/`" | Apply the fallback rule and report the choice. |
| "Just invent a prefix" | Prefer an existing prefix; new ones must be kebab-case nouns and added to the table. |
| "It is a small follow-up, no need to link" | Create the `Relates` link and read it back. |
| "The PR is open and verified, so mark it Done" | Open PR means In Review. Done only after merge. |
| "No need to move it to In Review, the user will" | Move it and read the status back. |
| "It touches six files but they are small" | The gate is five files. Escalate. |
| "The user asked for enrich-us, but this is quick" | Explicit SpecBoot commands bypass this skill. |

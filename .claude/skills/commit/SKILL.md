---
name: commit
description: Create focused commits and pull requests following repository standards.
author: LIDR.co
version: 1.2.0
---
# commit Skill

Use it when this workflow is required in the project.

## Instructions

# Role

You are an expert in version control and release workflows. You create clear, comprehensive commits and Pull Requests that align with project standards and make review and traceability straightforward.

# Arguments

**Optional.** `$ARGUMENTS` may contain:

- **Nothing (empty)**: Stage and commit all relevant changes in the working tree, then open a single PR.
- **Feature/ticket identifiers**: e.g. ticket IDs (e.g. `SCRUM-123`), branch names, or short feature labels. When provided, stage and PR **only** the changes that belong to those features; leave all other changes unstaged and uncommitted.
- **Description-only / no-git mode**: If the user **explicitly** says something like "no PR", "only commit" (meaning only produce the commit text), "only description", "don't touch git", "just the message", or "dry run", then do **not** run any git commands, create a PR, or change Jira. Only determine scope, list what would be staged, and output the proposed commit message (subject + body). The user can copy and run git commands themselves.

# Goal

1. Produce a **single, comprehensive commit** that accurately describes the relevant changes.
2. **Push** the branch and **create (or update) a Pull Request** for review.
3. If arguments were given: **stage and commit only** the changes tied to those features; do not touch other modified files.
4. After a successful commit, push, and PR, **link the PR from each related Jira issue**, then move it to **In Review**. Move it to **Done** only once the PR is merged.

# Process and rules

## 0. Description-only / no-git mode (check first)

If the user **explicitly** requested no git operations (e.g. "no PR", "only commit", "only description", "don't touch git", "just the message", "dry run"):

- Perform **only** steps 1–3: inspect state, resolve scope (which files/hunks would be staged), and write the full commit message (subject + body).
- **Do not** run `git add`, `git commit`, `git push`, or `gh pr create`. Do not modify the repository in any way. Do not transition Jira.
- Output for the user:
  1. List of files (and hunks, if partial) that would be staged.
  2. The proposed commit message in a copy-pasteable block.
- Then stop; skip steps 4, 5, 6, and 7.

## 1. Inspect current state

- Run `git status` and `git diff` (and `git diff --staged` if needed) to list all modified, added, and deleted files.
- Identify the current branch. If not on a feature branch, decide whether to create one from the base branch (e.g. `main` or `develop`) before committing.

## 2. Resolve scope: full commit vs feature-scoped commit

- **If `$ARGUMENTS` is empty or not provided**  
  - Treat all relevant changes (excluding files that should not be committed, e.g. `.env`, build artifacts, local config) as the scope for this commit.  
  - Stage all of those and proceed to step 3.

- **If `$ARGUMENTS` is provided (e.g. ticket IDs or feature names)**  
  - Map each argument to the changes that clearly belong to it (by path, ticket id in branch name, or context in diffs).  
  - Stage **only** the files/hunks that belong to those features.  
  - Leave any other modified files **unstaged** and do not include them in the commit.  
  - If a file contains both feature-related and unrelated changes, use `git add -p` (or equivalent) to stage only the hunks that belong to the requested features.  
  - If no changes clearly match the given arguments, report this and do not commit.

## 3. Commit message

- Write the commit message **in English** (per `docs/base-standards.md`).
- Make it **descriptive** (per Git Workflow in `backend-standards.md` and `frontend-standards.md`).
- Structure it so that:
  - **Subject line**: Short, imperative summary (e.g. "Add candidate filters to position list", "Fix validation for application deadline"). Optionally prefix with a scope or ticket id (e.g. `SCRUM-123: Add candidate filters`).
  - **Body** (if needed): Bullet points or short paragraphs describing what changed and why (areas touched, new behavior, fixes). Reference ticket IDs here if they apply.
- Do not commit secrets, `.env`, or other sensitive or generated artifacts.

## 4. Commit and push

- Create the commit with the message from step 3.
- Push the current branch to the remote (`git push origin <branch>`). If the branch does not exist on the remote, push with `-u` to set upstream.

## 5. Pull Request

- Use the **GitHub CLI (`gh`)** for all GitHub operations (per repository standards).
- Create or update the PR for the current branch:
  - **Title**: Clear, aligned with the commit (e.g. include ticket ID if applicable: `[SCRUM-123] Add candidate filters to position list`).
  - **Description**: Summarize the change set, link to the ticket if relevant, and note any testing or follow-ups.
- If the repo uses branch protection or required checks, mention that the PR is ready for review once checks pass.

## 6. Link the PR from related Jira issues

This step is mandatory after a successful step 5 and runs before the status update (step 7). Do not wait for the user to ask. Whenever GitHub is touched (PR created or updated), the PR must be reachable from Jira so the code can be tracked from the ticket.

Use the **related issues** defined in step 7.

For each related key:

1. Read the issue and check whether the PR URL is already linked (remote link or comment). If it is, skip it.
2. Otherwise link the PR URL: prefer a Jira remote link (find the operation with `discover`); if none is available, add a comment that contains the PR URL.
3. Confirm the link is present.

Skip when description-only / no-git mode ran, when the PR step failed, or when no related key was found. A Jira error does not undo the commit or the PR: report it and continue.

## 6b. Subscribe to the PR (factory tasks only)

When the PR belongs to a **factory task**, subscribe to it so review comments, CI results and reviews return to this session. Do not ask the user first. A task is a factory task when its branch was created by the `factory` skill in this session (or the change name and worktree record show `factory` created it), or the user says it came from `factory`. Where the branch is checked out does not decide it: it still counts after the worktree is removed, and a hand-made `feature/...` worktree or a `quick-change` branch does not count.

1. Call `subscribe_pr_activity` with the repository `owner`, `repo` and the PR number from step 5 (the call is idempotent).
2. Skip it when description-only / no-git mode ran, when the PR step failed, or when the branch is not a factory task (keep the default: ask the user whether to watch).
3. If the tool is unavailable (it exists only in Claude Code remote sessions) or fails, report it and continue. It never undoes the commit, the PR or the Jira updates.

## 7. Update related Jira issues

This step is mandatory after a successful step 4, step 5 and step 6. Do not wait for the user to ask. Do not skip it because the PR is still open or checks are pending.

**Related issues** are Jira keys found in any of:

- `$ARGUMENTS` (for example `PER-12` or `SCRUM-123`)
- The current branch name (for example `feature/PER-12-short-title`)
- The commit subject/body or PR title when it already contains a key

Do not invent a key. Do not search Jira for a "likely" ticket. If no key is present in those sources, skip this step and say so.

**Do not transition when:**

- Description-only / no-git mode ran.
- The commit, push, or PR step failed.
- No related Jira key was found.

**Target status:**

- After the PR is created or updated: `In Review`.
- `Done` only when the PR is confirmed merged: the GitHub state of the PR (use the available GitHub tools) or the user says it was merged. If the merge cannot be confirmed, the ticket stays `In Review`. Never assume a merge.
- If the ticket is already in the target status, or already `Done` when the target is `In Review`, skip and say so. Never move a ticket backwards.

**How to transition each related key:**

1. Call `getAccessibleAtlassianResources` when the cloud id is unknown.
2. Call `listJiraIssueTransitions` for that issue key.
3. Choose the transition whose **target status name** is the wanted status (`In Review` or `Done`, match case-insensitively). Use that transition's `id`.
4. Call `transitionJiraIssue` with that `id`. The status it returns is the read-back; confirm it is the wanted status.

If no available transition targets the wanted status, report the key, the current status, and the available target names. Do not pick a substitute (`In Progress`, `Done` for `In Review`, or similar). Do not comment on the issue as a stand-in for the transition.

A Jira error does not undo the commit or the PR. Continue with the summary and report the failure.

## 8. Summary for the user

- Report what was committed (files and scope).
- If arguments were provided: confirm which features/tickets were included and that other changes were left unstaged.
- Provide the PR URL (from `gh` output).
- Report each related Jira key where the PR was linked (or already linked, skipped, failed), then each moved to `In Review` or `Done`, skipped (reason), or failed (available transitions). For a factory task, also report whether the PR subscription succeeded, was skipped (reason) or failed.

# References

- `docs/base-standards.md`: English-only for commit messages and technical artifacts.
- `docs/backend-standards.md` and `docs/frontend-standards.md`: Git Workflow (feature branches, descriptive commits, small focused branches).
- Repository git workflow conventions: Use `gh` for GitHub and PR creation; optional ticket-based branch and PR linking.

# Notes

- **Description-only**: When the user asks for no PR or only the commit text, output the staging plan and message only; do not run any git or `gh` commands, and do not change Jira.
- Do not run destructive git commands (e.g. `git push --force` without explicit user request).
- If there are conflicts or the push is rejected, report the situation and suggest next steps (e.g. pull/rebase then push), but do not force-push unless the user asks.
- When arguments are provided, **only** the changes tied to those features are staged and committed; everything else remains in the working tree for a separate commit or PR.
- After a successful commit + PR, the PR is linked from related Jira issues, which then move to `In Review`. They move to `Done` only once the PR is merged.

| Excuse | Reality |
|--------|---------|
| "The user did not ask to update Jira" | Executing this skill includes the In Review transition. |
| "The PR is open, so mark it Done" | Open PR means In Review. Done only after the merge is confirmed. |
| "No ticket in arguments, so skip Jira" | Also read the branch name and the commit/PR title. |
| "The ticket is going to Done anyway, so skip the PR link" | Done does not show the code. Link the PR URL first so the code is tracked from Jira. |
| "Git succeeded; Jira can wait" | Transition before the summary. Report failures; do not skip silently. |
| "No In Review transition, so use Done or In Progress" | Report available targets. Do not substitute. |

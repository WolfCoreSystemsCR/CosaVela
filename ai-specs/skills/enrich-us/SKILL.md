---
name: enrich-us
description: Analyze and enhance user stories with complete, implementation-ready technical detail from direct ticket input or Jira.
author: LIDR.co
version: 1.0.0
---
# enrich-us Skill

Use it when this workflow is required in the project.

## Instructions

Please analyze and enrich the ticket: $ARGUMENTS.

Follow these steps:

1. Determine the ticket input source:
   - **Direct input mode (default when ticket text is provided):** Use the ticket content shared by the user in the prompt/chat.
   - **Jira mode (optional):** If the user provides a Jira id/key, or asks to use Jira (including references like "the one in progress"), use Jira MCP to fetch the ticket details.
2. **Already-enriched check (before any analysis):** Determine whether the ticket was already enriched by this skill. A ticket counts as already enriched when its content contains both an `[original]` and an `[enhanced]` section (Jira write-back format, `h2` headings), or both `## Original` and `## Enhanced` headings (direct input mode), and the `[enhanced]`/`## Enhanced` section is non-empty.
   - If already enriched: **skip the whole process**. Do not re-analyze, do not rewrite the enhanced content, do not update Jira and do not change the ticket status. Report it explicitly, for example: `Skipped: ticket <key or title> is already enriched (found [original] and [enhanced] sections). No changes made.` Then stop.
   - Re-enrichment only happens if the user explicitly asks for it (for example "re-enrich", "enrich again", "force"). In that case, replace the existing `[enhanced]` section instead of appending a second one.
3. Act as a product expert with technical knowledge.
4. Understand the problem described in the ticket.
5. Decide whether or not the User Story is completely detailed according to product best practices. Validate that it includes:
   - Full functionality description
   - Comprehensive list of fields to update
   - Required endpoints structure and URLs
   - Files/modules to modify according to architecture and best practices
   - Definition of done (implementation and delivery steps)
   - Documentation and unit test updates
   - Non-functional requirements (security, performance, observability, etc.)
   - E2E test cases, when the story changes frontend behavior (see step 6a)
6. If the story lacks enough technical detail for autonomous implementation, provide an improved version that is clearer, more specific, and concise, aligned with step 5. Use project technical context from `@documentation`. Return the result in markdown.
6a. **E2E test cases (only when the story changes frontend behavior).** Frontend behavior means anything a user sees or does in the browser: ERB views, partials, Turbo Frames/Streams, Stimulus controllers, Tailwind/portal UI, forms, navigation, flash messages. Pure backend, API-only, job, migration or harness stories skip this step and say `E2E test cases: N/A (no frontend behavior)` in `## Enhanced`.
   - Load and follow the `playwright-qa-scenarios` skill in **catalog mode** (`ai-specs/skills/playwright-qa-scenarios/SKILL.md`), with the story (and the draft enhanced content) as input. It reads the Rails code, builds a constraint matrix and produces the scenario list with ids, priorities, test layer and mock policy.
   - Add the result to `## Enhanced` as a `### E2E test cases (Playwright)` section. Do **not** create a separate file and do **not** write Playwright code here; the apply E2E step (`tasks.md` section 11) turns these cases into code and runs the suite.
   - Scenarios whose layer is `Minitest` stay in the list so the unit-test sections can cite them; only `E2E` and `API` scenarios go to the Playwright suite.
   - Open questions from the catalog go into the story's own open questions. Never invent product rules to fill a gap.
7. Output format (when not skipped) must always include:
   - `## Original`
   - `## Enhanced` (including `### E2E test cases (Playwright)` when step 6a applies)
   - **Required deliverable, not only a chat response:** write this `## Original` / `## Enhanced` output to `tmp/enriched-us/<change-name>.md` (or `tmp/enriched-us/<ticket-key>.md` in direct-ticket mode, when no change name exists yet). Create the `tmp/enriched-us/` directory if it does not exist. Returning the markdown in the response without writing this file does not satisfy this step.
8. Jira write-back is optional and only applies in Jira mode:
   - Update the Jira ticket by appending the enhanced content after the original content, with clear `h2` sections `[original]` and `[enhanced]` and readable formatting (lists/code snippets when useful).
   - If ticket status is `To refine`, move it to `Pending refinement validation`.

## Notes

- Do not require Jira when the user already provided full ticket content directly.
- If input is ambiguous (for example, user gives a short reference without content), ask whether to resolve via Jira or request the full ticket text.

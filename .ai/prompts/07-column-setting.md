# Prompt: Table Column Settings

Use this when asking an AI agent to add or adjust column visibility, column order, or saved table preferences in a frontend table.

```txt
You are working in my React / Next.js / TypeScript frontend project.

Task:
Add or update column settings for a table.

Context:
- Table/component name: <name>
- File path: <path>
- Current columns: <list current columns>
- Columns that should be shown by default: <list>
- Columns that should be hidden by default: <list>

Behavior:
- Users can show or hide columns.
- Keep required columns always visible if needed.
- Preserve the current table layout and existing filters/actions.
- Save the user’s column preference in the simplest safe way available.
  - Prefer localStorage if the preference is only needed on this browser.
  - Use backend settings only if the project already has a user-preference flow.

Constraints:
- Follow AGENTS.md.
- Inspect existing table patterns before editing.
- Reuse existing UI components and utilities.
- Make the smallest safe change.
- Do not break sorting, pagination, search, permissions, or row actions.
- Keep labels human-friendly for SME users.
- Add/update tests if the project already has tests.

After finishing, summarize:
- Files changed
- Default visible columns
- Hidden-by-default columns
- Where the preference is saved
- How to test manually
```

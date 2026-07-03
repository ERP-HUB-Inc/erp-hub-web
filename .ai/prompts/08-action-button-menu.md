# Prompt: Row Action Button Menu

Use this when asking an AI agent to add or restore the last-column row actions menu in a table.

```txt
You are working in my React / Next.js / TypeScript frontend project.

Task:
Add or restore the row action menu for a table.

Context:
- Table/component name: <name>
- File path: <path>
- Existing actions to include: <list actions>
- Navigation targets: <list routes>
- Dangerous actions: <list actions that need confirm dialogs>

Behavior:
- Show the action button in the last column.
- Use a dropdown menu for row actions.
- Keep common actions easy to reach:
  - View
  - Edit
  - Clone
  - Print / export if relevant
  - Void / delete only if allowed
- Preserve permission checks and confirmation dialogs.
- Do not duplicate actions in other columns.
- Keep the menu compact and readable.

Constraints:
- Follow AGENTS.md.
- Reuse existing menu, dropdown, icon, and confirmation patterns.
- Inspect the current row actions before editing.
- Make the smallest safe change.
- Do not change backend contracts.
- Do not remove authorization or safety checks.
- Add/update tests if the project already has tests.

After finishing, summarize:
- Files changed
- Actions included in the menu
- Any permission/confirmation behavior
- How to test manually
```

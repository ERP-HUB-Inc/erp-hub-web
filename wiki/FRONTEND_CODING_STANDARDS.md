# MarketChain Frontend Coding Standards

> Coding standards specifically for the Next.js / React / TypeScript frontend.

## Non-Negotiable Rules

- Use strict TypeScript.
- Avoid `any`; use `unknown` and narrow when input is truly unknown.
- Prefer readable, small components and functions.
- Reuse shared components, hooks, routes, constants, and formatters.
- Do not duplicate business rules that should come from the backend.
- Keep task diffs focused; do not refactor unrelated screens.
- Use `lucide-react` only unless the repository already has an approved exception.
- Follow `UI_DESIGN_SYSTEM.md`.

## Naming

Use intention-revealing names:

```ts
selectedAccount
remainingRevenue
handleAccountChange
formatCurrency
```

Avoid vague names such as `data2`, `temp`, `obj`, or `handleThing`.

Boolean names should read naturally:

```text
isActive
hasPermission
canApprove
shouldShowDetails
```

## Components

- One clear responsibility per component.
- Prefer explicit `Readonly` prop types.
- Avoid giant page components that combine API handling, calculations, modals, tables, and presentation.
- Extract repeated or conceptually distinct UI.

Example:

```tsx
type MetricCardProps = Readonly<{
  title: string;
  value: string;
  description?: string;
}>;
```

## Functions and Branching

Prefer early returns over deep nesting.

```tsx
if (!details) {
  return <EmptyState />;
}
```

Keep helpers focused and pure where practical.

## State

Do not store derivable values in state unnecessarily.

Prefer:

```tsx
const selectedAccount = accounts.find(...);
```

over duplicating it with `useState` unless user interaction requires independent state.

## Constants

Use named constants for:

- routes
- permissions
- storage keys
- statuses
- configuration

Avoid magic strings and repeated literals.

## Formatting

Use shared helpers for:

- currency
- percentage
- dates
- phone numbers
- masked values

Do not format the same business value differently on different pages.

## Error Handling

- Do not silently swallow errors.
- Show user-friendly messages.
- Do not display raw server stack traces or schema internals.
- Preserve user-entered data when a recoverable submission error occurs.

## Comments

Comment *why*, not obvious mechanics.

Good:

```ts
// Preserve the selected account while the detail route is replaced.
```

Avoid comments that simply repeat the code.

## Dependencies

Before adding a package:

1. Check existing dependencies.
2. Check whether the platform or project already solves the problem.
3. Avoid a dependency for trivial helper logic.
4. Consider bundle and maintenance cost.

## Dead Code

Remove dead code introduced by the change. Do not keep large commented blocks; rely on version control.

## Codex Rule

Before editing frontend code, inspect nearby patterns and match the existing architecture instead of creating a parallel one. Run typecheck, lint, and relevant tests before completion.

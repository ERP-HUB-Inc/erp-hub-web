# MarketChain Frontend Rules

> Engineering rules for Next.js / React frontend work.

## 1. Non-Negotiable Rules

- Use TypeScript with strict typing.
- Avoid `any`.
- Prefer server/client boundaries intentionally.
- Reuse existing components, hooks, formatters, and constants.
- Preserve API contracts unless backend changes are explicitly part of the task.
- Keep business logic out of presentational components.
- Do not hardcode API data.
- Do not invent fallback values that change business meaning.
- Handle loading, empty, error, and success states explicitly.
- Follow `UI_DESIGN_SYSTEM.md`.

## 2. Project Structure

Prefer feature-oriented structure.

Example:

```text
src/
  app/
  components/
    ui/
    shared/
  features/
    sales/
      components/
      hooks/
      services/
      types/
      utils/
    purchasing/
    inventory/
  lib/
  constants/
  types/
```

Do not create large miscellaneous utility folders with unrelated helpers.

## 3. Components

A component should have one clear responsibility.

Prefer:

```tsx
function SalesTargetCard(props: SalesTargetCardProps) {}
```

Avoid huge page components containing:

- API parsing
- business calculations
- formatting
- modal logic
- table definitions
- mutation logic
- rendering

Extract by responsibility.

## 4. Component Props

Use explicit types:

```tsx
type MetricCardProps = Readonly<{
  title: string;
  value: string;
  description?: string;
}>;
```

Prefer `Readonly` for props.

Avoid:

```tsx
props: any
```

## 5. State

Use local state only for UI-specific concerns.

Examples:

- selected tab
- modal open state
- temporary input
- expanded row

Do not duplicate server state in local state unless required.

Derive values when possible:

```tsx
const selectedAccount = accounts.find(...);
```

instead of storing derived state.

## 6. Hooks

Custom hooks should encapsulate reusable behavior, not just rename one line.

Good:

```text
useSalesPerformance
useAgentSearch
useCreateAgentForm
```

Avoid hooks with hidden side effects that make behavior difficult to trace.

## 7. Data Fetching

Keep API access in service/action layers.

Do not scatter raw `fetch` calls throughout visual components.

All requests should define:

- input type
- output type
- error handling
- cancellation/cleanup if relevant

## 8. Forms

Use the project's existing form stack consistently.

Validation rules should live in schemas when possible.

Normalize user input before submission where appropriate.

Example:

```tsx
const normalized = value.trim();
```

Do not reject harmless whitespace when normalization is safe.

## 9. Validation

User-facing validation should be clear.

Good:

```text
Reason is required
```

Avoid:

```text
Invalid input: expected string, received null
```

Translate schema-level failures into product language.

## 10. Loading States

Use:

- skeletons for page/card loading
- button pending state for mutations
- disabled controls while submitting

Do not leave users guessing whether an action is running.

## 11. Error States

Errors should:

- explain what failed
- preserve user input where possible
- use existing toast/error utilities
- avoid raw stack traces or backend internals

Authentication failures should use the project's established login redirect flow.

## 12. Empty States

Empty states must be intentional.

Examples:

```text
No transactions found.
No sales data is available for this period.
No agent accounts found.
```

Avoid blank screens.

## 13. Routing

Use project route constants/helpers where they exist.

Avoid scattered string literals like:

```tsx
router.push("/some/path")
```

Prefer:

```tsx
router.push(ROUTES.detail(id))
```

## 14. URL State

Use query parameters for shareable/filterable state when appropriate.

Examples:

- date range
- page
- search type
- selected filter

Avoid putting transient modal state in the URL unless it benefits navigation.

## 15. Session / Browser Storage

Use browser storage only when there is a clear reason.

Rules:

- use named constants for keys
- avoid storing sensitive information
- clean temporary workflow state after completion
- document why persistence is needed

## 16. Permissions

UI permissions are for experience, not security.

Use existing permission checks to:

- hide unavailable actions
- disable unavailable controls
- avoid exposing irrelevant menu items

Backend authorization remains authoritative.

## 17. Formatting

Reuse shared formatters for:

- currency
- numbers
- percentages
- dates
- phone numbers
- masked values

Avoid page-specific formatting duplication.

## 18. Lists & Tables

For large datasets:

- paginate
- avoid rendering thousands of rows
- support empty/loading states
- keep columns readable
- use stable keys

Do not use array index as key when a stable identifier exists.

## 19. Performance

Before optimizing, identify the actual problem.

Prefer:

- memoization only when justified
- lazy loading for expensive sections
- pagination/virtualization for large datasets
- stable callbacks when needed

Do not overuse `useMemo` or `useCallback`.

## 20. Accessibility

- Buttons must be real buttons.
- Inputs require labels.
- Icon-only buttons need accessible names.
- Keyboard focus should be visible.
- Dialogs should trap/restore focus correctly.
- Avoid clickable `<div>` when semantic elements exist.

## 21. Icons

Use `lucide-react`.

Do not mix icon libraries without a strong existing project reason.

## 22. Styling

Follow `UI_DESIGN_SYSTEM.md`.

Prefer existing Tailwind utilities and shared primitives.

Avoid:

- arbitrary per-page design systems
- inline style objects unless necessary
- unexplained magic values
- excessive one-off color values

## 23. File Size & Complexity

If a component becomes difficult to scan, split it.

Warning signs:

- many unrelated handlers
- many conditional branches
- several modals in one file
- large inline column definitions
- repeated UI fragments

Optimize for maintainability, not arbitrary line count.

## 24. Codex Workflow

Before editing frontend code:

1. inspect the page
2. inspect related types
3. inspect shared UI components
4. inspect service/action layer
5. inspect formatters/constants
6. identify the smallest safe change
7. implement
8. run type/lint/tests
9. summarize changed behavior

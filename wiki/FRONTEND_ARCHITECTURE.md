# MarketChain Frontend Architecture

> Defines frontend boundaries for Next.js / React features.

## Architectural Flow

```text
Route / Page
    ↓
Feature Container
    ↓
Feature Components
    ↓
Hook / Action / Service
    ↓
Backend API
```

## Principles

- Keep UI separate from authoritative business logic.
- Keep transport/API details out of presentational components.
- Prefer feature-oriented modules.
- Reuse shared primitives.
- Keep server/client boundaries intentional.
- Do not create a global abstraction for a feature-specific concept too early.

## Suggested Structure

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
    customers/
  lib/
  constants/
  types/
```

## Shared vs Feature Components

`components/ui` contains low-level primitives such as:

```text
Button
Card
Badge
Dialog
Input
Table
Progress
```

`components/shared` contains reusable product-level components such as:

```text
MetricCard
PageHeader
DataTable
EmptyState
StatusBadge
```

Feature-specific business components should stay inside their feature module until genuine reuse exists.

## Data Flow

Prefer one-way flow:

```text
API → typed result → feature logic → presentation
```

Do not mutate raw API response objects inside components.

## State Categories

Keep these concerns separate:

- **Server state:** backend data.
- **UI state:** modal, selected tab, expanded section.
- **URL state:** filters, search, pagination that should be shareable.
- **Form state:** editable values before submission.

## Business Calculations

Critical business formulas should be defined by the backend when they affect authoritative values.

Frontend may:

- format
- label
- visualize
- derive presentation-only state

Do not independently redefine financial/report formulas if the backend already owns them.

## Dependency Direction

Allowed:

```text
page → feature → shared
feature → service/API client
feature → shared utility
```

Avoid:

```text
shared UI → feature-specific module
shared utility → page component
```

## Error and Empty Boundaries

Every meaningful feature should represent:

- loading
- success
- empty
- recoverable failure
- permission-unavailable state when relevant

## Codex Rule

Before creating a new layer, hook, service, or shared component, inspect the existing feature structure and extend it when possible.

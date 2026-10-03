# MarketChain Frontend Testing Guide

## Priorities

Test user-visible behavior and frontend rules rather than internal implementation details.

Focus on:

- validation
- conditional rendering
- permission-driven UI
- formatting
- loading/empty/error states
- critical interactions

## Unit Tests

Good candidates:

- formatters
- validation schemas
- small derivation helpers
- permission predicates

Examples:

```text
missing target does not display NaN
zero expense shows a friendly empty state
currency formatting follows project convention
```

## Component Tests

Test what the user can observe.

Examples:

```text
View Details expands the metric section
invalid form shows "Reason is required"
changing account updates displayed details
```

Avoid asserting implementation-only state variables.

## State Coverage

Important screens should cover:

- loading
- success
- empty
- error
- unavailable permission/action

## Responsive Checks

For important dashboards and forms, verify:

- desktop layout
- tablet behavior
- mobile stacking
- no horizontal overflow

## Mocking

Mock API/service boundaries. Do not mock every helper or component.

## Regression Tests

For frontend bugs:

1. Reproduce the failure in a test.
2. Confirm the test fails.
3. Implement the fix.
4. Confirm the test passes.

## CI

At minimum run:

```text
typecheck
lint
frontend tests
```

Run the smallest relevant suite first, then broader checks.

# Coding Standards

## TypeScript

- Prefer strict and clear types.
- Avoid `any`.
- Keep API types separate from UI types when needed.
- Use union types for status, variant, and action names.

## Components

- Keep components focused.
- Use existing shared components first.
- Do not duplicate UI logic.
- Keep prop names clear.

## Forms

- Keep validation rules readable.
- Validate full datetime when time matters.
- Keep draft and submit rules separate if business requires it.

## Error handling

- Use project snackbar/toast pattern.
- Show useful messages.
- Do not swallow errors.

## Naming

- Use existing naming style.
- Constants should be uppercase when project style uses uppercase.
- Handlers should start with `handle` or `on` based on existing convention.

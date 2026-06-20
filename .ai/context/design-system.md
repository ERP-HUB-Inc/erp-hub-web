# Design System Notes

Update this with your real UI rules.

## Components

List shared components the AI should reuse.

Example:

- Button
- Input
- Select
- DatePicker
- DataTable
- Snackbar
- CopyText
- ConfirmDialog
- Chip

## Snackbar behavior

Example:

- Success messages use success variant.
- Error messages use error variant.
- Request ID should be copyable if `copyText` exists.
- Do not store ReactNode in sessionStorage; store serializable strings/data only.

## Layout rules

- Keep spacing consistent.
- Do not change layout unless requested.
- Support responsive behavior.

## Icons

- Use existing icon set.
- Do not add new icon libraries without approval.

# Frontend Architecture Notes

Update this file to match your project.

## Folder structure

```txt
src/
  app/ or pages/
  components/
  features/
  hooks/
  services/ or api/
  constants/
  utils/
  types/
```

## Data flow

Describe how data moves through the app.

Example:

1. Page loads route/search params.
2. Component calls server action or API client.
3. Data is stored in local reducer/state.
4. Form uses React Hook Form.
5. Submit calls action/API.
6. Result is shown with Snackbar.
7. User is redirected if needed.

## State management

Describe whether the app uses:

- React state
- Reducer
- Context
- Redux/Zustand
- Server actions
- Query library

## API pattern

Describe the normal pattern for API calls.

Example:

- API response has `code`, `message`, and `data`.
- Errors are mapped to Snackbar.
- Request ID or task ID comes from API response.

## Permission pattern

Describe permission helpers and examples.

Example:

```ts
const canEdit = hasPermission(PERMISSION.EDIT);
```

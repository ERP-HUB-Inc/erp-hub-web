# MarketChain ERP — User Management and Workspace Journey

## Purpose and scope

Enhance the existing User Management screens and post-login frontend journey so users reach their permitted ERP or POS workspace with minimal steps.

This is a frontend feature brief. Preserve the current authentication flow, user screens, permission helpers, frontend state management, and navigation patterns. Inspect the existing implementation before changing it; this brief describes intended behavior rather than confirming that every field or screen already exists.

Follow the [base design system](../context/2.%20design-system.md). Use the [report design guide](../context/5.%20design-system-report.md) when intentionally reusing its table, button, or statistic-card presentation. The separate [Google Stitch prompt](../prompts/09-user-management-stitch-redesign.md) describes the visual redesign deliverable.

## Active and deferred scope

The active scope includes:

- User list, create/edit form, and user detail.
- Permission-aware roles, workspace access, default workspace, and allowed/default locations.
- Post-login workspace preparation, location selection, route guards, and visible error states.
- POS header location context and permitted navigation between ERP and POS.

Terminal assignment, terminal selection, shift operations, and opening cash were marked as skipped in the original brief. Their frontend requirements are retained in the deferred section below. Do not introduce these screens, controls, or prerequisites in the active journey. Preserve any existing terminal/shift behavior already present in the application.

## Workspace access

Determine available workspaces from the existing effective permission/capability context. Role names are display and assignment labels; do not route users using hardcoded names such as Cashier, Manager, Admin, or Owner.

| Available access | Workspace label | Default-workspace behavior |
| --- | --- | --- |
| POS only | POS | Fixed to POS; ERP cannot be selected |
| ERP only | ERP | Fixed to ERP; POS cannot be selected |
| ERP and POS | ERP + POS | Administrator can choose ERP Dashboard or POS |
| Neither | Access not configured | Show an explanatory state with a sign-out action |

Reuse the existing authorization model for users with multiple roles. Show and allow multiple role assignments only if supported by the current implementation. Do not invent permission identifiers or new rules for combining roles.

## User list

Keep existing search, filters, pagination, and permission-aware actions. Improve readability with these columns where the data is supported:

| Column | Presentation |
| --- | --- |
| User | Name, with username or supported contact information beneath it |
| Roles | Readable role labels; summarize overflow |
| Workspace | POS, ERP, or ERP + POS |
| Locations | First location with a concise additional-count label, such as “Toul Kork +2”; provide access to the full list |
| Status | Existing status label and a text-backed badge |
| Last login | Available timestamp; show an unavailable placeholder when absent |
| Actions | View, Edit, and Disable where permitted |

Use the existing status vocabulary. Active, Inactive, and Locked are possible display states only when supported. Prefer the existing Disable User action over introducing permanent deletion.

Show loading, empty-list, no-search-results, and error states. Do not imply that an unavailable last-login value or user count is zero. Keep long names, multiple roles, and location summaries readable.

## Create and edit user

Preserve existing basic user fields and validation. Group supported fields clearly:

- User information: name, username, and email/phone when supported by the current form.
- Status and existing account controls.
- Access & Workspace: roles, effective access, default workspace, allowed locations, and default location.

### Access & Workspace

- Present effective workspace access as a clear read-only summary derived from the existing permission context. Do not create an independent toggle that grants access separately from permissions.
- Use existing role/permission assignment controls and show editing actions only to authorized administrators.
- For a single available workspace, show its fixed default clearly. For ERP + POS, provide ERP Dashboard and POS choices.
- Support one or multiple allowed locations and an optional default location.
- Use the shared backend-searchable `SelectLocation` from [src/components/stateful/index.jsx](../../src/components/stateful/index.jsx), extending it in that folder if multi-selection or other required behavior is missing. Users must be able to find locations outside the initially loaded options.
- Limit default-location choices to the assigned locations. Keep selected labels readable when search results change or the form is restored.
- Show only relevant controls. Terminal and shift configuration remain deferred; do not add them to the current form.

### Validation and saving

- A user with POS access requires at least one allowed location.
- A default location, when selected, must belong to the allowed locations.
- POS-only users must have POS as their default workspace; ERP-only users must have ERP.
- Revalidate dependent fields when roles, workspace access, or allowed locations change. Show a field-level explanation if a previously selected default becomes invalid; prevent invalid submission.
- Preserve existing rules for usernames, contact fields, passwords, and status changes. Do not introduce unsupported fields or assume which fields are required.
- Use the current form validation and submit flow. Keep entered values when saving fails, prevent duplicate submissions, and show clear success/error feedback.
- Do not show stored passwords, tokens, or other hidden account data in forms or details. Preserve existing password-change/reset flows if present.

## User detail

Use clear sections rather than a long ungrouped field list:

1. User information: name, username, supported contact fields, and status.
2. Access: assigned roles and effective permissions visible to the viewer.
3. Workspace: available workspaces and configured default.
4. Locations: complete allowed-location list and a clearly marked default.

Provide permission-aware navigation to Edit User. Show unavailable information explicitly and handle loading, access-denied, and failed-load states. Keep sensitive fields hidden unless the current viewer may see them.

## Post-login frontend journey

```text
Login succeeds
  ↓
Preparing your workspace…
  ↓
Wait for existing user, permission, and workspace context
  ├─ ERP only → Existing ERP dashboard route
  ├─ POS only → Resolve allowed location → Existing POS entry
  ├─ ERP + POS → Configured default
  │                 ├─ ERP → Existing ERP dashboard route
  │                 └─ POS → Resolve allowed location → Existing POS entry
  └─ No workspace access → Access not configured
```

Keep destination resolution in one existing or shared frontend utility. Do not duplicate redirects across login, dashboard, and POS pages.

- Wait until access context is ready before navigating.
- Avoid redirect flicker such as Login → ERP Dashboard → POS.
- Use the application's existing routes; `/dashboard` is an example, not a required new route.
- Recheck that the selected default is currently permitted before entering a workspace.
- If required context fails to load, show an error and Retry. Do not treat loading failure as successful access resolution.
- If both workspaces are permitted but the default is missing or invalid, preserve the existing supported fallback. If no fallback exists, resolve the UX rule before implementation; do not silently choose a workspace.

## Location selection

For entry into POS:

| Situation | Frontend behavior |
| --- | --- |
| One allowed, available location | Select it automatically |
| Several allowed locations and a valid default | Select the default automatically |
| Several allowed locations without a valid default | Show Select Location |
| No assigned/available location | Show a configuration error; do not enter POS |

The selection screen should ask “Where are you working today?”, show only permitted locations, indicate the current selection, and provide Continue and Sign Out. Keep Continue disabled until a valid selection is made. Support search for long lists, loading, no matches, unavailable locations, and retry after a load failure.

Do not offer disabled or unassigned locations. Do not retain a stale default as an eligible choice merely because it was previously selected.

## Route guards and session navigation

- Protect ERP, POS, and User Management routes using the existing permission helpers, including direct navigation to a URL.
- Render a loading state while access is unresolved; render the existing 403/Access Denied state when access is denied.
- Apply permission checks to controls and actions as well as navigation entries.
- Show the active permitted location in the POS header from the current frontend session context. Do not hardcode location labels.
- For ERP + POS users, provide existing Open POS / Exit POS navigation where permitted. Exit POS returns to the ERP dashboard and must not sign out or close an existing shift.
- For POS-only users, do not offer Exit POS to ERP; provide Sign Out.
- Show Switch Location only when more than one location is allowed and the existing location-switch capability permits it. Preserve existing restrictions around an active shift.

## Frontend feedback states

| State | Expected presentation |
| --- | --- |
| Preparing access | Neutral loading screen: “Preparing your workspace…” |
| No workspace access | “Your account does not have access to a workspace. Please contact an administrator.” |
| POS access without an assigned location | “POS access is not configured. No location has been assigned.” |
| Access denied | Existing 403/Access Denied view |
| Context or option load fails | Clear error, Retry, and preserved selection where still valid |
| Inactive/locked account | Present the existing sign-in rejection or account-status message without continuing into a workspace |
| Form submission fails | Keep entered values, show useful feedback, and allow correction/retry |

## Optional future preference

Remember Last Workspace is not active scope. If later approved, expose an explicit preference and define its relationship to the administrator's configured default. Do not implicitly override the default with a remembered workspace. Single-workspace users always enter their permitted workspace.

## Deferred frontend flows: terminals and shifts

Retain these requirements for a separately approved phase:

- Terminal assignment: select allowed terminals for assigned locations; a default terminal must be assigned and belong to its relevant/default location.
- Terminal resolution: after location selection, automatically select the sole terminal or valid default; otherwise show an eligible-terminal selector.
- Existing shift: show Resume Shift for the current permitted context. For a shift on another terminal, explain that context and provide the existing allowed recovery action.
- No open shift: show Start Shift with location, terminal, cashier, opening-cash input, Cancel, and Start Shift. Opening-cash defaults and validation must follow approved application rules.
- POS header: show the active terminal and shift status only when that feature is enabled and the information is available.
- Close Shift: retain a separate summary/count/confirmation journey. Leaving POS must not close a shift.
- Switch Terminal/Location: offer only permitted actions and preserve existing shift restrictions. Do not assume terminal transfer is allowed.
- Missing/disabled terminals: explain the problem and prevent entry through that terminal.

These are UI and navigation requirements only. Do not add terminal/shift controls to the current redesign or make them new login prerequisites.

## Frontend acceptance checklist

- Existing user creation, editing, details, role assignment, status controls, and supported password flows remain usable.
- Fields and actions respect the current viewer's permissions.
- Workspace defaults and allowed/default locations validate together.
- Location selection can find permitted records outside the initial options.
- ERP-only, POS-only, and dual-access journeys reach the correct permitted destination without flicker.
- Loading, no-access, no-location, expired/unavailable context, and retry states are clear.
- Long names, multiple roles/locations, English/Khmer labels, mobile layouts, and keyboard focus remain readable and usable.
- Tests cover permission-driven rendering/routing, form validation, dependent defaults, location selection, loading, and error recovery.
- Terminal and shift functionality is preserved where already implemented and remains deferred for new work.

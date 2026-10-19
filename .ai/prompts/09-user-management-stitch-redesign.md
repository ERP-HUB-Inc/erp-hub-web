# Google Stitch prompt — User Management and Workspace Journey

Based on the [frontend user-management brief](../features/user-management.md). Copy the prompt below into Google Stitch; it is self-contained and does not require repository access.

---

Design a polished, high-fidelity User Management experience for MarketChain ERP, an existing business application with ERP and POS workspaces. Redesign the relevant screens as one coherent, connected flow that an administrator and a staff member can understand quickly.

This is a UI/UX redesign of an existing product. Keep the surrounding ERP sidebar/top navigation consistent across screens. Focus on user administration and the transition into a permitted workspace. Produce responsive designs and interaction states, with clear visual hierarchy and practical business-software density.

## Visual direction

- Clean light theme: pale neutral/slate canvas, white panels, subtle gray borders, restrained shadows, and dark readable text.
- Primary brand accent: teal `#14b8a6`. Hover/focus accent: cyan `#06b6d4`. Use teal for active indicators and the main action in each group.
- Use secondary bordered buttons for Cancel, Reset, and supporting actions. Use a compact, consistent action menu in table rows.
- Use a consistent spacing rhythm around 8, 12, 16, and 24px; comfortable form spacing; approximately 12px panel corners. Keep the interface refined and usable rather than oversized or decorative.
- Use small, consistent line icons. Status badges must include text, not color alone. Ensure accessible text contrast, visible focus states, and clear disabled states.
- Typography should support English and future Khmer translations without clipping or fixed-height text containers.
- The existing implementation uses React and Ant Design-style controls. Favor practical tables, selects, tags, radio choices, alerts, skeletons, and conventional forms that can be implemented with those patterns.
- Use fictional names and locations for static examples. Do not display passwords or sensitive account data.

## Screen 1 — User Management list

Create a desktop page with a clear title, short description, and permission-aware “Create User” primary action.

Include a search/filter toolbar and a readable table with these columns:

- User: name, with username beneath it; contact details only where available.
- Roles: one or several role tags, with concise overflow handling.
- Workspace: ERP, POS, or ERP + POS.
- Locations: first location plus an additional-count label such as “Central Store +2”, with a way to view all assigned locations.
- Status: Active, Inactive, or Locked where supported.
- Last login: a readable time/date or an unavailable placeholder.
- Actions: View, Edit, Disable as permitted. Use a clear confirmation for disabling an account.

Include row-range information and pagination. Design loading, empty-list, no-search-results, failed-load/Retry, and restricted-action states. Do not add summary counters unless a useful, supported metric is provided.

Show a mobile version with the same key information and accessible row actions.

## Screen 2 — Create User and Edit User

Use a clear page or generously sized panel with consistent section headings and a visible Save/Cancel action group. Keep the desktop layout compact enough to scan; stack sections on mobile.

Sections:

1. User information: name, username, supported email/phone fields, and existing account status controls. Mark required fields clearly without inventing new requirements.
2. Roles and access: role assignment and an easy-to-read effective-permissions summary. Support multiple roles where enabled.
3. Access & Workspace: effective workspace access, default workspace, allowed locations, and default location.

Important interaction rules:

- “Workspace Access” is a read-only result of the user's effective permissions, not an independent toggle that grants access.
- POS-only: show a fixed POS default; ERP is unavailable.
- ERP-only: show a fixed ERP Dashboard default; POS is unavailable.
- ERP + POS: let the administrator choose ERP Dashboard or POS using a clear radio group or equivalent control.
- Allowed Locations supports multiple selections, removable chips, and remote search, including results beyond the initial list. Show selected labels consistently when searching.
- Default Location is optional and must be selected from the assigned locations only.
- POS access requires at least one allowed location.
- Changing roles or removing an assigned location can invalidate a previous default. Show the affected field error and prevent saving until corrected.
- Preserve entered values on save failure. Show saving, success, disabled, validation-error, and failed-save states.
- Do not show controls or editable permissions unavailable to the current administrator.

Include one populated Edit User example for a dual-access user and alternate states for ERP-only and POS-only users.

## Screen 3 — User detail

Create a clear read-only overview with these groups:

- Identity and status.
- Roles and effective permissions visible to the viewer.
- Workspace access and default workspace.
- Complete allowed-location list with the default clearly marked.

Include permission-aware Edit and Disable actions and a return to the user list. Keep long names, multiple roles, and many locations readable. Include unavailable-data and access-denied treatments.

## Screen 4 — Preparing workspace and Select Location

Keep login changes limited to the transition after successful sign-in.

Show a calm loading state: “Preparing your workspace…” while the current user's access is resolved. Do not flash the ERP dashboard before sending a POS user to POS.

The intended journey is:

- ERP-only → ERP dashboard.
- POS-only → Resolve location → Existing POS entry.
- ERP + POS → Configured default workspace → ERP dashboard or Resolve location → Existing POS entry.
- No workspace access → Access not configured.

Do not ask the user to choose a location when exactly one available location is assigned or when a valid default is already available.

For multiple assigned locations without a valid default, design “Select Location” with the subtitle “Where are you working today?” Use searchable location choices with a clear selected state. Include Continue and Sign Out. Continue remains disabled until a valid choice is selected. The screen must work with a few locations and with a long searchable list.

## Screen 5 — Access and navigation states

Design these supporting states:

- No workspace access: “Your account does not have access to a workspace. Please contact an administrator.” Include Sign Out.
- POS access with no assigned location: “POS access is not configured. No location has been assigned.” Provide a clear next step.
- Context-load failure: show Retry without losing a still-valid selection.
- Access Denied: a clear permission message and an allowed navigation action.
- Inactive or locked account: a useful status message with no entry into a workspace.
- Missing or invalid default-workspace configuration: show a configuration problem without silently choosing an unauthorized destination.

Show a small POS header/profile-menu example with the active location. Dual-access users can have an “Exit POS” action returning to ERP; POS-only users receive Sign Out instead. Show Switch Location only when multiple locations and that action are permitted. Preserve any existing restrictions on switching locations.

## Scope boundaries

Terminal assignment, terminal selection, opening cash, Start Shift, Close Shift, and Remember Last Workspace are deferred. Do not include them in the current forms or introduce them as steps before POS entry. Exiting POS must remain distinct from closing a shift.

Use the person's effective permissions to explain access. Role labels such as Cashier or Manager must not imply a fixed destination on their own.

Focus on screen design, component states, interaction flows, and responsive behavior. Keep SQL, data models, endpoint design, server logic, and implementation infrastructure out of the design deliverable.

## Requested output

Produce one consistent visual direction across all five screen groups, with:

- Desktop and mobile designs for the list, user form, user detail, and location selection.
- Connected states showing list → detail/edit, create/edit → validation/save feedback, and workspace preparation → location selection or an explanatory access state.
- Reusable styles for buttons, fields, remote-search selects, tags, table rows, alerts, and loading states.
- Short interaction annotations for conditional fields, permission visibility, invalid defaults, and automatic location selection.

Prioritize clarity, low click count, readable business data, and consistent controls across the complete journey.

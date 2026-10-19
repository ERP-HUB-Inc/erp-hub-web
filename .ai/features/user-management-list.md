Implement the **User Management page** shown in the attached screenshot in my existing MarketChain ERP application.

First read the existing design system Markdown, frontend/backend rules, API conventions, and relevant project instructions. Inspect the existing authentication, user, role, location, workspace, and permission implementations before making changes.

Reuse existing components and services. Connect this page to the User Management sidebar item already added under System & Security.

## 1. Scope and layout

Build the page content shown in the screenshot:
- Page header and actions.
- Four statistic cards.
- Search and filter panel.
- Active filter chips.
- Selectable user table.
- Row actions.
- Pagination and page-size selector.

Preserve the existing shared header, sidebar, logo/version display, and sidebar operational-status footer.

Use:
- Pale gray-blue page background.
- White rounded cards and filter panel.
- Dark navy primary text.
- Muted secondary text.
- Teal primary buttons and active states.
- Pale blue table header/footer and role badges.
- Subtle borders, shadows, and horizontal row dividers.

Follow existing design tokens, typography, icons, spacing, and accessibility conventions. Support Khmer and English names.

## 2. Page header

Include:
- Large title: User Management.
- Adjacent pale blue rounded badge with teal dot and total:
  “38 Total Users” in the reference.
- Description:
  “Manage team members, role assignments, location scopes, and workspace access across ERP and POS.”
- Right-aligned actions:
  - Export Users with download icon.
  - Teal Create User with plus icon.

Use actual user counts. Show actions according to existing permissions.

Create User must open the existing user creation route/form. If none exists, implement a focused form using existing user fields, roles, workspace access, location selection, and account-provisioning conventions. Do not invent temporary password or invitation behavior.

## 3. Four statistic cards

Use four equal-width, equal-height cards on desktop, two columns on tablet, and one on mobile.

### Active Staff
- Heading: ACTIVE STAFF.
- Value: 34.
- Inline teal comparison: +2 this wk.
- Right-side ID-badge icon in a pale mint tile.

Calculate the weekly comparison from a defined existing metric. If historical data is unavailable, omit the comparison rather than inventing it.

### POS Registers
- Heading: POS REGISTERS.
- Value: 18.
- Inline unit: Terminals.
- Right-side POS register icon in a pale blue tile.

Count actual terminals/registers. Do not substitute the number of POS-enabled users.

### Cross-Workspace
- Heading: CROSS-WORKSPACE.
- Value: 12.
- Inline label: ERP + POS.
- Right-side network/workspace icon in a pale blue tile.

Count users authorized for both workspaces.

### Security Flags
- Heading: SECURITY FLAGS.
- Value: 1 in amber/brown.
- Inline label: Locked in red.
- Right-side lock/security icon in a pale amber tile.

Use actual account security state. Distinguish account lock from administrative deactivation.

Define whether cards follow page filters or represent the overall authorized tenant scope, and keep this consistent and clear. Never calculate global statistics from only the current table page.

## 4. Search and filter panel

Place inside a white rounded container.

First row:
- Wide search input with search icon.
- Placeholder:
  “Search by name, @username, or email…”
- Keyboard hint: ⌘K on macOS, Ctrl+K where appropriate.
- Role dropdown: Role: All Roles.
- Workspace dropdown: Workspace: All Workspaces.
- Status dropdown: Status: All Statuses.
- Location dropdown: Location: All Locations.
- Reset action with reset icon.

Behavior:
- Search name, username, and email.
- Use existing query/debounce conventions.
- Workspace options include ERP Only, POS Only, and ERP + POS, mapped to actual permissions.
- Status options follow the actual account model, including Active, Inactive, and Locked where supported.
- Role and location options come from authorized real data.
- Apply filters together and reset pagination when they change.
- Reset clears search and optional filters to their defaults.
- Keyboard shortcut focuses search without conflicting with existing global shortcuts.

Second row:
- Label: Active filters:
- Removable chips matching the screenshot’s treatment.
- Reference chips:
  - Scope: All Locations ×
  - Workspace: Any ×

Only show removable chips for actual applied filters. Do not present unrestricted defaults as restrictive filters unless that is an established application convention.

Removing a chip must update its corresponding control and query.

## 5. User table

Columns in this exact order:

1. Selection checkbox.
2. USER.
3. ROLES.
4. WORKSPACE.
5. LOCATIONS.
6. STATUS.
7. LAST LOGIN.
8. ACTIONS.

### Selection
- Header select-all checkbox with indeterminate state.
- Row selection checkboxes.
- Define select-all as current-page selection unless the existing application supports all-results selection explicitly.
- Preserve selection by stable user IDs.
- Clear or reconcile selection when the authorized scope changes.
- Integrate selection with existing permitted export/bulk behavior; do not add unsupported destructive bulk actions.

### User
- Circular initials avatar with subtle varied background colors.
- Bold full name.
- Secondary line:
  @username • email
- Small teal dot beside the name when a real presence signal exists.
- Lock icon beside the name for a locked account.
- Do not imply online presence merely because an account is active.

### Roles
- Compact pale blue role badges.
- Show a small number of roles followed by “+1 more” or the actual additional count.
- Allow a tooltip/popover to reveal all role names accessibly.
- Use actual role assignments.

### Workspace
Display rounded icon-and-text pills:
- ERP + POS: mint.
- POS Only: pale blue.
- ERP Only: pale lavender-blue.

Derive these from actual access permissions rather than a decorative frontend flag.

### Locations
- Show the primary/first assigned location.
- Additional-location count badge, such as +2 or +1.
- Tooltip/popover reveals the complete list.
- Display All Locations (HQ) only for an actual all-location scope.
- Preserve the distinction between unrestricted scope and a list of specific locations.

### Status
Use dot-and-text pills:
- Active: mint/teal.
- Inactive: neutral gray-blue.
- Locked (Security check): pale amber with amber text.

Use actual account state and lock reason. Provide fallback text for unknown states.

Inactive rows may use muted styling as in the screenshot, while maintaining readable contrast and usable authorized actions.

### Last Login
- Format using the configured business/user timezone.
- Examples:
  - Today, 10:42 AM.
  - Yesterday, 5:30 PM.
  - 4 days ago.
  - Oct 11, 2026.
- Provide the precise timestamp in a tooltip where useful.
- Show Never signed in when confirmed; show “—” for unavailable data.

### Actions
Three aligned icon buttons:
- Eye: View user.
- Pencil: Edit user.
- Vertical ellipsis: More actions.

Use subtle hover/focus backgrounds. The ellipsis button may show a pale blue rounded active background when its menu is open.

All icon buttons require accessible labels.

## 6. Reference table data

Use these only as development fixtures for visual comparison:

1. Sophanna Morn
   - Avatar SM.
   - @morn.s • s.morn@marketchain.io.
   - Store Manager, Cashier, +1 more.
   - ERP + POS.
   - Central Store +2.
   - Active.
   - Today, 10:42 AM.

2. Chan Dara
   - Avatar CD.
   - @dara.c • dara.chan@marketchain.io.
   - Cashier.
   - POS Only.
   - Toul Kork Branch.
   - Active.
   - Today, 08:15 AM.

3. Kimheng Voeun
   - Avatar KV.
   - @kimheng.v • k.v@marketchain.io.
   - Inventory Lead.
   - ERP Only.
   - Main Warehouse +1.
   - Active.
   - Yesterday, 5:30 PM.

4. Bopha Seng
   - Avatar BS.
   - @bopha.s • bopha.seng@marketchain.io.
   - Staff Trainee.
   - POS Only.
   - Sen Sok Hub.
   - Inactive.
   - 4 days ago.

5. Rithy Panh
   - Avatar RP.
   - @rithy.p • rithy.panh@marketchain.io.
   - Senior Auditor.
   - ERP Only.
   - All Locations (HQ).
   - Locked (Security check).
   - Lock icon beside name.
   - Oct 11, 2026.

Do not populate production with these example accounts or hardcode screenshot totals.

## 7. View, edit, and more actions

- View opens existing user details in the established page/drawer/modal pattern.
- Edit opens the existing user form with current assignments.
- More actions must come from actual supported account operations and permissions.
- Reuse existing enable/disable, unlock, invitation, password-reset, or session-management operations only where supported.
- Do not display unsupported menu commands.

Sensitive account changes:
- Require an appropriate confirmation dialog describing the actual consequences.
- Use backend authorization and validation.
- Prevent self-lockout or removing the last required administrator according to existing business rules.
- Do not allow an administrator to grant roles or location scopes beyond their authority.
- Refresh the row and affected summary counts after successful changes.
- Keep the UI unchanged after failures and show a useful error.

Do not claim that disabling an account terminates sessions or invalidates POS tokens unless the backend actually performs those operations.

## 8. Export Users

- Reuse the existing export format and download utilities.
- Export the current authorized filter scope, or selected users when selection is explicitly indicated.
- Make export scope clear.
- Export appropriate displayed user fields.
- Exclude credentials, password hashes, tokens, secret PINs, and other authentication secrets.
- Apply export permission and backend access checks.
- Show progress/loading and handle errors.
- Follow existing CSV/spreadsheet escaping conventions.

## 9. Footer and pagination

Inside a pale blue table footer:

Left:
- “Showing 1 to 5 of 38 users”.
- Page-size selector: 10 / page.

Right:
- Previous arrow.
- Page numbers 1, 2, 3, 4.
- Next arrow.
- Selected page highlighted in teal.

Use actual ranges, page size, and total results. The screenshot displays five sample rows with a ten-row page size; do not intentionally hide available rows to copy that mismatch.

Use server-side search/filtering/pagination where supported. Keep URL query state consistent with existing application conventions.

## 10. Workspace access and login compatibility

Ensure user assignments remain compatible with the existing ERP/POS access journey:
- ERP Only users access authorized ERP pages.
- POS Only users follow the existing branch → terminal → shift flow.
- ERP + POS users retain the existing workspace-selection/default behavior.
- Location assignments limit available branches and resources through backend rules.

Reuse the existing access model. Do not implement a separate authorization system or rewrite login routing as part of this page.

## 11. Integration and page states

- Reuse existing API clients, form validation, toast notifications, query caching, and error handling.
- Enforce tenant/location/permission boundaries on the backend.
- Hide unauthorized controls and protect direct routes/API operations.
- Provide loading skeletons for statistics and table rows.
- Provide empty states for no users and no filter matches.
- Provide retryable errors.
- Distinguish unavailable metrics from confirmed zero.
- Prevent stale requests from replacing newer filter results.
- Retain filters when returning from user details/edit where consistent with the application.

If backend fields or endpoints are missing, implement within the existing user module where available and report exact remaining dependencies. Do not fake successful mutations or fabricated statistics.

## 12. Completion checks

Verify against the screenshot:
- Header, total badge, subtitle, Export Users, Create User.
- All four statistic cards and icons.
- Search, keyboard hint, four dropdowns, Reset.
- Active-filter label and removable chips.
- All eight table columns.
- Avatars, role overflow, workspace badges, location overflow, status pills, login formatting, and all three row actions.
- Selection, page-size control, result range, and pagination.
- Responsive behavior and accessible focus/labels.
- Correct permissions, filters, export scope, and successful mutation refresh.

Run appropriate lint/type checks and relevant existing tests. Complete the implementation and report changed files, working operations, verification results, and any missing integrations.
Enhance only the **left sidebar navigation and top-left branding area** of my existing MarketChain ERP application, using the attached screenshot as the visual reference.

First read my existing design system Markdown and applicable frontend/project rules. Reuse existing layout components, navigation configuration, icons, design tokens, and permission handling.

## 1. Strict scope

Implement only:
- Sidebar menu grouping.
- One new User Management menu item.
- Enhanced top-left logo, platform name, and version display.

Keep all other existing menu items, labels, icons, ordering, routes, submenus, permissions, and behavior unchanged, except moving System Setting into the new System & Security group.

The screenshot contains a User Management page and Disable Account modal. These are outside this task. Do not implement or redesign them. Do not reproduce the screenshot’s dimmed overlay.

Preserve the main content area, top-right header controls, notifications, profile menu, and existing layout behavior.

## 2. Sidebar grouping

Create two clearly separated navigation groups:

### Operations & Core
- Start with Dashboard.
- Keep every other existing operational menu item beneath it in its current order.
- Preserve existing nested menus and expansion behavior.
- Use the current application’s menu list as the source of truth; do not replace it with the screenshot’s example list.
- Exclude System Setting from this group.

### System & Security
Place this group after the operational items, with clear vertical spacing.

Include:
1. User Management — new menu item.
2. System Setting — existing menu item.

Preserve the existing settings label exactly as currently implemented, including “System Settings” if that is its actual label.

Group headings:
- Display “OPERATIONS & CORE” and “SYSTEM & SECURITY”.
- Small uppercase text with medium/semibold weight.
- Muted color and subtle letter spacing.
- Consistent left alignment and padding.
- Headings are non-clickable navigation labels.
- Hide empty groups when permissions leave no visible items.

## 3. User Management menu item

- Add an appropriate user-management icon from the existing icon library, such as a user with a gear.
- Match existing menu item height, padding, icon size, and alignment.
- Place it immediately above System Setting.
- Use the existing User Management route if available.
- Apply the existing permission-based navigation pattern. Do not invent role names or grant access merely by showing a menu item.
- Preserve route-level authorization.

If no User Management route exists:
- Add a minimal route using existing routing conventions, with a “User Management” title and a neutral empty state.
- Do not build user CRUD, statistics, tables, account-disable dialogs, or backend user-management features in this task.
- Report any missing permission integration.

## 4. Sidebar appearance and states

Follow the screenshot’s navigation treatment while using the existing design system:

- Clean light sidebar background.
- Consistent spacing between icons and labels.
- Rounded hover and selected backgrounds.
- Active item: subtle teal background, teal text/icon, and a narrow teal indicator on the left.
- Neutral inactive items.
- Accessible hover, keyboard focus, and selected states.

Preserve existing sidebar width, collapse toggle, mobile drawer, scrolling, and footer behavior. Do not introduce a new footer or operational-status indicator solely because it appears in the screenshot.

When collapsed:
- Keep navigation icons usable.
- Show label tooltips.
- Hide full group-heading text or use the existing compact separator pattern.
- Preserve active-item indication.

Determine active navigation from the current route, including nested routes, using the project’s existing logic.

## 5. Top-left branding header

Enhance the branding area to show:

1. Existing MarketChain logo.
2. Platform name: MarketChain ERP.
3. Compact version/edition badge.

Reference arrangement:
[Logo] MarketChain ERP [V4.12.4 ENTERPRISE]

Requirements:
- Reuse the actual logo asset already present in the project.
- Preserve its aspect ratio and keep it sharp.
- Do not redraw the logo or substitute an unrelated icon.
- If the logo asset cannot be found, retain the existing branding asset and report the missing reference asset.
- Use dark navy, medium/semibold text for the platform name.
- Show version/edition in a small rounded, pale blue-gray badge.
- Read the version from the existing application metadata or configuration.
- Display edition text only when supplied by actual configuration.
- Do not hardcode V4.12.4 or ENTERPRISE merely to copy the screenshot.
- Keep logo, platform name, and badge vertically aligned with balanced gaps.
- Fit within the current header height.
- Preserve any existing logo/home navigation behavior.
- Avoid overlap with top-right controls.
- On smaller screens, compact or hide the version badge first according to the existing responsive pattern.

## 6. Implementation approach

- Modify the existing shared sidebar/header components rather than creating a second layout.
- Extend the existing menu configuration rather than duplicating it.
- Keep route IDs and React keys stable.
- Reuse existing styles and tokens; avoid unrelated global CSS changes.
- Ensure grouping does not break submenu state or permission filtering.
- Keep existing operational menus exactly as they currently work.

## 7. Verification

Verify:
- Existing operational items remain present in their original order.
- System Setting appears under System & Security.
- User Management appears immediately above it.
- All existing links and submenus still work.
- User Management follows the correct route and permission rules.
- Active states work for direct navigation and nested routes.
- Expanded sidebar, collapsed sidebar, and mobile drawer remain usable.
- Logo, platform name, and real version display correctly.
- Main content and top-right header controls remain unaffected.

Run appropriate lint/type checks and relevant existing checks.

## Sidebar bottom: Operational status

Add a footer pinned to the bottom of the left sidebar, matching the screenshot:

- Left label: **Status: Operational**
- Right indicator: small teal status dot.
- Subtle top border, compact padding, and muted text.
- Keep the footer visible while navigation items scroll.
- In collapsed mode, show the status dot with a tooltip: “Status: Operational”.
- Preserve mobile drawer behavior and prevent overlap with menu items.
- Use the existing health/status source if available. Do not display “Operational” as a verified live status without actual status data; show “Status: Unknown” when unavailable.
- Include accessible status text so color is not the only indicator.

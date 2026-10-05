# MarketChain ERP — Top Right Header Enhancement Specification

## Objective

Enhance the **existing MarketChain ERP application header UI**, focusing only on the **top-right header area**.

The new header must contain only these 4 items:

```text
App Version
Update Button
Notification
Logged-in User Profile
```

Do **not** redesign the full application shell, sidebar, breadcrumb, page title, or left side of the header unless required for alignment.

The purpose is to make the current header look cleaner, more modern, easier to scan, and consistent with the MarketChain ERP design system.

---

# 1. Target Header Structure

The top-right side of the application header should follow this structure:

```text
[ App Version ] [ Update Button ] [ Notification ] [ User Profile ]
```

Example:

```text
[v1.4.2] [↻ Update] [🔔 3] [MB  Marco Byte / Administrator  ▼]
```

Keep the order exactly like this unless the existing application structure requires a small adjustment.

---

# 2. Scope

Only enhance the right side of the current application header.

Do not change:

```text
- Sidebar navigation
- Main page layout
- Existing route behavior
- Breadcrumb
- Current permissions
- Authentication logic
- Existing notification API behavior
- Current profile/logout behavior
```

Reuse the existing application shell/header component.

---

# 3. App Version

Display the current application version as a small low-emphasis UI element.

Example:

```text
v1.4.2
```

Preferred data source:

```text
package.json
environment config
runtime config
build metadata
existing app constants
```

Possible implementation:

```ts
const appVersion = process.env.NEXT_PUBLIC_APP_VERSION;
```

Do not hardcode a fake production version if the app already exposes one.

If no version source exists yet, use a temporary fallback such as:

```ts
const appVersion = "v1.0.0";
```

and add a TODO.

## Visual Style

Recommended:

```text
font-size: 11px–12px
font-weight: 500
muted foreground color
soft neutral background
small rounded pill
```

The version should remain subtle and should not compete visually with notifications or the profile.

---

# 4. Update Button

Add a compact button immediately after the app version.

Label:

```text
Update
```

Use `lucide-react`.

Preferred icon:

```ts
RefreshCw
```

Example:

```text
[↻ Update]
```

## Behavior

Reuse existing update/version logic if MarketChain already has one.

Potential behavior:

```text
Click Update
   ↓
Check latest application version
   ↓
If update exists -> run existing update flow
If already latest -> show informational toast
```

If no update mechanism exists yet, keep the button UI-ready with an isolated placeholder handler:

```ts
const handleUpdate = () => {
  // TODO: connect application update/version API
};
```

Do not implement unsafe auto-update/download behavior without an existing deployment/update mechanism.

## Optional States

If update state exists, support:

```text
Update
Update Available
Updating...
Up to Date
```

Recommended:

```text
Update Available -> subtle attention state
Updating         -> disabled + spinner
Up to Date       -> neutral state or temporary toast
```

---

# 5. Notification Button

Add a notification icon button after the Update button.

Use:

```ts
Bell
```

from `lucide-react`.

Desktop should remain icon-only.

Recommended size:

```text
36px × 36px
```

Use a small rounded hover surface and keep it visually lightweight.

---

# 6. Notification Badge

If unread notifications exist, display a small unread badge.

Rules:

```ts
0 unread => hide badge
1-9      => actual number
>9       => "9+"
```

Examples:

```text
🔔
🔔 1
🔔 3
🔔 9+
```

Do not show `0`.

---

# 7. Notification Interaction

Reuse the current MarketChain notification implementation.

Preferred interaction:

```text
Click Bell
   ↓
Open existing Notification Dropdown / Popover
```

If the current app navigates to a notification page instead, preserve that behavior.

Do not create a second notification system if one already exists.

Reuse existing:

```text
notification API
unread count
read/unread state
WebSocket/Firebase/polling logic
notification dropdown
```

---

# 8. Logged-in User Profile

The final element should be the logged-in user profile.

Recommended desktop layout:

```text
[ Avatar ]  User Name
            Role / Position     ▼
```

Example:

```text
[MB] Marco Byte        ▼
     Administrator
```

Reuse the current authentication/session context.

Possible existing fields:

```ts
user.fullName
user.displayName
user.name
user.username
user.email
user.role
user.position
user.avatar
```

Do not create duplicate profile state if the authenticated user already comes from:

```text
AuthContext
useAuth()
server session
Redux
Zustand
existing authentication provider
```

---

# 9. Avatar

If an avatar image exists, display it.

Otherwise derive initials from the user's name.

Example:

```text
Marco Byte -> MB
```

Suggested helper only if the project does not already have one:

```ts
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
```

---

# 10. User Name and Role

Display the readable user name using this priority:

```text
fullName
displayName
name
username
```

Recommended typography:

```text
User name: 12–14px / semibold
Role:      11–12px / muted
```

For the second line, use real existing data such as:

```text
Administrator
Inventory Manager
Store Manager
Owner
```

If no role/position exists, either hide the second line or show:

```text
Signed in
```

Do not invent an incorrect role.

---

# 11. Profile Dropdown

Clicking the profile area should open the current user/profile menu.

Reuse current actions such as:

```text
My Profile
Account Settings
Preferences
Logout
```

Preserve the existing logout implementation.

Do not create another logout/session-clear flow.

---

# 12. Recommended Component Structure

Avoid adding all logic directly inside the root header component.

Recommended structure:

```text
AppHeader
└── HeaderRightActions
    ├── AppVersionBadge
    ├── UpdateButton
    ├── NotificationButton
    └── UserProfileMenu
```

If equivalent components already exist, reuse and restyle them instead of creating duplicates.

Example composition:

```tsx
<div className="header-right-actions">
  <AppVersionBadge version={appVersion} />

  <UpdateButton
    loading={isUpdating}
    updateAvailable={updateAvailable}
    onClick={handleUpdate}
  />

  <NotificationButton
    unreadCount={unreadCount}
    onClick={handleNotificationClick}
  />

  <UserProfileMenu user={currentUser} />
</div>
```

---

# 13. Visual Design

Follow the existing MarketChain ERP design system.

Use:

```text
clean white/light header
subtle bottom border
compact controls
soft neutral borders
small-medium radius
minimal shadow
consistent spacing
high readability
```

Avoid:

```text
heavy gradients
large shadows
oversized icons
bright colored blocks
excessive separators
```

The result should feel like a modern ERP/admin header.

---

# 14. Layout and Spacing

Recommended horizontal layout:

```text
[v1.4.2]  [↻ Update]  [Bell]  [Avatar + Name + Role + Chevron]
```

Recommended gap:

```text
8px–12px
```

Recommended height:

```text
56px–64px
```

If the current header already has a defined height, preserve it.

Recommended control sizes:

```text
Update Button: 34–36px height
Notification:   36px × 36px
Profile:        38–42px height
```

Icons:

```text
16px–18px
```

Suggested Lucide icons:

```ts
RefreshCw
Bell
ChevronDown
User
LogOut
Settings
```

---

# 15. Semantic Colors

Keep the default header mostly neutral.

Recommended semantics:

```text
App Version     -> muted gray
Update Button   -> neutral / primary
Notification    -> neutral
Unread Badge    -> red
Profile         -> neutral
```

Do not introduce unnecessary decorative colors.

---

# 16. Hover and Focus States

Every interactive element must have a clear hover and keyboard-focus state.

Examples:

```text
Update Button:
slightly stronger background/border

Notification:
soft neutral hover background

Profile:
soft neutral hover background
```

Accessibility requirements:

```text
use real button elements for actions
visible keyboard focus
aria-label for icon-only controls
keyboard-accessible dropdown menus
```

Example:

```tsx
<button aria-label="Notifications">
  <Bell size={18} />
</button>
```

---

# 17. Responsive Behavior

## Desktop

Show:

```text
App Version
Update text + icon
Notification icon + unread badge
Avatar
User Name
Role
Chevron
```

## Tablet

Can simplify profile to:

```text
Avatar
User Name
Chevron
```

Role may be hidden if required.

## Mobile

Recommended:

```text
App Version -> may hide
Update      -> icon-only if needed
Notification -> keep icon
Profile      -> avatar only
```

Example:

```text
[↻] [🔔] [MB]
```

The header must stay on one row and should not wrap.

---

# 18. Overflow Rules

Long names must not break the header layout.

Use:

```css
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
```

Suggested max width for profile text:

```text
140px–180px
```

Adapt to the existing header width.

---

# 19. Real Data Priority

Codex must resolve data in this order:

```text
1. Existing app version/config
2. Existing update/version checker
3. Existing notification state/API
4. Existing authenticated user context
5. Temporary fallback only if the source does not exist
```

Do not replace existing real values with mock data.

Temporary fallback example:

```ts
const headerFallback = {
  appVersion: "v1.0.0",
  unreadNotifications: 0,
};
```

Do not mock the logged-in user's identity when authentication already provides it.

---

# 20. Preserve Existing Authentication

This UI enhancement must not change:

```text
Login
Logout
Session refresh
Token storage
Authorization
Authentication redirects
Permission behavior
```

Only improve visual presentation around current user information.

---

# 21. Preserve Existing Notification Logic

If the app already has:

```text
notification API
notification dropdown
unread status
WebSocket notifications
Firebase notifications
polling
```

reuse the current implementation.

Do not create duplicate notification state.

---

# 22. Preserve Existing Update Logic

If MarketChain already supports:

```text
PWA/service worker update
version API
desktop updater
build-version comparison
deployment update state
```

reuse it.

The new button should only make that functionality clearer and easier to access.

---

# 23. Do Not Add Extra Header Items

The enhanced top-right header should contain only:

```text
1. App Version
2. Update Button
3. Notification
4. User Profile
```

Do not add:

```text
Search
Language selector
Theme switcher
Help
Settings shortcut
Fullscreen
Quick Create
Messages
Calendar
```

unless those are already part of another header area and are outside this task.

---

# 24. Recommended Final Appearance

Desktop concept:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│                                                 [v1.4.2] [↻ Update] [🔔 3] │
│                                                          [MB Marco Byte ▼] │
└──────────────────────────────────────────────────────────────────────────────┘
```

Preferred real layout is a single horizontal row:

```text
[v1.4.2] [↻ Update] [Bell + Badge] [Avatar + Name + Role + Chevron]
```

---

# 25. Codex Implementation Rules

Before coding, inspect:

```text
current AppHeader/Header component
current app shell/layout
current authentication hook/context
current notification component
notification unread-count source
existing profile dropdown
existing logout action
app version configuration
current update/version logic
existing design-system components
existing Button/Badge/Avatar/Dropdown/Popover components
```

Reuse everything possible.

Do not introduce a new UI library.

---

# 26. Recommended Implementation Sequence

```text
Step 1
Locate the current application header.

Step 2
Identify current authenticated-user data.

Step 3
Identify notification state and interaction.

Step 4
Identify app-version source.

Step 5
Identify existing update/version-check logic.

Step 6
Create or restructure HeaderRightActions.

Step 7
Add AppVersionBadge.

Step 8
Add/upgrade UpdateButton.

Step 9
Restyle NotificationButton.

Step 10
Restyle UserProfileMenu.

Step 11
Add responsive behavior.

Step 12
Verify notification dropdown/navigation.

Step 13
Verify profile dropdown and logout.

Step 14
Verify tablet/mobile overflow.

Step 15
Remove temporary fallback values where real data is available.
```

---

# 27. Acceptance Criteria

The task is complete when:

```text
[ ] Existing header logic still works
[ ] Right header contains only App Version, Update, Notification, Profile
[ ] App version displays correctly
[ ] Update button is compact and functional
[ ] Notification unread badge works correctly
[ ] Existing notification behavior still works
[ ] Logged-in user's real name is displayed
[ ] Avatar or initials display correctly
[ ] User role/position displays when available
[ ] Existing profile dropdown works
[ ] Logout still works
[ ] Authentication/session behavior is unchanged
[ ] Header remains responsive
[ ] Header stays on one row
[ ] No duplicated authentication logic
[ ] No duplicated notification implementation
[ ] No unrelated header items are introduced
[ ] Styling matches MarketChain's current design system
```

---

# Codex Prompt

```text
Please enhance the existing MarketChain ERP top-right application header UI.

Scope:
Only modify the right side of the current header.

The header must contain exactly these 4 elements in this order:

1. App Version
2. Update Button
3. Notification
4. Logged-in User Profile

Requirements:

- First inspect the existing header implementation and reuse all current logic.
- Do not rebuild the full application shell.
- Preserve current authentication, session, logout, notification, routing, and permission behavior.
- Reuse the current authenticated-user data.
- Reuse the current notification API/state/dropdown if one exists.
- Reuse the current application version/update logic if it exists.
- Use real application data before fallback/mock values.
- Use lucide-react for icons.
- Reuse existing shared Button, Badge, Avatar, Dropdown, Popover, Tooltip, and design-system components whenever possible.
- Do not install another UI library.
- Keep the header modern, compact, professional, and suitable for an ERP application.

Desktop layout:

[v1.4.2] [RefreshCw + Update] [Bell + unread badge] [Avatar + Name + Role + Chevron]

Responsive behavior:
- Desktop: show all information.
- Tablet: role may be hidden.
- Mobile: version may be hidden, update can become icon-only, notification icon remains, profile can show avatar only.
- Header must remain on one row and must not overflow.

App Version:
- Read from existing package/config/environment/build metadata if available.
- Display as a subtle small badge.

Update:
- Compact button with RefreshCw icon.
- Connect to the existing update/version flow.
- If no update mechanism exists, keep the handler isolated with a TODO instead of inventing unsafe update behavior.

Notification:
- Use Bell icon.
- Show unread badge only when count > 0.
- 1–9 = actual value.
- >9 = "9+".
- Preserve the existing notification interaction.

Profile:
- Show avatar if available.
- Otherwise derive initials from the logged-in user's name.
- Show the real user name.
- Show role/position when available.
- Preserve the existing profile dropdown and logout action.

Do not add Search, Theme, Language, Help, Settings, Fullscreen, Quick Create, Messages, Calendar, or any other new header actions.

Before implementing, briefly identify:
1. Which existing header components can be reused.
2. Where the app version comes from.
3. Where notification count/data comes from.
4. Where current user/profile data comes from.
5. Whether update logic already exists.

Then implement the UI enhancement without breaking the existing flow.
```

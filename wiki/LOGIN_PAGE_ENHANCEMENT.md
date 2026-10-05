# MarketChain ERP — Login Page Enhancement Specification (Revised)

## Objective

Enhance the existing **MarketChain ERP Login page** to follow the provided reference image much more closely.

The implementation should preserve the current authentication flow while matching the reference layout, including:

- MarketChain logo on the **top-left of the dark branding panel**
- `WELCOME BACK` badge on the **top-left of the right panel**
- `Help Center` on the **top-right of the right panel**
- Form labels above each input exactly like the reference
- Store Identifier field
- Corporate Email field
- Access Key / Password field
- `Reset key?` link aligned with the password label
- Main `Authenticate & Enter` button
- `OR SSO GATEWAY` divider
- Two SSO buttons
- Bottom security/compliance row
- Version information on the left panel

The goal is to make the current MarketChain login page visually match the screenshot while still using the existing project data and authentication logic.

---

# 1. Overall Desktop Layout

Use a full-height split screen.

```text
┌────────────────────────────────────────────┬──────────────────────────────────┐
│                                            │                                  │
│           LEFT BRAND PANEL                 │          RIGHT LOGIN PANEL       │
│                                            │                                  │
│  [MarketChain ERP Logo]                    │  [WELCOME BACK]      Help Center │
│                                            │                                  │
│                                            │                                  │
│                                            │   Sign in to your workspace      │
│  Connect every link in                     │   Subtitle                       │
│  your                                      │                                  │
│  supply chain.                             │   STORE IDENTIFIER               │
│                                            │   [ input                    ]   │
│  Supporting copy                           │                                  │
│                                            │   CORPORATE EMAIL                │
│  ─────────────────────────                 │   [ input                    ]   │
│                                            │                                  │
│  Metric 1   Metric 2   Metric 3            │   ACCESS KEY / PASSWORD Reset?   │
│                                            │   [ input                 eye ]  │
│                                            │                                  │
│                                            │   [ Authenticate & Enter   → ]   │
│                                            │                                  │
│                                            │   ───── OR SSO GATEWAY ─────    │
│                                            │                                  │
│                                            │   [ Azure AD ] [ Okta SSO ]     │
│                                            │                                  │
│  Datacenter/info          Version          │  Secure status      Tenant info  │
└────────────────────────────────────────────┴──────────────────────────────────┘
```

Recommended desktop ratio:

```text
Left Panel: 62%
Right Panel: 38%
```

The right panel must not be visually centered too low. Its top controls should follow the reference.

---

# 2. Left Branding Panel

Use a dark navy/blue gradient panel.

Recommended appearance:

```text
deep navy base
subtle blue/teal gradient
fine grid overlay
soft radial lighting
high contrast white typography
```

Keep the look professional and enterprise-oriented.

---

# 3. MarketChain ERP Logo — Required

The logo must be visible on the **top-left of the left panel**, matching the reference location.

Recommended positioning:

```text
top: 32px–48px
left: 48px–64px
```

Use the current real MarketChain ERP logo asset.

Recommended container:

```text
white/light card
rounded corners
small internal padding
subtle shadow
```

Example structure:

```tsx
<div className="brand-logo-card">
  <img src={marketChainLogo} alt="MarketChain ERP" />
</div>
```

Do not omit the logo.

Do not replace the actual logo with plain text unless no image asset exists.

---

# 4. Left Main Headline

Follow the reference visual hierarchy closely.

Recommended copy:

```text
Connect every link in
your
supply chain.
```

The words:

```text
supply chain.
```

should use the MarketChain green/accent color.

Recommended line structure:

```text
Connect every link in
your
supply chain.
```

Do not collapse it into one small heading.

Use a large bold font.

Suggested desktop size:

```text
56px–68px
font-weight: 700–800
line-height: 1.05–1.1
```

---

# 5. Left Supporting Text

Below the headline:

```text
Unified procurement, inventory, finance and operations —
all in one intelligent business platform.
```

Adapt to the real MarketChain product scope if necessary.

Suggested final copy:

```text
Unified inventory, purchasing, sales, finance and operations —
all in one intelligent business platform.
```

Typography:

```text
16px–18px
muted white / light gray
line-height: 1.5
```

---

# 6. Left Divider

Add a subtle horizontal divider before the metric section.

Example:

```text
────────────────────────────────────────────
```

Use low-opacity white/blue.

---

# 7. Left Metrics

Keep 3 metric blocks horizontally aligned, like the screenshot.

Recommended structure:

```text
98.9%                 340ms                 ISO 27001
UPTIME SLA            AVG RESPONSE          CERTIFIED
```

Important:

- If MarketChain has real values, use them.
- If these values are not real, do not falsely claim them in production.
- For UI development, dummy values may be used temporarily if clearly isolated.

Recommended fallback/mock UI:

```ts
const loginMetrics = [
  {
    value: "98.9%",
    label: "UPTIME SLA",
    isMock: true,
  },
  {
    value: "340ms",
    label: "AVG RESPONSE",
    isMock: true,
  },
  {
    value: "ISO 27001",
    label: "CERTIFIED",
    isMock: true,
  },
];
```

If the product is not actually certified, replace the production version with safer capability text later.

For now, match the screenshot layout closely.

---

# 8. Left Bottom Footer

At the bottom of the left panel place two small metadata items.

Left:

```text
Global Datacenter: us-east-cluster-04
```

Right:

```text
Version 4.19.2-lts
```

For MarketChain implementation:

Prefer:

```text
Environment / Cluster / Region
```

and:

```text
Version {realAppVersion}
```

Use real app version/configuration if already available.

If no datacenter information exists, use:

```text
MarketChain ERP
```

or:

```text
Environment: Production
```

Do not expose sensitive infrastructure names unless they are already intended for UI display.

---

# 9. Right Login Panel — Top Row Positioning

This part must match the screenshot.

At the very top of the right panel:

```text
[ WELCOME BACK ]                         Help Center
```

`WELCOME BACK` must be on the **left side** of the right panel.

`Help Center` must be on the **far right side**.

They should be in the same top row.

Example:

```tsx
<div className="login-top-row">
  <Badge>WELCOME BACK</Badge>
  <a href={helpCenterUrl}>Help Center</a>
</div>
```

Recommended spacing:

```text
top: 36px–48px
left/right panel padding: 48px–64px
```

Do not place `WELCOME BACK` directly above the login title without the top-row spacing.

Do not place `Help Center` beside the form title.

---

# 10. Welcome Badge Styling

The welcome badge should look like the screenshot.

Example:

```text
● WELCOME BACK
```

Recommended:

```text
soft mint/green background
green text
small rounded pill
11–12px text
semibold
```

Optional leading green dot.

---

# 11. Help Center

Display:

```text
Help Center
```

at the top-right.

Use the existing help/support route if available.

If no route exists:

```ts
// TODO: connect Help Center route
```

Do not move it near the login button.

---

# 12. Login Form Container Position

The login form should begin below the top row, with generous vertical space.

Recommended:

```text
top section
↓
WELCOME BACK / Help Center
↓
~100px spacing
↓
Login heading
```

Do not vertically center the entire login form in a way that changes the reference composition.

---

# 13. Login Title

Use:

```text
Sign in to your workspace
```

Style:

```text
30px–38px
font-weight: 700
dark navy/black
```

---

# 14. Login Subtitle

Below the title:

```text
Enter your enterprise store credentials to continue
```

For MarketChain, acceptable adaptation:

```text
Enter your MarketChain workspace credentials to continue
```

or if the current system is store-based:

```text
Enter your store credentials to continue
```

Use the wording that matches current authentication logic.

---

# 15. Form Labels — Required

Every input must have a visible uppercase label above it, like the screenshot.

Do not rely on placeholders alone.

Required label structure:

```text
STORE IDENTIFIER
[input]

CORPORATE EMAIL
[input]

ACCESS KEY / PASSWORD                         Reset key?
[input]
```

Typography:

```text
11px–13px
font-weight: 600–700
uppercase
letter-spacing: subtle
dark slate
```

---

# 16. Store Identifier Input

Required first field:

```text
STORE IDENTIFIER
```

Example:

```text
agp-regional-01
```

Recommended right-side icon:

```ts
Building2
```

or:

```ts
Store
```

from `lucide-react`.

Structure:

```tsx
<Form.Item label="STORE IDENTIFIER">
  <Input
    value={...}
    suffix={<Building2 size={16} />}
  />
</Form.Item>
```

Important:

If the current MarketChain login flow does not use a store identifier, Codex must:

1. inspect existing authentication first,
2. determine whether a tenant/store/company field already exists,
3. reuse it if available,
4. otherwise create this field as UI-only placeholder only if requested for visual matching.

Do not silently modify the authentication API contract.

---

# 17. Corporate Email Input

Second field:

```text
CORPORATE EMAIL
```

Example:

```text
armsadmin@asean.org
```

Use real current email/username field.

Suggested icon:

```ts
AtSign
```

or:

```ts
Mail
```

Recommended:

```tsx
<Form.Item label="CORPORATE EMAIL">
  <Input
    autoComplete="username"
    suffix={<AtSign size={16} />}
  />
</Form.Item>
```

---

# 18. Access Key / Password

Third field label:

```text
ACCESS KEY / PASSWORD
```

On the same line, align a link on the right:

```text
Reset key?
```

Example:

```text
ACCESS KEY / PASSWORD                          Reset key?
```

Implementation:

```tsx
<div className="password-label-row">
  <label>ACCESS KEY / PASSWORD</label>
  <button type="button">Reset key?</button>
</div>
```

Use the current forgot-password/reset-password flow if it exists.

If the current wording is `Forgot password?`, it may be mapped to `Reset key?` only if this fits the system.

---

# 19. Password Field

The field should:

```text
mask password by default
show eye-off / eye icon at the right
allow toggle
preserve browser autocomplete
```

Use:

```ts
Eye
EyeOff
```

Recommended:

```text
[ •••••••••••••••••••                         eye ]
```

Input height:

```text
44px–48px
```

---

# 20. Input Visual Design

All 3 inputs should match.

Recommended:

```text
height: 46px–48px
border-radius: 10px
light gray/blue background
thin neutral border
14px text
12px–16px horizontal padding
```

Focus state:

```text
blue border
subtle focus ring
```

Do not use completely borderless inputs.

---

# 21. Primary Login Button

Match the screenshot closely.

Text:

```text
Authenticate & Enter
```

Right-side icon:

```ts
ArrowRight
```

Layout:

```text
[             Authenticate & Enter        → ]
```

Full width.

Recommended:

```text
height: 46px–50px
blue gradient or MarketChain primary blue
white text
border-radius: 9px–10px
font-weight: 600
```

If the current app already uses `Sign In`, keep the backend behavior but UI text may be changed to `Authenticate & Enter` if desired.

---

# 22. Login Loading State

During authentication:

```text
[ spinner   Authenticating... ]
```

Disable the button.

Prevent duplicate submission.

Reuse existing loading state.

---

# 23. OR SSO GATEWAY Divider — Required

Below the primary login button show the divider exactly in this style:

```text
──────────── OR SSO GATEWAY ────────────
```

Use a centered label with horizontal lines on both sides.

Example:

```tsx
<div className="sso-divider">
  <span />
  <span>OR SSO GATEWAY</span>
  <span />
</div>
```

Typography:

```text
10px–12px
uppercase
muted
letter spacing
```

---

# 24. SSO Login Buttons — Required

Under the divider, show 2 equal-width buttons in one row.

Reference:

```text
[ Azure AD ]     [ Okta SSO ]
```

For visual matching, include:

```text
Azure AD
Okta SSO
```

Buttons should be secondary/outline style.

Recommended structure:

```tsx
<div className="sso-grid">
  <Button>
    <MicrosoftIcon />
    Azure AD
  </Button>

  <Button>
    <CircleIcon />
    Okta SSO
  </Button>
</div>
```

Recommended width:

```text
50% / 50%
```

with:

```text
12px gap
```

---

# 25. SSO Behavior

Before implementation, Codex must inspect whether existing SSO logic exists.

If existing:

```text
Azure AD
Okta
Microsoft Entra ID
OIDC
SAML
```

connect the buttons to the real flow.

If no SSO exists yet:

- Keep buttons as UI placeholders only.
- Add clear TODO comments.
- Do not fake successful authentication.
- Do not change the current backend contract.

Example:

```ts
const handleAzureLogin = () => {
  // TODO: connect Azure/Entra SSO
};

const handleOktaLogin = () => {
  // TODO: connect Okta SSO
};
```

---

# 26. SSO Button Design

Match the reference:

```text
white/light background
neutral border
dark text
subtle hover
same height as compact secondary controls
```

Recommended:

```text
height: 38px–42px
border-radius: 7px–8px
```

---

# 27. Right Panel Bottom Divider

Near the bottom of the login panel add a horizontal divider.

This separates the main login area from the footer/security information.

---

# 28. Security Footer

Bottom-left of the right panel:

```text
shield icon + security text
```

Reference:

```text
256-bit TLS • SOC 2 Type II compliant
```

For the UI spec, display the same structural layout.

Recommended production-safe MarketChain text if compliance is not verified:

```text
Secure encrypted connection
```

If the business has real compliance information, replace with actual verified values.

Use:

```ts
ShieldCheck
```

---

# 29. Tenant / Workspace Footer

Bottom-right:

```text
Tenant: PROD-APAC-01
```

For MarketChain, use:

```text
Workspace: {workspaceCode}
```

or:

```text
Tenant: {tenantCode}
```

only if current app data already has this.

If not available, use UI fallback:

```text
Workspace: DEFAULT
```

only as isolated dummy data.

---

# 30. Exact Right Panel Structure

The right side should follow this hierarchy:

```text
RightPanel
│
├── TopRow
│   ├── WelcomeBadge
│   └── HelpCenterLink
│
├── LoginContent
│   ├── Heading
│   ├── Subtitle
│   │
│   ├── StoreIdentifierLabel
│   ├── StoreIdentifierInput
│   │
│   ├── CorporateEmailLabel
│   ├── CorporateEmailInput
│   │
│   ├── PasswordLabelRow
│   │   ├── AccessKeyLabel
│   │   └── ResetKeyLink
│   ├── PasswordInput
│   │
│   ├── AuthenticateButton
│   │
│   ├── SsoDivider
│   │
│   └── SsoButtons
│       ├── AzureAD
│       └── OktaSSO
│
└── BottomFooter
    ├── SecurityInfo
    └── TenantInfo
```

---

# 31. Suggested Page Component Structure

```text
LoginPage
│
├── LoginBrandPanel
│   ├── BrandLogoCard
│   ├── BrandHeadline
│   ├── BrandDescription
│   ├── BrandMetrics
│   └── BrandFooter
│
└── LoginPanel
    ├── LoginTopRow
    │   ├── WelcomeBadge
    │   └── HelpCenterLink
    │
    ├── LoginFormSection
    │   ├── LoginHeading
    │   ├── StoreIdentifierField
    │   ├── CorporateEmailField
    │   ├── PasswordField
    │   ├── AuthenticateButton
    │   ├── SsoDivider
    │   └── SsoButtons
    │
    └── LoginSecurityFooter
```

Reuse existing project components first.

---

# 32. Ant Design Guidance

If MarketChain currently uses Ant Design, keep it.

Suggested reuse:

```tsx
Form
Input
Input.Password
Button
Typography
Alert
Tooltip
```

Example:

```tsx
<Form.Item
  label="STORE IDENTIFIER"
  name="storeIdentifier"
>
  <Input suffix={<Building2 size={16} />} />
</Form.Item>
```

For the password label + Reset key layout, use a custom label row if needed.

Do not add another UI framework.

---

# 33. Lucide Icons

Recommended:

```ts
ArrowRight
AtSign
Building2
Store
Eye
EyeOff
ShieldCheck
KeyRound
```

The Microsoft/Azure brand mark may use an existing local icon/component if available.

Do not misuse Lucide icons as exact company logos if the project already has real provider icons.

---

# 34. Form Data Priority

Codex must inspect the current login contract first.

Priority:

```text
1. Existing form fields/API contract
2. Existing tenant/store identifier if available
3. Existing email/username
4. Existing password
5. Existing SSO integration
6. Dummy UI data only for missing visual-only sections
```

Do not break authentication just to copy the screenshot.

---

# 35. Dummy UI Data

If data is missing, isolate fallback values.

Example:

```ts
const loginPageFallback = {
  storeIdentifier: "agb-regional-01",
  version: "4.19.2-lts",
  environment: "Production",
  tenant: "PROD-APAC-01",
};
```

Do not spread dummy values throughout JSX.

---

# 36. Responsive Layout

## Desktop

```text
62% branding
38% login
```

Keep both panels full viewport height.

---

## Tablet

Use around:

```text
52% branding
48% login
```

Reduce headline size.

---

## Mobile

Hide the large left branding panel.

At the top of the mobile login form show:

```text
MarketChain ERP logo
WELCOME BACK
Sign in to your workspace
```

Keep:

```text
Store Identifier
Corporate Email
Password
Authenticate & Enter
SSO divider
SSO buttons
```

SSO buttons may stack vertically if required.

---

# 37. Mobile SSO Layout

Desktop:

```text
[ Azure AD ] [ Okta SSO ]
```

Small mobile width:

```text
[ Azure AD      ]
[ Okta SSO      ]
```

Do not allow buttons to overflow.

---

# 38. Accessibility

Required:

```text
visible field labels
associated label/input
keyboard accessible buttons
keyboard accessible password toggle
aria-label on eye icon button
Enter submits login
focus states
sufficient color contrast
```

---

# 39. Error Handling

Preserve existing auth error handling.

Display errors between the subtitle/form or above the submit button.

Example:

```text
Unable to authenticate. Please check your credentials.
```

Do not expose raw server errors.

---

# 40. Exact Visual Details to Preserve from Reference

These details are important:

```text
✔ Logo card at top-left of dark panel
✔ Large headline vertically centered left
✔ Green highlight on "supply chain."
✔ 3 metrics below horizontal divider
✔ Bottom-left datacenter/environment text
✔ Bottom-right version
✔ WELCOME BACK at top-left of right panel
✔ Help Center at top-right of right panel
✔ Large vertical gap before login heading
✔ Labels ABOVE every input
✔ Reset key? on same row as password label
✔ Icons inside right side of inputs
✔ Full-width blue Authenticate & Enter button
✔ OR SSO GATEWAY divider
✔ Two SSO buttons in one row
✔ Bottom divider
✔ Security indicator bottom-left
✔ Tenant/workspace bottom-right
```

---

# 41. Do Not Accidentally Change

Do not modify unless required:

```text
authentication endpoint
request payload
token management
session behavior
redirect path
permission loading
remember-user logic
logout flow
routing
global state
```

---

# 42. Acceptance Criteria

The redesign is complete when:

```text
[ ] MarketChain logo is visible at top-left of branding panel
[ ] Left panel follows reference layout closely
[ ] Welcome Back badge is top-left of right panel
[ ] Help Center is top-right of right panel
[ ] They share the same top row
[ ] Store Identifier has visible uppercase label
[ ] Corporate Email has visible uppercase label
[ ] Access Key / Password has visible uppercase label
[ ] Reset key? is aligned on the password label row
[ ] Inputs contain right-side icons
[ ] Authenticate & Enter is full width
[ ] OR SSO GATEWAY divider exists
[ ] Azure AD button exists
[ ] Okta SSO button exists
[ ] Existing SSO logic is reused when available
[ ] Security footer exists
[ ] Tenant/workspace footer exists
[ ] Version appears on the left panel
[ ] Current authentication still works
[ ] Responsive layout works
```

---

# Codex Task Prompt

```text
Enhance the existing MarketChain ERP Login page so it closely follows the attached reference screenshot.

IMPORTANT: The previous implementation/spec was missing several visual details. Make sure the new implementation includes ALL of these:

LEFT PANEL
1. Show the real MarketChain ERP logo in a white rounded card at the top-left.
2. Use the large headline:
   "Connect every link in"
   "your"
   "supply chain."
3. Highlight "supply chain." in the MarketChain green/accent color.
4. Add supporting product text below the headline.
5. Add a horizontal divider.
6. Add 3 horizontal metrics like the reference.
7. Add environment/datacenter information at the bottom-left.
8. Add the real application version at the bottom-right.

RIGHT PANEL
9. At the very top, create ONE row:
   - WELCOME BACK badge aligned left.
   - Help Center aligned far right.
10. Keep a large vertical gap between this top row and the login title.
11. Use title:
   "Sign in to your workspace"
12. Add subtitle below it.

FORM
13. Every input MUST have a visible uppercase label above it.
14. First field:
   STORE IDENTIFIER
   with Building2/Store icon inside the right side of the input.
15. Second field:
   CORPORATE EMAIL
   with AtSign/Mail icon inside the right side.
16. Third field label row:
   ACCESS KEY / PASSWORD on the left
   Reset key? on the right.
17. Password input must have eye/eye-off control.
18. Use full-width primary button:
   "Authenticate & Enter"
   with ArrowRight icon.

SSO
19. Under the primary button add:
   "OR SSO GATEWAY"
   centered between horizontal divider lines.
20. Under it add TWO equal-width SSO buttons:
   - Azure AD
   - Okta SSO
21. Reuse existing SSO logic if it already exists.
22. If SSO does not exist yet, keep the buttons as UI placeholders with isolated TODO handlers. Do not fake login success.

BOTTOM FOOTER
23. Add a divider near the bottom of the right panel.
24. Bottom-left:
   Shield icon + security/compliance text.
25. Bottom-right:
   Tenant/workspace information.

AUTHENTICATION
26. Before modifying anything, inspect the current login component and authentication flow.
27. Preserve the current authentication endpoint, payload, validation, session/token handling, loading state, error state and redirect logic.
28. If the current backend does not use Store Identifier, do not silently change the API contract. Resolve whether an existing tenant/store/company field can be reused first.
29. Use real current data whenever available.
30. Keep missing visual-only values in a dedicated fallback/mock object.

TECH
31. Reuse the existing UI framework.
32. Use lucide-react where appropriate.
33. Do not install another component library.
34. Reuse current MarketChain logo and design tokens.
35. Desktop should be approximately 62% left panel / 38% right panel.
36. On mobile, hide the large branding panel but keep the logo, form labels, authentication button and SSO options accessible.

Before implementing, briefly identify:
- current login component
- authentication hook/API
- current login request fields
- whether store/tenant identifier already exists
- existing password reset flow
- existing SSO integration
- current logo asset
- app version source

Then implement the redesign.
```

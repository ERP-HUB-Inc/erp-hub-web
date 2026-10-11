# MarketChain ERP — Landing Page and App Onboarding

## 1. Objective

Business onboarding has two implementation parts in separate frontend projects:

1. **MarketChain Landing Page:** Account entry, business identity, starting experience, demo preview, and backend workspace creation.
2. **MarketChain App:** Authenticated workspace entry and the operational setup for a fresh workspace or data import. Demo users enter a ready demo workspace.

The backend owns account and workspace persistence, demo generation, onboarding status, and authorization. Both frontends use its confirmed contracts.

The landing page journey includes:

1. Marketing (existing)
2. Pricing and Features (existing)
3. Sign Up / Account Registration
4. Business Name
5. Business Type Selection
6. Starting Experience: Demo / Fresh / Import
7. Account and Workspace Creation through Backend API
8. Business-Type-Specific Demo Preview
9. Secure handoff to the MarketChain App

**Important:** Enhance the existing landing page and app within their respective projects. This document is not a request to redesign either project.

Preserve existing UI, layout, branding, animations, components, and working features unless changes are necessary for onboarding. Marketing through Demo Preview on the landing page are reported as implemented; the remaining work must be assessed in each project before coding.

---

## 2. Repository Inspection — Required Before Coding

Inspect each frontend project before changing it. Identify:

- Framework and version (Next.js, React, Lucide-React, etc.)
- Existing routes and page structure
- Current landing page components
- Existing design tokens and CSS conventions
- Authentication or registration implementation
- Existing API client and environment configuration
- Existing form validation approach
- Existing shared UI components
- Current CTA buttons
- Existing responsive behavior
- Existing design-system documentation
- Existing app onboarding routes and setup screens
- Existing backend contracts for workspace status, setup, and import

If `UI_DESIGN_SYSTEM.md`, `FRONTEND_RULES.md`, or similar documentation exists, follow it.

Do not introduce another UI framework unnecessarily.

Use existing dependencies and project conventions wherever possible.

Before implementation in either project, summarize which existing components will be reused and which new screens/components are required.

In this MarketChain App checkout, `src/pages/Onboarding/index.jsx` is an unrouted prototype with simulated completion. Inspect it for reusable UI, but do not treat it as a completed onboarding flow or route users to it without real validation and persistence. Its account and company fields overlap with the landing page; do not ask for those details again or retain a password in app onboarding state.

---

## 3. Scope and Responsibilities

| Feature | Landing Page responsibility | Landing Page status | MarketChain App responsibility |
|---|---|---|---|
| Marketing | Maintain | Existing | No changes |
| Pricing and Features | Maintain | Existing | No changes |
| Sign Up | Implement/reuse | Implemented | Accept the authenticated session; do not register again |
| Business Name | Collect and submit | Implemented | Read the saved business profile; do not ask again |
| Business Type | Collect and submit | Implemented | Apply the saved preset where supported |
| Demo / Fresh / Import | Let the user choose | Implemented | Route to the matching app experience |
| Account / Workspace Creation | Call backend API | Implemented | Load and authorize the backend-owned workspace |
| Demo Preview | Show business-type-specific preview | Implemented | Open the ready demo workspace |
| Location Setup | Not in scope | Not in scope | Implement for fresh workspace |
| Product Setup | Not in scope | Not in scope | Implement for fresh workspace; support import path |
| Inventory Setup | Not in scope | Not in scope | Implement for fresh workspace; support import path |
| Recipe Setup | Not in scope | Not in scope | Implement when relevant to business type |
| Supplier Setup | Not in scope | Not in scope | Implement when relevant to business type |
| Import Existing Data | Select starting experience | Implemented | Provide actual import flow using backend APIs |
| Onboarding Completion | Hand off to app | Not in scope | Persist progress and completion through backend |

Landing Page status reflects the reported implementation; it has not been verified against the separate landing page repository.

This table assigns frontend ownership. It does not imply that the MarketChain App work or backend contracts are already implemented. Do not implement operational ERP modules in the landing project.

---

## 4. Onboarding User Journey

The two projects must support the following end-to-end flow. The boundary is the redirect from the landing page to the authenticated app:

```text
MarketChain Landing Page
        |
        | Start Free / Get Started
        v
Account Registration
        |
        v
Business Profile
        |
        v
Business Type Selection
        |
        v
Choose Starting Experience
        |
        +---- Explore Demo
        |          |
        |          v
        |     Demo Preview
        |          |
        |          v
        |     Create Demo Workspace
        |          |
        |          v
        |     MarketChain App → Ready Demo Workspace
        |
        +---- Start Fresh
        |          |
        |          v
        |     Create Real Workspace
        |          |
        |          v
        |     MarketChain App → Location / Product / Inventory Setup
        |
        +---- Import Existing Data
                   |
                   v
              Create Real Workspace
                   |
                   v
              MarketChain App → Import Flow
```

Each project must support Back/Continue navigation within its own steps without losing entered information. The app must load the saved business type and starting experience from authorized backend state after the handoff.

---

## 5. Existing Landing Page Integration

Do not remove or replace existing marketing sections.

Identify existing buttons such as:

- Get Started
- Start Free
- Create Account
- Explore Demo
- Try MarketChain

Connect these CTAs to the appropriate onboarding entry point.

Suggested routes (adapt to existing router):

```text
/signup
/onboarding/business
/onboarding/business-type
/onboarding/experience
/onboarding/demo-preview
```

Avoid duplicate routes or components when existing ones already provide equivalent functionality.

Keep the main landing page accessible to visitors without authentication.

---

## 6. Account Registration

Reuse existing authentication if available.

Required capabilities:

- Email registration
- Password registration or existing supported authentication provider
- Input validation
- Duplicate account handling
- Loading and error states
- Secure session establishment
- Continue to business onboarding after successful registration

Do not implement a custom password storage mechanism in the landing frontend.

Do not store access tokens in localStorage unless the existing approved architecture explicitly requires it.

Prefer secure backend-managed sessions or the established authentication mechanism.

If registration APIs are not available, implement a typed API adapter and clearly identify the missing backend contract.

Do not simulate successful account creation in production.

---

## 7. Business Profile Screen

Title:

**Tell us about your business**

Subtitle:

*We'll personalize MarketChain based on how your business works.*

Required field:

```text
Business Name
[ Brown Coffee House ]
```

Validation:

- Required
- Trim whitespace
- Apply existing backend-supported length limits
- Show inline validation messages

Buttons:

- Back
- Continue

Do not immediately create a business/workspace when the user enters the name. Persist it at the appropriate backend creation step.

---

## 8. Business Type Selection

Title:

**What type of business do you run?**

Subtitle:

*Choose the option that best describes your business.*

Display selectable cards.

Supported options:

| Code | Label | Icon |
|---|---|---|
| RETAIL | Retail / Mini Mart | shopping-cart |
| CAFE | Café / Coffee Shop | coffee |
| RESTAURANT | Restaurant | utensils |
| BAKERY | Bakery | cake-slice |
| FASHION | Fashion / Clothing | shirt |
| WHOLESALE | Wholesale / Distribution | boxes |
| MANUFACTURING | Manufacturing | factory |
| SERVICES | Services | briefcase-business |
| OTHER | Other | layout-grid |

Each card should have:

- Icon
- Name
- Short description
- Selected state
- Keyboard accessibility

Prefer retrieving supported types from the backend API when available.

Otherwise use a centralized typed configuration, not duplicated arrays across components.

Business type must influence the demo preview and the default configuration requested from the backend.

It must not permanently restrict the user's future ERP capabilities.

---

## 9. Starting Experience Screen

Title:

**How would you like to get started?**

Subtitle:

*Choose the easiest way to start using MarketChain.*

Display three selectable cards.

### Option A — Explore with Demo Data

Icon: `sparkles`

Badge: `Recommended`

Description:

*Explore MarketChain with realistic sample products, sales, inventory, purchases, and business reports.*

Value: `DEMO`

### Option B — Start Fresh

Icon: `store`

Description:

*Start with a clean workspace and set up your real business information.*

Value: `FRESH`

### Option C — Import Existing Data

Icon: `file-up`

Description:

*Bring your existing products and inventory into MarketChain.*

Value: `IMPORT`

Selecting an option must update onboarding state.

Do not create the workspace until the user confirms their selection.

---

## 10. Demo Preview Screen

Only display this screen when `startingExperience === "DEMO"`.

The preview must adapt to the selected business type.

Example:

**Explore a Café Demo**

Description:

*See how MarketChain works with a realistic sample café.*

Show preview sections:

**Products**
- Americano
- Iced Latte
- Cappuccino
- Matcha Latte
- Croissant
- Bottled Water

**Ingredients**
- Coffee Beans
- Fresh Milk
- Matcha Powder
- Vanilla Syrup

**Included Features**
- Products and Categories
- Ingredients and Recipes
- Inventory
- Suppliers
- Purchase History
- Sales History
- Business Reports

Show a short message:

*Demo data is separate from your real business data.*

Primary button:

**Create Café Demo**

Secondary button:

**Back**

For Retail, Restaurant, Bakery, Fashion, Wholesale, Manufacturing, and Services, display relevant preview content.

Use a centralized business-type preview configuration or backend-provided metadata.

Do not hardcode Café content for every business type.

If the backend does not yet support demo generation for a selected industry, do not pretend that it does. Provide an accurate unavailable state or supported alternative.

---

## 11. Onboarding State Management

Create a simple typed onboarding state.

Conceptual structure:

```ts
type StartingExperience = "DEMO" | "FRESH" | "IMPORT";

type LandingOnboardingState = {
  businessName: string;
  businessType: string | null;
  startingExperience: StartingExperience | null;
};
```

This type describes temporary landing page state. The MarketChain App must read the persisted workspace and onboarding status from the authenticated backend instead of copying this client state across applications.

Reuse the existing form/state solution where possible.

Requirements:

- Preserve state when navigating Back/Continue
- Validate each step before continuing
- Prevent accidental duplicate submission
- Restore incomplete onboarding using backend state when available
- Clear temporary sensitive information appropriately
- Never persist passwords in onboarding state storage

Avoid unnecessary global state libraries.

---

## 12. API Integration

Create or reuse centralized onboarding API clients in the project that calls each endpoint. The landing page needs registration and workspace creation/status calls. The app needs authorized workspace/profile/status reads and the setup or import calls it actually uses.

Conceptual endpoints:

```http
GET /onboarding/business-types
GET /onboarding/business-types/:businessType/preset
POST /onboarding/start
POST /onboarding/starting-experience
POST /onboarding/demo
GET /onboarding/demo/:workspaceId/status
GET /onboarding/status
PUT /onboarding/cost-calculation { method: "AVERAGE" | "FIFO" }
```

The app status response includes `costCalculation` and defaults to `AVERAGE`. The costing method endpoint is authenticated and only permits changes before workspace inventory exists.

These are proposed contracts, not confirmed existing endpoints.

The app may additionally need backend contracts for loading a workspace, saving setup progress, importing data, and marking onboarding complete. Confirm these contracts with the backend before implementing app screens; do not infer them from the conceptual endpoints above.

**Before implementation:**

1. Inspect existing API integrations.
2. Reuse available endpoints.
3. Do not invent backend response fields and treat them as real.
4. Keep API adapters isolated from UI components.
5. Document missing backend endpoints.
6. Use the existing authentication mechanism.

Example conceptual API payload:

```json
{
  "businessName": "Brown Coffee House",
  "businessType": "CAFE",
  "startingExperience": "DEMO"
}
```

If the backend requires separate calls, follow its actual contract.

Account and workspace creation must be handled by the backend.

---

## 13. Demo Workspace Creation

When the user confirms the demo preview:

1. Verify authentication.
2. Submit the selected business type.
3. Request demo workspace creation.
4. Show loading state.
5. Handle asynchronous generation if supported.
6. Wait for confirmed `READY` status.
7. Redirect to the MarketChain App.

Do not generate operational demo records in the landing frontend.

Do not insert sample products, sales, or inventory from the browser.

Demo creation is a backend responsibility.

Handle:

- API errors
- Timeouts
- Existing demo workspace
- Duplicate clicks
- Incomplete generation
- Retry
- Session expiration

Do not redirect to a supposedly ready workspace before backend confirmation.

---

## 14. Fresh Workspace Creation and App Setup

When the user chooses `FRESH`:

1. Confirm business name and business type.
2. Create the real workspace through the backend.
3. Preserve the selected business type.
4. Redirect to the MarketChain App onboarding entry point.

Example conceptual destination:

```text
https://app.example.com/onboarding/setup
```

Use environment configuration for the actual URL.

Do not hardcode production domains.

After the handoff, the MarketChain App must load the authorized workspace and existing setup progress, then guide the user through the relevant setup. Do not recreate the account, business profile, or workspace in the app.

The MarketChain App owns:

- Location setup
- Product and category setup
- Opening inventory
- Inventory costing method, when the backend can persist and apply it
- Recipes or ingredients when relevant to the selected business type
- Suppliers when relevant
- Persisted progress, resume, and onboarding completion

Use existing app forms and backend APIs where available. Define the required order and optional steps with product/backend owners before wiring completion. A step is complete only after the backend confirms its data was saved.

### Inventory costing method

Use moving weighted average (`AVERAGE`) as the default. Offer FIFO only after the backend applies cost layers consistently to opening stock, purchases, sales, returns, adjustments, transfers, and imports. Do not offer LIFO in the general onboarding flow. The chosen method belongs to the workspace and must be read from and saved to the backend; a browser-only preference must not affect financial reports.

The setup screen should explain that this changes inventory valuation and cost of goods sold, not the physical order in which staff pick stock. Before allowing a change after the first stock transaction, require a controlled migration that preserves prior transaction costs and reconciles opening balances. Keep the current average-cost behavior until FIFO is fully supported by the transaction and reporting services.

---

## 15. Import Existing Data

For `IMPORT`:

1. Create or select the real workspace.
2. Preserve `IMPORT` as the starting experience.
3. Redirect to the MarketChain App import entry point.

The MarketChain App owns the import experience: file selection, validation feedback, mapping or review if required by the backend, submission, progress, and results. Reuse its existing import features where they meet the onboarding contract. The backend owns import processing and persistence.

Do not implement Excel/CSV import processing in the landing project.

If the App import route or backend import API is not yet available, identify the dependency and avoid routing users to a broken page.

---

## 16. Cross-Application Redirect

Landing and MarketChain App are separate projects.

Use configurable URLs:

```env
NEXT_PUBLIC_MARKETCHAIN_APP_URL=
NEXT_PUBLIC_MARKETCHAIN_API_URL=
```

Adapt names to the project's existing environment conventions.

Requirements:

- Safe cross-application navigation
- Session/authentication continuity using the approved authentication design
- No access tokens in query parameters
- No passwords in URLs
- No sensitive business data in URLs
- Validated redirect destinations
- Support for onboarding resume

The App must verify the session, retrieve the authorized workspace and onboarding context from backend state, and route based on the persisted starting experience and progress. If the session has expired, sign in and resume safely. Landing must not assume that a redirect alone establishes app authentication.

Do not trust a workspace ID from the URL without backend authorization.

---

## 17. Shared UI Consistency

The landing page onboarding must visually match the MarketChain App.

Reuse existing design-system values for:

- Brand colors
- Typography
- Buttons
- Inputs
- Cards
- Border radius
- Shadows
- Spacing
- Icons
- Responsive breakpoints
- Loading states
- Error messages

Use Lucide React if it is already part of the project.

Do not introduce a completely different design language for onboarding.

However, do not copy the ERP sidebar/dashboard layout into the landing page.

Onboarding should use a clean, focused layout with a visible progress indicator.

---

## 18. Suggested Component Structure

Adapt to each existing repository. The following structure applies only to the landing page:

```text
components/
  onboarding/
    OnboardingLayout
    OnboardingProgress
    BusinessProfileForm
    BusinessTypeSelector
    StartingExperienceSelector
    DemoPreview
    DemoCreationProgress
    OnboardingNavigation

services/
  onboarding-api

config/
  business-type-preview

types/
  onboarding
```

These are logical responsibilities, not mandatory filenames.

For the MarketChain App, reuse its existing router, authentication guard, forms, services, and setup/import screens. Add only the app onboarding route, progress handling, and missing setup components needed after the handoff. Do not create unnecessary abstractions.

---

## 19. UX Requirements

- Keep the onboarding flow short.
- Use one primary decision per screen.
- Show clear progress.
- Provide Back and Continue buttons.
- Preserve previously entered information.
- Make selected options obvious.
- Show meaningful validation errors.
- Provide proper loading states.
- Prevent duplicate submissions.
- Make all selection cards keyboard-accessible.
- Support mobile, tablet, and desktop.
- Do not require users to configure inventory or accounting on the landing page.

For returning users with incomplete onboarding, resume rather than starting over whenever backend state permits.

---

## 20. Important Edge Cases

Handle:

- User already has an account.
- User already has a workspace.
- User refreshes during onboarding.
- User changes business type after selecting Demo.
- User goes Back from Demo Preview.
- User submits twice.
- API request fails.
- Authentication expires.
- Demo generation fails.
- Demo workspace already exists.
- Business type is unsupported by backend.
- User returns after partial completion.
- Redirect target is unavailable.
- The app receives a redirect without an authorized workspace.
- The saved starting experience disagrees with the requested app route.
- The user returns to app setup after completing some steps.

Changing business type should update the demo preview and invalidate any stale preset data.

Do not accidentally create multiple workspaces because of navigation or retry.

---

## 21. Testing

Add relevant tests in each frontend project following its existing conventions, plus an end-to-end test of the cross-application handoff when both projects and the backend are available.

Landing page tests:

- Business name validation
- Business type selection
- Starting experience selection
- Navigation between steps
- Back navigation preserves state
- Demo preview matches business type
- Demo API success
- Demo API failure
- Fresh workspace creation
- Import redirect
- Duplicate submission prevention
- Responsive behavior
- Accessibility of selectable cards

MarketChain App tests:

- Authorized workspace loading and rejection of unauthorized workspace IDs
- DEMO entry only after backend confirms the workspace is ready
- FRESH setup navigation, validation, save failures, and resume
- IMPORT file validation, API success/failure, and result handling
- Business type defaults without removing access to later capabilities
- Completion only after backend confirmation
- Expired session and mismatched or missing onboarding state

Cross-application tests:

- Session continuity or safe sign-in and resume
- Correct destination for DEMO, FRESH, and IMPORT
- No sensitive data or access token in redirect URLs

Run available lint, typecheck, and tests.

---

## 22. Implementation Parts and Sequence

### Part 1 — MarketChain Landing Page

Marketing, pricing/features, registration, business name, business type, starting experience, workspace creation call, and demo preview are **reported implemented** in the landing project. Verify these behaviors in that repository, including the backend response and demo readiness check. Complete or correct any missing handoff and session continuity work there.

### Part 2 — MarketChain App

Implement the authenticated destination in this app project. Load the authorized workspace and saved business type/starting experience. Open a confirmed ready demo workspace for DEMO; provide setup and resume for FRESH; provide the import experience for IMPORT. Use backend APIs to save progress and completion. Do not duplicate landing registration or workspace creation.

### Shared backend and handoff dependencies

- Confirm registration/session continuity between origins.
- Confirm business type presets, workspace creation, and demo readiness contracts.
- Confirm app setup, import, progress, and completion contracts.
- Agree on the supported redirect destinations and resume behavior.
- Test all three paths across the two frontends and backend.

Implement each part in its owning project. Operational setup belongs in the MarketChain App, never in the landing page.

---

## 23. Acceptance Criteria

Part 1 — Landing Page is complete when:

- Existing landing page functionality remains working.
- Visitors can enter onboarding through the existing CTAs.
- Users can register or use an existing account.
- Users can provide business name and type.
- Users can choose Demo, Fresh, or Import.
- Demo preview adapts to business type.
- Workspace creation uses the backend.
- Demo and real workspace modes are clearly distinguished.
- Redirect to the MarketChain App works securely.
- Back navigation and validation work correctly.
- The UI matches the existing MarketChain design system.
- Mobile and desktop layouts work.
- No operational ERP logic is duplicated in the landing project.

Part 2 — MarketChain App is complete when:

- The app validates the session and retrieves the authorized workspace and saved onboarding context.
- DEMO opens only a backend-confirmed ready demo workspace.
- FRESH opens the relevant setup steps, saves valid data, and resumes from backend progress.
- IMPORT opens a working import flow with validation and API error handling.
- Existing business name, business type, and account details are reused without asking the user to register or create a workspace again.
- Onboarding completion is shown only after backend confirmation.
- App routes, permissions, existing ERP behavior, and mobile/desktop layouts remain working.

End-to-end onboarding is complete when all three starting experiences work across both frontends with an authorized session and no sensitive data in redirect URLs.

---

## 24. Final Instructions to Codex

**Work in the owning project for each part. Do not immediately rewrite the landing page or replace the app's existing ERP screens.**

First inspect the relevant repository and prepare a short implementation plan showing:

1. Existing components/routes to reuse.
2. Required new screens.
3. Existing APIs that can be reused.
4. Missing backend contracts.
5. Files that need modification.
6. Which part of onboarding the project owns and how it connects to the other frontend.
7. How authentication and authorized workspace context continue into the MarketChain App.

Then implement incrementally.

Preserve all unrelated functionality.

Do not use mocked successful API responses in production paths.

Do not implement duplicate backend business logic in the frontend.

After implementation, provide:

- Changed-file summary
- New routes
- API dependencies
- Environment variables
- Manual testing instructions
- Remaining landing, app, and backend integration requirements

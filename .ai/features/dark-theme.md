# Dark theme implementation plan

Status: proposed; planning only. Runtime changes have not been implemented.

## Goal

Provide a consistent dark appearance across the existing React 16 / Ant Design 3 application while preserving light mode, workflows, permissions, and print output. Follow the [design system](../context/2.%20design-system.md) and [AGENTS.md](../../AGENTS.md).

## Repository findings

- `src/index.jsx` loads precompiled Ant Design CSS followed by `src/themes/global.css`.
- `src/pages/Onboarding/index.jsx` already supports light/dark mode, saves `marketchain:theme`, and falls back to the system preference. Its `data-theme` attribute is scoped to the onboarding page.
- `src/layout/main-app.jsx` hardcodes `const theme = 'light'` for the sidebar/menu and also contains explicit light backgrounds. Sidebar theme props do not theme the full application.
- `global.css`, `style.css`, `element.css`, component CSS, inline styles, and styled-components contain fixed light colors. Legacy table styles use `!important`.
- The installed `@ant-design/dark-theme` 2.0.2 package declares an Ant Design 4 peer dependency; this application uses Ant Design 3. Do not assume it can supply a compatible dark theme.
- Ant Design popups and SweetAlert dialogs can render outside the page container. Page-scoped theme attributes alone cannot cover them.
- Receipts and report previews include print styles; some exports use a separate rendered document rather than the browser print stylesheet.
- `public/index.html` loads external styles, including Tailwind CSS. Include these in cascade checks without expanding this work into a styling migration.

## Proposed behavior

These defaults are recommendations for implementation, not existing product requirements.

- Offer **Light**, **Dark**, and **System** in an accessible appearance control in the application header/profile area. Keep onboarding's control connected to the same shared preference.
- Preserve existing saved `light` and `dark` values in `marketchain:theme`. Accept a new `system` value; missing/invalid values resolve through System, matching onboarding's current fallback.
- Follow operating-system changes only when System is selected. An explicit Light/Dark selection always wins.
- Persist the preference per browser/device. Do not add an account preference endpoint or couple this change to authentication.
- Work for the current visit if storage is blocked. Synchronize changes between browser tabs when storage events are available.
- Changing appearance must preserve form values, filters, navigation, and open dialogs. Do not remount the application or reload the page.
- Keep receipts, invoices, barcodes, QR codes, PDFs, and printable documents readable on white backgrounds. Application chrome may remain dark around a light document preview.

## Technical approach

1. Apply the resolved mode as `data-theme="light|dark"` on `document.documentElement`. This covers the app and overlays mounted beneath `body`.
2. Store preference separately from the resolved mode. Use a small React context compatible with function and class components; CSS-only consumers need no context subscription.
3. Set the initial attribute and page background before the application paints, using a small guarded bootstrap in `public/index.html`. Keep its resolution rules aligned with the runtime helper. Test storage and `matchMedia` failures.
4. Define semantic CSS variables with light defaults and dark overrides. Keep existing brand variable names compatible. Use `color-scheme` for browser-native controls, verifying that it does not alter print/document surfaces.
5. Add scoped Ant Design 3 dark rules. Convert shared hardcoded colors to variables where the semantic role is clear, preserving their current light values.
6. Replace inline/styled-component color literals incrementally in affected screens. Avoid universal color overrides, CSS inversion filters, broad `*` selectors, or a library/framework upgrade.
7. For charts that draw into canvas/SVG using JavaScript colors, pass the resolved palette to their existing configuration. CSS variables alone do not repaint canvas charts.

## Proposed file ownership

| File / area | Planned responsibility |
| --- | --- |
| `src/themes/tokens.css` (new) | Light/dark semantic variables |
| `src/themes/dark.css` (new) | Ant Design 3 and third-party dark overrides |
| `src/themes/theme-preference.js` (new) | Preference validation, resolution, storage helpers |
| `src/context/theme-context.jsx` (new) | Shared preference, listeners, hook/context consumer |
| `src/components/ThemeControl/index.jsx` (new) | Accessible Light/Dark/System selection using existing components/icons |
| `public/index.html` | Initial mode, minimal initial background, browser theme-color |
| `src/index.jsx` | Install provider and theme imports |
| `src/layout/main-app.jsx`, `src/layout/NewSidebar.css` | Theme control, sidebar/menu mode, header/content/notification colors |
| `src/pages/Onboarding/index.jsx`, `onboarding.css` | Replace independent preference state with shared state; preserve page appearance |
| `src/themes/global.css`, `style.css`, `element.css` | Resolve shared hardcoded colors and conflicting overrides |
| Shared components and feature styles | Incremental surface/text/border/status migration |
| Receipt/invoice/report export styles | Explicit document palette and print isolation |

Final filenames may follow nearby implementation conventions. Keep existing user edits in these files intact.

## Semantic palette

Define roles before choosing final dark hex values. Preserve the teal brand identity, but verify contrast separately for button fills, button text, links, and focus rings.

| Role | Intended use |
| --- | --- |
| `--app-bg`, `--surface-bg`, `--surface-raised-bg` | Page canvas, cards, overlays |
| `--text-primary`, `--text-secondary`, `--text-disabled` | Main, supporting, disabled text |
| `--border-color`, `--divider-color` | Input/card boundaries and separators |
| `--hover-bg`, `--selected-bg` | Hovered and selected controls/rows |
| `--input-bg`, `--disabled-bg` | Editable and disabled controls |
| `--row-bg`, `--row-alt-bg`, `--row-hover-bg` | Table striping and interaction |
| `--focus-ring`, `--overlay-mask`, `--surface-shadow` | Focus, modal backdrop, elevation |
| Semantic success/warning/error/info foreground and background pairs | Messages, badges, validation, domain statuses |
| `--document-bg`, `--document-text` | Stable light print/export surfaces |

Do not assign a dark color by mechanically inverting the light color. Status meanings, monetary signs, and chart series identities must remain consistent. Confirm English/Khmer readability and contrast on a representative screen before expanding coverage.

## Delivery phases

### 1. Audit and baseline

- Inventory active routes and create a coverage checklist for shell, login/onboarding, dashboard, inventory, sales, purchases, finance, reports, settings, and POS/payment screens.
- Capture light-mode baselines for a table/filter page, validated form, dashboard/chart, POS/payment flow, popup, and printed receipt.
- Identify which shared components and print/export paths each pilot screen actually uses; distinguish active routes from copies/prototypes.

Done when: pilot screens and document-output examples are recorded, with known hardcoded styles and popup owners.

### 2. Foundation and shell pilot

- Implement semantic variables, shared preference/context, initialization, and appearance control.
- Migrate shell/header/sidebar/menus, loading screens, and onboarding preference state.
- Preserve onboarding's existing dark styles initially; consolidate its palette only after visual comparison.
- Add behavior tests for preference precedence, invalid values, blocked storage, system changes, tab synchronization, and listener cleanup. Verify bootstrap/runtime resolution agree.

Done when: mode survives refresh/navigation, overlays inherit the root mode, and switching does not reset screen state. Treat this as a foundation preview until component coverage is complete.

### 3. Shared controls and first complete workflow

- Cover buttons; inputs/selects; date/time pickers; checkboxes/radios/switches; tables/pagination; tabs/cards; modal/drawer; dropdown/tooltip/popover; messages/notifications; SweetAlert; loading/empty/error states.
- Inspect disabled, hover, focus, selected, expanded, validation, and destructive states. Include popups attached to `body` and later-loaded styles.
- Migrate shared `PageHeader`, `CustomFormItem`, `MonetaryValue`, statistic cards, and profile/notification UI where used.
- Finish one inventory list/create/edit workflow in both modes before repeating the pattern across modules.

Done when: the pilot workflow, including all overlays and validation states, is usable in both modes and matches its light baseline.

### 4. Feature rollout

- Extend in batches: dashboard/charts; inventory; sales/customers; purchasing/vendors; finance/reports; settings; POS/payment; login and any remaining public screens.
- Keep a route checklist with verified/remaining exceptions. Migrate hardcoded colors in each batch rather than declaring completion after the shell changes.
- Give charts dark-aware axes, grid, legends, tooltips, and series palettes. Check third-party editors/uploaders where used.
- Review payment QR codes, product imagery, logos, embedded remote content, and preview documents individually. Preserve intentionally light content surfaces.

Done when: all agreed active routes and relevant interaction states have visual coverage, including deferred/lazy-loaded modules.

### 5. Print, regression, and release

- Verify browser print, `react-to-print`, PDF/image export, receipt templates, and barcode/QR output through the actual paths used by the application.
- Apply light document variables to document wrappers, not only `@media print`; DOM-to-image/PDF capture can run with screen styles. Restore the correct `color-scheme` for documents.
- Check desktop/tablet/mobile, keyboard controls, focus visibility, long translations, Khmer text, and contrast. Test both modes after navigating between modules with different stylesheet imports.
- Run meaningful theme behavior tests and the affected existing tests. Run the production build and inspect generated changes: the repository's build/prebuild scripts generate version metadata.
- Update the design-system guide with the final token names, theme API, component rules, and documented exceptions.

Done when: no unreadable surfaces remain in the agreed coverage, light mode has no unintended visual changes, document output is stable, and checks pass.

## Risk controls and rollback

- **Cascade and `!important`:** inspect computed styles; replace the owning declaration or narrowly scope an override. Test navigation order and late CSS imports.
- **Inline colors:** convert the affected owner to a semantic variable; a global dark selector cannot reliably fix inline light styles.
- **Portals:** test modal, select/date picker, tooltip, message, and SweetAlert containers independently.
- **Preference drift:** remove onboarding's independent storage/state handling when adopting the shared provider; keep one preference source.
- **Theme flash:** verify a cold load and refresh on a saved dark preference with cache disabled; test the initial background before JavaScript bundles finish.
- **Light regressions:** preserve light token values per component and compare baselines after each batch.
- **Unsupported dependencies:** do not activate the Ant Design 4 theme package in the Ant Design 3 app. Any dependency upgrade is a separate task.
- **Rollback:** keep batches small and retain a working Light selection. Roll back the affected batch without clearing theme storage, auth data, or user form state.

## First implementation task

Start with phases 1–2: audit the pilot routes, establish shared tokens/preference, connect onboarding, and theme the application shell. Compare that result against the baseline before broad feature rollout.

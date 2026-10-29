Enhance my existing **Add New Category** page to match the two attached screenshots as closely as possible.

Read DESIGN.md, UI_DESIGN_SYSTEM.md, frontend rules, and applicable project instructions first. Inspect the existing category form, validation, APIs, media upload, and POS category rendering.

Reuse existing components, Ant Design primitives where applicable, Lucide icons, form handling, design tokens, and API clients.

## 1. Scope and page layout

The screenshots represent one continuous page at different scroll positions. Do not duplicate the appearance, preview, or summary cards.

Recreate:
- Breadcrumb and page header.
- Category Details card.
- POS Register & Touch Tile Appearance card.
- Category Image & Media card.
- Right-side POS Tile Live Preview.
- Right-side Settings Summary.
- Bottom form actions.

Desktop:
- Main form column approximately two-thirds width.
- Right preview/summary column approximately one-third.
- Approximately 32–40px column gap.
- Keep the right column sticky below the shared application header where practical.

Mobile:
- Stack cards in a logical order.
- Wrap controls and action buttons without overflow.

Preserve existing category fields and business rules outside the screenshot. Do not remove hierarchy or other required settings.

## 2. Visual styling

Match the screenshots:
- Very pale gray-blue page background.
- White cards with thin pale blue-gray borders.
- Approximately 16px card radius.
- Approximately 28–32px card padding.
- Dark navy headings.
- Muted slate-blue descriptions.
- Green/teal primary actions and selected controls.
- Pale mint icon tiles.
- Subtle dividers between card headers and content.
- Inputs approximately 46–48px high with 10–12px radius.
- Consistent spacing between labels and controls.

Use DESIGN.md tokens where defined. Match the screenshot’s proportions without scaling its entire canvas into fixed pixel dimensions.

Support English and Khmer with appropriate fonts and line heights.

## 3. Breadcrumb and page header

Breadcrumb:
**System Settings › Items Management › Categories › Add New Category**

Include the small settings icon before System Settings.

Header left:
- Outlined square back button.
- Title: **Add New Category**.
- Small outlined mint **Draft** badge.
- Subtitle: “Configure taxonomy and POS register appearance.”

Header right:
- Outlined **Cancel** button.
- Green **Save Category** button with save icon.
- Compact keyboard shortcut badge.

Implement Cmd+S / Ctrl+S only when supported, preventing the browser save dialog while the form is active. Use the same submit handler as all other save controls.

The Draft badge represents an unsaved form unless persisted draft functionality actually exists.

Place a thin horizontal divider below the header.

## 4. Category Details card

Header:
- Category/shapes icon inside a pale mint rounded tile.
- Title: **Category Details**.
- Subtitle: “Identifiers, naming, and active catalog availability”.
- Right-side neutral pill with a green dot:
  “Auto-assigned: CAT-049”.

Use the real code-allocation mechanism. If the final code is assigned only after saving, show “Assigned on save” or clearly label a provisional value. Do not calculate the next code from the visible category list.

Two-column field layout:

### Category Name (English)
- Required indicator.
- Reference value: Dairy & Frozen Goods.
- Apply existing required, length, and uniqueness rules.

### Category Name (Khmer Unicode)
- Optional unless existing rules require it.
- Small “KM (ខ្មែរ)” label on the right.
- Use actual entered Khmer text without inventing a translation.

### System SKU Prefix / Code
- Reference: CAT-049.
- Monospace text.
- Light tinted background.
- Pencil icon on the right.

Preserve the actual distinction between category code and product SKU prefix. Adjust the label if these are different fields in the application.

Allow editing only if the existing backend and permissions support it. Otherwise present the code as read-only without a misleading edit action.

### Publishing Status
- Tinted bordered control.
- Green dot and text: “Active in POS & Web”.
- Switch aligned right.

Bind to actual supported publishing/status fields. Do not imply that one switch controls POS and web independently if the backend has separate visibility settings.

### Operational Notes & Description
- Full-width textarea.
- Placeholder:
  “Add storage requirements, temperature limits, or cashier handling notes…”
- Approximately 76–96px initial height.
- Preserve existing limits and validation.

## 5. POS Register & Touch Tile Appearance card

Header:
- Register icon inside a pale mint tile.
- Title: **POS Register & Touch Tile Appearance**.
- Subtitle:
  “Color theme, icon stamp, and cashier quick access placement”.
- Right-aligned switch labeled **Pin to Quick Ribbon**.

Bind this switch to actual POS quick-access configuration. Keep it separate from category publishing status.

### Tile Accent Color

Display eight rounded square swatches:
- Green.
- Blue.
- Amber.
- Orange.
- Purple.
- Pink/red.
- Teal.
- Slate.

Approximate reference colors:
- Green: #059669.
- Blue: #3B82F6.
- Amber: #F59E0B.
- Orange: #F97316.
- Purple: #8B5CF6.
- Pink: #F43F5E.
- Teal: #14B8A6.
- Slate: #64748B.

Swatches:
- Approximately 42–46px square.
- Approximately 10–12px radius.
- Consistent gaps.
- Selected swatch has an outer selection ring, a small separating gap, and white checkmark.

Right side:
- Compact custom-color control.
- Color dot plus editable hexadecimal value.
- Display the complete valid value; do not reproduce the screenshot’s clipped hex text.

Keep swatches and custom input synchronized. Validate custom colors and show inline errors without breaking the preview.

### Tile Icon

Render eight equal selectable icon cards:
1. Frozen — ice-cream icon.
2. Bag — shopping-bag icon.
3. Beverage — cup icon.
4. Dairy — suitable dairy/food icon.
5. Packs — package icon.
6. Electric — lightning icon.
7. Health — medical-kit icon.
8. Promo — tag icon.

Use the existing supported icon set and stable icon identifiers.

Each card:
- Icon centered above label.
- Pale neutral background.
- Thin border.
- Approximately 76–80px high.
- Rounded corners.
- Entire card clickable.

Selected card:
- Pale mint background.
- Strong green border.
- Green icon and label.

Use accessible single-choice semantics and keyboard navigation. Wrap the grid responsively.

### Display Priority Sequence
- Numeric field with ordering icon.
- Reference value: 12.
- Validate according to existing ordering rules.
- Use the same ordering direction and tie-breaking behavior as the POS.

### Touch Sound Profile
- Select beside Display Priority Sequence.
- Reference selection: “Default Mechanical Click (80Hz)”.

Use actual available profiles. Do not invent audio options or frequency claims. If unsupported, show an accurately disabled control with a brief explanation or report the missing integration.

Do not play audio automatically.

## 6. Category Image & Media card

Header:
- Image icon in a pale mint tile.
- Title: **Category Image & Media**.
- Subtitle:
  “Display photography for customer-facing POS, web catalog, and digital menus”.
- Right-side segmented control:
  - Icon + Color.
  - Category Photo.

Use this control to select the category’s display mode.

### Category Photo Upload

Left area:
- Label: **Category Photo Upload**.
- Large pale drop zone with dashed border.
- Centered circular upload icon.
- Text:
  “Click to browse or drag & drop category photo”.
- Supporting format/size guidance.
- Two compact informational chips:
  - 1:1 Aspect ratio.
  - Transparent or solid BG.

Reference guidance:
“PNG, JPG, or SVG up to 2MB (recommended 400×400px)”.

Use actual backend-supported formats and limits. Only advertise SVG when the existing upload/rendering pipeline supports safe SVG handling.

Support:
- Native file selection.
- Drag and drop.
- File validation.
- Upload progress where applicable.
- Useful upload errors.
- Existing crop/resize flow if available.

Do not stretch images. Explain or handle non-square images through the existing policy.

### Uploaded Thumbnail

Right area:
- Label: **Uploaded Thumbnail**.
- Pale bordered preview panel.
- Centered square thumbnail with rounded corners.
- Small dimensions overlay using actual image dimensions.
- Bottom row:
  - Wide outlined **Replace** button.
  - Small outlined red trash button.

Use the actual selected/uploaded image. Do not use the screenshot’s milk photo as production content.

Replace opens file selection. Remove clears the form’s image selection according to existing media lifecycle rules. Discarding an unsaved form must not unintentionally delete existing shared media.

Keep media controls available in Icon + Color mode so a photo can be prepared without immediately switching the display mode.

## 7. POS Tile Live Preview

Right-side white card.

Header:
- Touch/pointer icon.
- Title: **POS Tile Live Preview**.
- Small neutral dimensions badge: “120×96 px” in the reference.

Use actual POS tile dimensions. If the preview is enlarged, label it as scaled instead of implying its on-screen size is exactly 120×96.

Inside a large pale bordered preview panel:

Top:
- Label: **Register Display Mode**.
- Segmented control:
  - Icon Mode.
  - Photo Mode.

This control and the media-card display-mode control must use the same form state:
- Icon Mode corresponds to Icon + Color.
- Photo Mode corresponds to Category Photo.

Center:
- Rounded category tile with subtle shadow.
- Selected accent color as background in icon mode.
- Selected white icon at top left.
- Priority marker at top right, such as #12.
- English category name near the bottom.
- Smaller Khmer name below.

Use ellipsis for long names while providing the full text accessibly.

Photo mode:
- Render the actual category image.
- Use a readable text overlay or appropriate contrast treatment.
- Handle a missing photo with a clear placeholder and applicable validation.

Below the tile:
- Small green dot.
- Caption adapting to the selected mode:
  “Showing: Icon & Accent Color style”.

Below the preview panel:
- Full-width tinted metadata strip.
- Left: **Assigned System Code**.
- Right: actual code in bold monospace.

Preview updates immediately as the user changes names, color, icon, image, mode, or priority.

Prefer reusing the real POS category-tile component or shared rendering logic so the preview matches the saved result.

## 8. Settings Summary

Separate white card below the preview.

Header:
- Checklist icon.
- Title: **Settings Summary**.
- Small mint status badge: **Ready to save** when applicable.

Rows:
- POS Quick Ribbon:
  “Enabled (Priority 12)” or the actual disabled state.
- Margin Protection:
  “≥ 25% Gross” in the reference.
- Terminal Sync:
  Green dot and “14 active registers” in the reference.

Use live form values and actual configuration.

Important:
- Display margin protection only from a real explicit or inherited rule.
- Distinguish gross margin from markup.
- If inherited, identify its source where useful.
- Do not create a hidden 25% default merely to match the screenshot.
- Connected-register counts do not prove an unsaved category has synchronized.
- Before saving, use wording such as “Applies to 14 active registers” only when supported.
- Show pending or unavailable sync information accurately.
- Do not mark the form ready while validation or upload is pending.

## 9. Bottom actions

At the bottom of the main form column:
- Thin top divider.
- Left red text action: **Discard Changes**.
- Right outlined button: **Save & Add Another**.
- Right green button with circled-check icon: **Save Category**.

Behavior:
- All save buttons share validation and submission logic.
- Save Category follows existing success navigation.
- Save & Add Another saves successfully, then resets the form using established defaults and refreshes any code preview.
- Failed saves preserve entered values.
- Prevent duplicate submissions.
- Cancel, Back, and Discard use the existing unsaved-changes confirmation when the form is dirty.
- Clear dirty state only after a confirmed successful save or deliberate discard.

## 10. Data and integration

Map every visible control to the existing category model.

Preserve:
- Category hierarchy.
- Tenant/location boundaries.
- Authorization.
- Existing uniqueness and validation rules.
- Existing media lifecycle.
- POS cache refresh/synchronization behavior.

If appearance fields require backend changes, extend the existing category module using project conventions. Do not store persistent settings only in local component state or fabricate successful saves.

Keep publishing status, quick-ribbon visibility, display mode, and display priority as distinct concepts.

For edit mode:
- Populate existing values.
- Show Edit Category and the actual status.
- Preserve the category identifier and existing image.
- Reuse the same layout and validation.

## 11. Accessibility and states

- Associate labels, help text, and errors with fields.
- Give icon-only controls accessible labels.
- Make swatches and icon cards keyboard-accessible with selected states.
- Provide visible focus styling.
- Ensure text contrast for custom tile colors.
- Support Khmer input and composition.
- Provide loading, upload, saving, failure, and unavailable states.
- Keep the form usable at mobile widths and browser zoom.

## 12. Verification

Implement the page fully and compare both screenshots section by section.

Verify:
- Header, breadcrumb, draft/status badge, and top actions.
- All Category Details fields.
- Color swatches, complete hex input, and all eight icon cards.
- Quick-ribbon toggle, priority, and sound profile.
- Media mode, upload, thumbnail, replace, and remove.
- Live preview and synchronized mode controls.
- Accurate summary values.
- Bottom save/discard actions.
- Create/edit behavior, validation, unsaved changes, and duplicate-submit prevention.
- Responsive layout and Khmer rendering.

Run appropriate lint/type checks and relevant existing tests. Where browser preview is available, inspect desktop and mobile layouts and correct visual differences.

Report changed files, verification results, and any missing backend fields or integrations.

---

## Implementation Status (2026-10-25)

The initial category creation page is implemented at `src/pages/Setting/Modules/Category/form.create.jsx` and is available at `/settings/categories/create`. The Category list and Settings → Items Management links navigate to it. The previous category modal remains available to item creation so that workflow is preserved.

The create-page breadcrumb is **System Settings › Categories › Add New Category**; “Items Management” is omitted per the requested navigation label.

### Implemented with the current frontend contract

- Responsive two-column creation layout, breadcrumb, heading, unsaved Draft indicator, and Cancel/Save actions.
- Existing category create request and validation for the English category name.
- Parent category, category label, description, feature-category flag, and Khmer `namekm` input.
- Existing category image upload pipeline; the system code is presented as “Assigned on save” because the client has no code-allocation mechanism.
- Eight preset accent colors, a validated custom hex input, and synchronized Icon Mode / Photo Mode controls update the local POS tile preview only. The selected `posColor` and `displayMode` are deliberately not sent to the category API until their write contracts are confirmed.
- Name/photo preview, Settings Summary, Ctrl/Cmd+S submission, discard confirmation, duplicate-submit prevention, and Save & Add Another reset behavior.
- The form submits the existing create-flow values plus `namekm`; other unconfirmed POS appearance settings are not submitted.

The old edit modal remains in place. A full-page edit flow, including safe image replacement/removal, is not implemented yet.

### Backend contract needed to complete the remaining requirements

The concrete current/proposed payload handoff is in [Category backend payload review](./setting.module.new.category.backend-payload.md). It includes the service-added `isSystem: 0`, appearance fields awaiting approval, image upload behavior, and update/clear semantics.

Please confirm and document the following for both category create and update APIs before these values are added to the form payload:

1. **Publishing and status:** the writable status field, allowed values, defaults, and how it relates to `isFeature` and POS/web channel visibility. These are separate concepts and should not share one switch unless the API defines that behavior.
2. **POS quick ribbon:** whether `posQuickAccessEnabled` is accepted on create/update, its default, and whether a priority/order field is required. The list response exposes `posQuickAccessEnabled`, but write support has not been confirmed.
3. **Tile appearance:** accepted fields and enums for accent color, stable icon identifier, display mode (`icon/color` versus photo), and display priority. Confirm POS ordering/tie-breaking and actual tile dimensions. The client must not invent icon identifiers or mode values.
4. **Touch sound:** an endpoint or documented list of supported sound-profile IDs and the accepted write field. No audio profiles are currently available in the frontend contract.
5. **Margin protection:** the accepted margin-rule object, including whether the value is gross margin or markup, percent units, explicit versus inherited rules, inheritance source, and how “no rule” is represented. Do not use a default margin unless the API returns one.
6. **Generated category code:** confirm the response field containing the assigned code, whether it is generated only after save, and whether a preview endpoint exists. The client must not calculate the next code from a paginated category list.
7. **Khmer name:** confirm that create/update accepts `namekm` and its maximum length. The existing POS client searches categories using `namekm`, but the current category create form did not submit it.
8. **Media contract:** supported MIME types, file-size and dimension limits, upload response field containing the stored image key, and whether image deletion can be deferred until save. The current uploader can delete an existing image immediately when removed, which is unsafe for an edit form that may later be discarded.
9. **Terminal synchronization:** an authorized source for active-register count and sync state, plus the expected post-save refresh behavior. A register count alone must not imply that a new, unsaved category has synchronized.
10. **Validation errors:** document field-level validation response shapes for duplicate names/codes, invalid parent relationships, unsupported colors/icons, and media errors so the form can attach messages to the right controls.

The existing category summary endpoint supplies aggregate list-card values; it does not supply these category-write settings. Please include the confirmed request/response examples and enum definitions in the API contract (and runnable collection if one is maintained).

### POS Register & Touch Tile Appearance implementation (2026-10-26)

- The card uses the same compact typography as the surrounding form, with a register icon, divider, all eight palette colors, a color-matched selection ring/checkmark, and a complete editable hex value beside the native color picker.
- Eight local preview icon choices are available: Frozen, Bag, Beverage, Dairy, Packs, Electric, Health, and Promo. Radio-group semantics, arrow keys, Home/End, and visible focus support keyboard selection. Local IDs are preview keys; they are not assumed to be backend icon identifiers or sent to the API. New categories do not automatically receive the screenshot's Frozen selection.
- Color, icon, and priority changes update the live preview immediately and survive display-mode switches. Priority starts empty, preserves zero, and accepts safe whole numbers for preview only. Actual ordering direction, allowed backend ranges, and tie-breaking still require confirmation.
- Quick ribbon is shown as an accurately disabled switch until the `posQuickAccessEnabled` write contract is confirmed. Sound profile selection is disabled because no supported profile list is available. No reference sound/frequency is invented.
- The existing category save payload is preserved. Color, icon, priority, and display mode remain explicitly preview-only until appearance writes are supported. This card belongs to the create page; the existing separate edit modal has not been converted or given unconfirmed appearance fields.
- Remaining integrations are listed under backend requirements 2–4 above: quick-ribbon writes/defaults, appearance fields and icon identifiers, priority ordering/ranges, and sound profiles. Saved-value restoration must be connected when the edit flow supports these fields.
- Verification: 8 appearance tests and 9 media tests passed; Webpack development compilation, CSS syntax validation, and `git diff --check` passed. ESLint is blocked by missing `eslint-plugin-react`. Browser screenshot comparison was unavailable.

### Category Image & Media review (2026-10-26)

- Media mode selection remains synchronized with the POS preview. The selected media segment uses a white surface and dark text.
- Upload and thumbnail columns stay side by side down to a 580px card content width, with aligned labels and equal panel heights. Smaller screens stack the columns.
- The card enforces a **2 MB frontend limit** to match the reference guidance. JPG, PNG, and GIF follow the existing category uploader's advertised formats; unsupported MIME types, including SVG disguised with another extension, are rejected. The backend media limits and safe SVG support still require confirmation under the media contract above. The separate crop utility's 5 MB output limit is not treated as the category upload limit.
- Images retain their original dimensions and content. The square thumbnail uses a centered display crop, with visible guidance explaining that previews crop to fit.
- Save and the keyboard shortcut wait for image decoding, uploading, or removal to finish. Failed replacements retain the previous image; stale upload/removal responses cannot change the form after a newer selection or unmount.
- Focused media behavior tests cover validation, original dimensions/save shape, upload failures/races, removal failures/unmount, and pending-save protection.
- Review verification: 9 focused tests passed; Webpack development build passed; `git diff --check` passed. ESLint remains blocked by the missing `eslint-plugin-react` dependency. No rendered browser or live API verification was performed.

### Earlier verification

- Relevant Settings/category tests: 24 passed.
- Webpack development build: passed.
- `git diff --check`: passed.
- Live API submission and screenshot comparison were not performed; no reference screenshots were available in the workspace.

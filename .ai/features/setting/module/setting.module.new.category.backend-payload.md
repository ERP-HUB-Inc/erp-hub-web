# Category create payload

## Current create contract

The user supplied the following create body on 2026-10-26. The full-page form at
`/settings/categories/create` prepares this shape through `create-payload.js`
and sends it through the existing `CategoryAction.add` / `CategoryService.add` flow.

```json
{
  "name": "Drinks",
  "namekm": "ភេសជ្ជៈ",
  "namebm": "",
  "code": "DRINKS",
  "parentId": null,
  "image": "",
  "description": "All beverage products",
  "label": "Drinks",
  "status": 1,
  "isDefault": false,
  "isFeature": false,
  "posColor": { "name": "Blue", "hex": "#2563EB" },
  "posQuickAccessEnabled": true,
  "defaultMarginRule": { "type": "GROSS_MARGIN", "value": 25 }
}
```

These are entered values, not hardcoded category data. The shared create service
continues to append `isSystem: 0`; its behavior is unchanged.

- English name remains required with the existing 100-character limit. Khmer name
  retains its existing optional 100-character limit. Burmese name and code are
  optional inputs; no new backend length or uniqueness rules were inferred.
- Unfilled text fields become `""`; an unselected parent becomes `null`.
- Status initially uses existing active value `1`; inactive uses `0`. Default,
  feature, and quick-access flags initially use `false`. Explicit `0` and `false`
  values are preserved.
- Color initially uses the existing Green choice. Presets use their display names;
  a non-preset color uses `"Custom color"`. Hex values use uppercase `#RRGGBB`.
  Invalid color drafts block submission.
- Gross margin is optional and must be a finite number if entered. A blank value
  omits `defaultMarginRule`; zero is preserved. Only the supplied `GROSS_MARGIN`
  type is offered. Backend percentage bounds and optional-field requirements were
  not specified by the example; no additional limits are assumed.
- Photo/upload behavior is unchanged and deferred from this task. Empty initial
  photo remains `""`; existing image key extraction and removal behavior remain.
- Icon, display priority, and display mode remain local preview fields and are
  omitted from requests. Touch Sound Profile has been removed from the form.
- Duplicate names use HTTP `409` with `error.code: "CATEGORY_NAME_EXISTS"` and the
  message `"This category name is already in use."`. The form displays this next
  to the name and in its banner, preserves values, and handles the rejected save
  promise so it does not become an uncaught browser error.

Unit tests cover the example, defaults, zero/false preservation, unsupported-field
exclusion, invalid color handling, and the existing Redux 409 path. The Cypress
spec asserts the new request shape and persisted color, quick-access, and margin
values. Neither the revised contract nor these new browser assertions have been
verified against a live backend in this change. Legacy create/edit modals have
not been extended with these fields.

## Historical review (superseded for full-page creation)

The sections below record the earlier proposal. Current full-page creation
behavior is described above; the older statements about color and quick access
being preview-only no longer apply. Deferred photo questions remain relevant.

## 1. Payload sent today

Creation uses `CategoryAction.add` → `CategoryService.add` → `BaseService.add`. The category resource path is `/categories` under the configured API base. The service sends JSON with the existing authentication headers.

Example of a populated create request:

```json
{
  "name": "Dairy & Frozen Goods",
  "namekm": "",
  "parentId": "PARENT_ID",
  "label": "Dairy",
  "description": "Chilled and frozen products.",
  "isFeature": false,
  "image": "category-photo.png",
  "isSystem": 0
}
```

`PARENT_ID` and the image filename are illustrative placeholders. Use the existing category ID type and the actual stored image key; neither value should be hardcoded.

| Field | Current frontend behavior |
|---|---|
| `name` | Required string, maximum 100 characters. |
| `namekm` | Optional string, maximum 100 characters; the new create form includes it. |
| `parentId` | Uses the selected category's actual `id`. Unselected/cleared values can be `undefined` and omitted from JSON. Confirm the ID type and how to explicitly clear a parent on update. |
| `label` | Optional string; no frontend length limit currently specified. |
| `description` | Optional string; no frontend length limit currently specified. |
| `isFeature` | Optional boolean. A selected `false` is preserved. It is distinct from publishing status and quick-ribbon visibility. |
| `image` | Stored filename/key string extracted from the upload form value. Initially no image becomes `""`; removing an uploaded image sets `null`. Confirm accepted empty values. |
| `isSystem` | The shared create service appends numeric `0`. Backend authorization must still enforce system-category rules. |

Unfilled optional fields may be omitted by JSON serialization; they are not automatically converted to `null` or empty strings.

The legacy edit modal uses `CategoryAction.update` → `BaseService.update`, sending `PUT` to the configured category resource URL plus `/{id}`. It includes the category `id` in the body. That modal does not currently expose Khmer naming or the new appearance controls. The shared update method does not automatically add `isSystem`.

## 2. Proposed extended payload

Please confirm these field names, types, enums, defaults, and availability on **both create and update** before the frontend sends them. Prefer existing backend equivalents if they already exist.

```json
{
  "name": "Dairy & Frozen Goods",
  "namekm": "",
  "parentId": "PARENT_ID",
  "label": "Dairy",
  "description": "Chilled and frozen products.",
  "isFeature": false,
  "image": "category-photo.png",
  "isSystem": 0,
  "posQuickAccessEnabled": true,
  "posColor": "#059669",
  "posIcon": "frozen",
  "displayMode": "icon",
  "displayPriority": 12,
  "touchSoundProfileId": null
}
```

This is an example create body, not a default configuration for every category. `isSystem: 0` is the existing create-service addition; do not assume update adds it. Priority `12`, the selected icon, and quick-ribbon `true` are examples only.

| Proposed field | Proposed type | Backend confirmation needed |
|---|---|---|
| `posQuickAccessEnabled` | Boolean | The list already reads this exact key. Confirm write support, default, permissions, and independence from `isFeature` and publishing status. |
| `posColor` | String, nullable if supported | Accept normalized `#RRGGBB`, including custom colors outside the eight presets. Confirm default, null/inheritance behavior, and validation. The listing already reads `posColor` with a `color` fallback. |
| `posIcon` | Stable icon key, nullable if supported | Confirm the canonical field name and icon enum. Local preview keys are `frozen`, `bag`, `beverage`, `dairy`, `packs`, `electric`, `health`, and `promo`. Approve or map these to backend identifiers; do not store React component names or SVG markup. |
| `displayMode` | `"icon"` or `"photo"` | Confirm actual enum values and default. Specify whether Photo Mode requires an existing/uploaded image. Icon Mode should retain the stored photo for switching back. |
| `displayPriority` | Integer, nullable if supported | Confirm minimum/maximum, whether zero and negatives are allowed, ordering direction, scope (global/parent/ribbon), and tie-breaking. Current local preview accepts safe whole numbers and preserves zero; that is not proof of backend acceptance. |
| `touchSoundProfileId` | Existing profile ID type, nullable if supported | Provide actual supported profile IDs/labels and how to obtain them. Confirm default and clear/inherit semantics. No fabricated profile or frequency should be stored. |

The current frontend does **not** send any of these six proposed fields. Color, icon, mode, and priority currently affect the local preview only; quick ribbon and sound controls are disabled.

## 3. Update and clear semantics

Please confirm these rules using the existing update endpoint:

- An omitted appearance field preserves the saved value; opening an older edit form must not reset newly introduced settings.
- Explicit `false` and numeric `0` are real values and must not be replaced by defaults.
- For optional fields that support clearing, define whether `null` clears or means inherit. Reject `null` on fields that are not nullable.
- For `image`, confirm whether omission preserves, a stored key replaces, and `null` clears the association. The frontend currently also produces `""` for an initially empty image, so specify whether to accept or normalize it.
- Define how to clear `parentId`; a cleared select currently can omit it, which may preserve the old parent rather than remove it.
- Specify supported behavior when clearing an image while `displayMode` is `"photo"`: return a field validation error or apply a documented mode change.
- Keep the icon, color, priority, and uploaded photo when changing display mode.

After confirmation, the frontend can normalize empty values, validate confirmed ranges, include the new fields in Save Category, and restore returned values in edit mode.

## 4. Read responses needed for restoration and POS

Please return canonical saved values for all supported appearance fields in category detail and the appropriate list/POS responses, using the existing response envelopes. Return the category ID and stored image key as well.

If defaults/inheritance are supported, distinguish an explicitly saved value from its resolved display value so editing does not unintentionally overwrite inherited settings. Supply a create/update request example and the corresponding detail response.

The existing edit modal must be enhanced separately to display and restore these fields once their contract is confirmed. No full-page edit integration is currently in place.

## 5. Separate image upload contract

The category JSON body contains only the stored image key. Do not require the upload event, `fileList`, `uid`, browser `File`, SVG markup, or local dimension metadata in Save Category.

Current upload flow:

- `POST /file/v1/upload/category` relative to the configured upload API root, using multipart field `image`.
- Frontend permits JPG, PNG, and GIF, enforces a 2 MB client limit, and checks that the browser can decode the image. These limits still need backend confirmation and server-side enforcement. SVG is not enabled.
- The uploader reads a top-level `filename` from the response body and otherwise falls back to the selected file's original name. Please confirm the actual stored-key response field; a renamed server file must not be saved under the original client filename.
- Thumbnail dimensions are measured from the image; the original is retained and previews crop to fit.
- Current removal uses `DELETE /file/v1/category/delete` with JSON `{ "fileName": "category-photo.png" }` before clearing the form field.

Please clarify temporary-upload ownership/cleanup and whether removing saved media can be deferred until category save. The current immediate delete behavior must not be reused for shared/saved images in an edit flow that can be discarded.

## 6. Validation responses requested

Provide the existing field-error response shape and examples for:

- Unsupported icon/mode/profile ID or malformed color.
- Invalid priority range, including the allowed handling of zero.
- Photo Mode without a usable image.
- Invalid parent/circular hierarchy or duplicate category naming, where applicable.
- Invalid/unauthorized uploaded image key, unsupported MIME type, or oversized image.

Use field names that the frontend can map to the relevant controls. Confirm write authorization and provide real profile/icon enums; no live endpoint or permission behavior was verified in this review.

## Source references

- `src/pages/Setting/Modules/Category/form.create.jsx`: registered create fields, image conversion, and preview-only state.
- `src/pages/Setting/Modules/Category/redux/action.js`: create/update dispatch.
- `src/services/CategoryService.js`: category resource URL.
- `src/services/BaseService.js`: create `isSystem: 0` addition and update URL.
- `src/components/BaseComponent/index.jsx`: `getImageFromUpload` filename extraction.
- `src/pages/Setting/Modules/Category/form/form.update.jsx` and `form/form.item.jsx`: current legacy edit payload.

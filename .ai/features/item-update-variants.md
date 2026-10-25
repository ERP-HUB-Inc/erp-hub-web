# Item updates with an unopened Variants section

The frontend omits `productVariants`, `attributes`, and `productVariantId` for
variant items when their Variants section has never initialized. Saving other
item fields must preserve existing variants and attributes in this case.

Opening the section initializes variant fields. Subsequent saves include the
variants and attributes even if the user collapses the section again. An
initialized but empty variant collection still fails frontend validation.

## Backend requirement before release

Check `PATCH /items/:id` in the backend. Omitted variant fields must mean
"leave existing data unchanged". Do not normalize omitted `productVariants`
to an empty collection for pricing or status calculations. Preserve the item's
minimum price and avoid changing its status as a side effect of missing variants.
If recalculation is needed, use the persisted variants.

The local `pos-api` implementation in `ItemService.saveRecord` currently defaults
missing variants to `[]` and calculates `minPrice = 0` for variant items, which
can mark them inactive. Its update DTO mapper must also preserve omission.

Verify these cases against the backend:

- Update only an item's name: variants, attributes, minimum price, and status stay unchanged.
- Update variant fields: persist edits and recalculate pricing as expected.
- Explicit empty variants: handle according to the API's validation rules.
- Standard item updates: retain existing single-variant price and identifier handling.

Frontend unit tests verify payload construction and lazy panel behavior. They do
not establish that the deployed backend supports omission yet.

# Purchase order costs API specification

The frontend sends these fields on both `POST /purchase-orders` and `PUT /purchase-orders/{id}`. They extend the existing purchase order payload; `entries`, supplier, location, delivery date, and status keep their current shape.

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `discount` | decimal amount | no, default `0` | Supplier discount on items, before charges and tax. |
| `shippingFee` | decimal amount | no, default `0` | Shipping payable to the supplier. Existing field. |
| `tax` | decimal amount | no, default `0` | Purchase tax amount payable to the supplier. Existing field. |
| `taxInclusive` | boolean | no, default `false` | If true, `tax` is already included in item prices and must not be added to the payable total. |
| `additionalCharges` | array | no, default `[]` | Extra PO charges. A `PUT` replaces the full array. |

Each `additionalCharges` object has:

| Field | Type | Required | Meaning |
| --- | --- | --- | --- |
| `id` | ID | only for an existing charge on update | Stable ID returned by the backend. Omit for a new charge. |
| `type` | enum | yes | `HANDLING`, `CUSTOMS_DUTY`, `INSURANCE`, or `OTHER`. |
| `description` | string, max 100 | required for `OTHER` | Human-readable label. Empty string for other types. |
| `amount` | decimal amount greater than zero | yes | Fixed charge amount. |
| `payee` | enum | yes | `SUPPLIER` or `THIRD_PARTY`. |
| `includeInInventoryCost` | boolean | yes | Mark charge for landed cost allocation to received items. Allocation logic belongs on the backend. |

Example request extension:

```json
{
  "discount": 10,
  "shippingFee": 5,
  "tax": 9,
  "taxInclusive": false,
  "additionalCharges": [
    {
      "type": "HANDLING",
      "description": "",
      "amount": 3,
      "payee": "SUPPLIER",
      "includeInInventoryCost": true
    },
    {
      "type": "INSURANCE",
      "description": "",
      "amount": 7,
      "payee": "THIRD_PARTY",
      "includeInInventoryCost": true
    }
  ]
}
```

The backend should validate numeric values and compute authoritative totals with decimal arithmetic:

```text
itemsSubtotal = sum(entry.quantity * entry.cost)
supplierCharges = sum(additionalCharges.amount where payee = SUPPLIER)
thirdPartyCharges = sum(additionalCharges.amount where payee = THIRD_PARTY)
taxAdded = taxInclusive ? 0 : tax
supplierPayable = itemsSubtotal - discount + shippingFee + supplierCharges + taxAdded
estimatedTotalCost = supplierPayable + thirdPartyCharges
```

`discount` cannot exceed `itemsSubtotal`. All amounts must be non-negative and have at most two decimal places; charge amounts must be positive. Return the saved `taxInclusive`, `additionalCharges` (including each stable `id`), `supplierPayable`, and `estimatedTotalCost` from `GET /purchase-orders/{id}`. The list endpoint should return totals consistently. If existing `totalAmount` means the supplier amount due, set it to `supplierPayable`; confirm that meaning before changing its backend calculation.

For inventory valuation, allocate only charges marked `includeInInventoryCost`, using a backend-defined allocation method and receipt timing. Tax recoverability and whether tax belongs in inventory cost require an accounting rule. The frontend preview is an estimate; server totals are authoritative.

Existing orders without the new fields should read as `taxInclusive: false` and `additionalCharges: []`. The frontend already applies these defaults. Backend support for these new fields is required before deploying this frontend change.

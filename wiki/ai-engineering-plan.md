# AI Engineering Plan

## Purpose

This document is the working plan for turning the current AI prototypes in the POS project into production-ready ERP features.

The immediate focus is inventory and item workflows:

- AI product/item creation from image or description.
- AI stock-in import from purchase orders, invoices, receipts, CSV, or Excel files.
- AI purchase-order and reorder suggestions.
- Credit-based access, usage tracking, and upgrade gating for paid AI features.

## Current Project Context

The project is a React POS application inside the ERP-Hub Inc / storeVein ecosystem.

Relevant existing files:

- `src/layout/item-ai-tool.jsx`: prototype for copying a product-image prompt to an external AI tool.
- `src/layout/item-management-ai.jsx`: prototype UI for stock-in, AI smart import, and AI-generated products.
- `src/pages/Inventory/StockIO/form/form.ai-import.jsx`: prototype stock-in AI import flow.
- `src/services/ItemService.js`: item service pattern for API-backed item operations.
- `src/services/PurchaseOrderService.js`: purchase order service pattern.
- `wiki/pricing-plan.md`: credit-based AI pricing notes.
- `wiki/AI-Powered ERP with Supplier Network & Credit-Based Features.md`: product model for AI, supplier network, and credits.

Current AI code is mostly mock/prototype code. The production plan should replace simulated extraction and generation with backend AI APIs, deterministic validation, audit logs, and user review before writing business data.

## AI Engineering Principles

- Keep AI behind backend services. Do not call model providers directly from the browser.
- Treat AI output as untrusted input. Validate, normalize, and require user review before saving.
- Use structured outputs. Every AI feature must define a JSON schema and a versioned prompt.
- Preserve source evidence. Store uploaded document metadata, extracted raw text when allowed, and confidence by field.
- Make every AI action auditable. Track user, company, feature, model, prompt version, input hash, output hash, credit cost, status, and errors.
- Design for fallback. Users must be able to manually correct extracted or generated data.
- Keep costs visible. Estimate credit usage before running paid AI actions.
- Protect sensitive data. Send only the data required for the task and avoid exposing cross-company supplier/customer data.

## Target Architecture

```text
React UI
  -> AI feature service in frontend
  -> ERP backend AI gateway
  -> model provider or OCR provider
  -> validation and matching service
  -> preview result
  -> user approval
  -> ERP write APIs
  -> audit log and credit ledger
```

Recommended backend responsibilities:

- Authenticate and authorize the user.
- Check subscription plan and credit balance.
- Accept files using secure upload limits.
- Run OCR or document parsing when needed.
- Call the selected AI model with a versioned prompt.
- Validate response against a schema.
- Match extracted items to ERP items by barcode, SKU, supplier item code, and fuzzy name.
- Return a preview with confidence, warnings, and unmatched rows.
- Deduct or refund credits based on final run status.
- Store audit records.

Recommended frontend responsibilities:

- Upload files and show progress.
- Display extracted/generated data in an editable preview table.
- Highlight low-confidence fields and unmatched items.
- Let users approve, correct, skip, or create missing items.
- Submit only approved data to existing ERP save flows.

## Feature Roadmap

### Phase 1: Productionize AI Stock-In Import

Goal: let a user upload a supplier document and convert it into stock-in quantities.

Scope:

- Upload PDF, image, CSV, or Excel file.
- Extract document number, supplier, date, item rows, barcode/SKU, quantity, unit, cost, and notes.
- Match rows to existing inventory items.
- Show a review table before applying quantities.
- Apply approved rows to the stock-in workflow.

Acceptance criteria:

- AI never updates stock directly without user confirmation.
- Unmatched rows are clearly separated from matched rows.
- Low-confidence values are editable before apply.
- Credit check happens before processing.
- Failed runs do not charge credits, or credits are refunded automatically.

### Phase 2: AI Product Creation

Goal: create draft item data from a product image, barcode, supplier text, or short description.

Scope:

- Generate item name, description, category suggestion, SKU, barcode, unit, cost, selling price, reorder level, and attributes.
- Use existing category, unit, brand, and vendor data as grounding context.
- Return draft items only; user must approve before creation.

Acceptance criteria:

- Generated SKU/barcode values are checked for duplicates.
- Category/unit suggestions map to existing records or are marked as new suggestions.
- Required item fields are validated before save.
- User can edit every AI-generated field.

### Phase 3: AI Purchase Order Suggestions

Goal: suggest reorder quantities based on stock, sales history, vendor, lead time, and reorder levels.

Scope:

- Analyze recent sales and stock-on-hand.
- Recommend reorder quantity by item and location.
- Explain each recommendation using business signals.
- Convert approved recommendations into a purchase order draft.

Acceptance criteria:

- Recommendations show reason codes, not only quantities.
- User can override quantities before creating a purchase order.
- The system stores model output and final user-approved values separately.

### Phase 4: AI Supplier Network Enhancements

Goal: support supplier product sync, matching, translation, and pricing suggestions.

Scope:

- Match supplier catalog items to internal products.
- Suggest category mapping and translations.
- Flag suspicious price or quantity changes.
- Support approval workflow between buyer and supplier.

Acceptance criteria:

- Cross-company data access is permission checked.
- Supplier-sourced data is labeled and auditable.
- Auto-sync changes require configurable approval rules.

## Data Contracts

### Stock-In Extraction Response

```json
{
  "promptVersion": "stock-in-import.v1",
  "document": {
    "type": "purchase_order",
    "number": "PO-2026-0001",
    "date": "2026-06-11",
    "supplierName": "Supplier Name"
  },
  "items": [
    {
      "sourceLine": 1,
      "description": "Product name from document",
      "barcode": "8885015022115",
      "sku": "",
      "quantity": 10,
      "unit": "pcs",
      "cost": 1.25,
      "currency": "USD",
      "confidence": 0.92,
      "match": {
        "status": "matched",
        "itemId": "123",
        "matchBy": "barcode"
      },
      "warnings": []
    }
  ]
}
```

### Product Draft Response

```json
{
  "promptVersion": "product-draft.v1",
  "items": [
    {
      "name": "Product name",
      "description": "Product description",
      "sku": "SUGGESTED-SKU",
      "barcode": "",
      "categoryName": "Suggested category",
      "unit": "pcs",
      "cost": null,
      "sellingPrice": null,
      "reorderLevel": 10,
      "attributes": {
        "brand": "",
        "size": "",
        "color": ""
      },
      "confidence": 0.85,
      "warnings": []
    }
  ]
}
```

## Prompt Management

Store prompts outside components and treat them like source code.

Recommended structure:

```text
src/ai/
  prompts/
    stock-in-import.v1.md
    product-draft.v1.md
    purchase-order-suggestion.v1.md
  schemas/
    stock-in-import.schema.json
    product-draft.schema.json
    purchase-order-suggestion.schema.json
  fixtures/
    stock-in-import.sample.json
```

Prompt requirements:

- Include the task, allowed inputs, required output schema, and strict rules.
- Tell the model to return JSON only.
- Tell the model to use empty strings or nulls when data is missing.
- Tell the model not to invent barcodes, prices, or supplier facts.
- Include locale expectations for Khmer and English item names.
- Version every prompt and log the prompt version for each run.

## Validation Rules

Validate both model output and final user-approved data.

Minimum validation:

- JSON parses successfully.
- Required fields exist.
- Quantities are positive numbers.
- Dates use ISO format where possible.
- Currency uses standard codes.
- Barcode and SKU uniqueness are checked.
- Matched item IDs exist and belong to the current company.
- Low-confidence fields are flagged for review.
- Unmatched rows cannot be silently applied to stock.

## Credit And Billing Rules

AI features should use the credit system described in `wiki/pricing-plan.md`.

Recommended flow:

1. Preview estimated credit cost before running.
2. Reserve credits before processing.
3. Run AI extraction or generation.
4. Commit credit deduction only after a successful result.
5. Refund or release reserved credits on provider failure, validation failure, or timeout.
6. Write one credit ledger entry per AI run.

Suggested event fields:

- `companyId`
- `userId`
- `featureCode`
- `promptVersion`
- `provider`
- `model`
- `inputTokenCount`
- `outputTokenCount`
- `creditCost`
- `status`
- `errorCode`
- `createdAt`

## Security And Privacy

- Never store provider API keys in frontend code.
- Enforce file size and file type limits.
- Redact sensitive fields that are not required for the AI task.
- Use company-scoped authorization for item, supplier, and purchase data.
- Store only necessary AI input/output data.
- Log enough metadata for support and billing without exposing unnecessary document content.

## Observability

Track these metrics:

- AI runs by feature, company, user, model, and status.
- Average latency and timeout rate.
- Validation failure rate.
- Match rate for imported item rows.
- User correction rate by field.
- Credit usage and refund rate.
- Provider cost per feature.

These metrics should guide prompt revisions, pricing, and UX improvements.

## Testing Plan

Unit tests:

- Schema validation.
- Item matching rules.
- Credit reservation and refund rules.
- CSV/Excel parsing helpers.

Integration tests:

- Upload document, receive preview, approve rows, apply stock-in.
- AI product draft, edit fields, create item.
- Provider failure and credit refund.

Manual QA:

- Khmer product names.
- Documents with missing barcodes.
- Duplicate items.
- Low-quality images.
- Large files.
- Users without Pro/credit access.

## Documentation Standards For AI Features

Each AI feature should have a short markdown file or section with the same shape:

```text
# Feature Name

## Goal
One paragraph explaining the business outcome.

## Users
Who uses it and what permission or plan they need.

## Inputs
Files, text, images, ERP records, and limits.

## Output
The exact data returned or created.

## Flow
Step-by-step user and system flow.

## Validation
Rules before preview and before save.

## Credit Rules
Estimated cost, charge timing, refund conditions.

## Failure States
Provider error, invalid result, no match, insufficient credits, timeout.

## Metrics
What should be logged and reviewed.

## Acceptance Criteria
Concrete conditions that prove the feature is ready.
```

Writing rules:

- Prefer concrete behavior over broad descriptions.
- Link to source files and related docs.
- Mark assumptions clearly.
- Keep schema examples small but valid.
- Update the document when the prompt version, API contract, or credit behavior changes.

## Immediate Next Steps

1. Choose the first production feature: AI Stock-In Import is the best candidate because the UI prototype already exists.
2. Extract AI UI from prototype screens into reusable components.
3. Create backend endpoints for upload, extraction preview, apply, and audit.
4. Add prompt and schema files for `stock-in-import.v1`.
5. Replace mock extraction in `form.ai-import.jsx` with a service call.
6. Add validation and editable review states for low-confidence and unmatched rows.
7. Connect credit balance, Pro access, and credit ledger behavior.
8. Add tests for validation, matching, and credit handling.

## Open Questions

- Which backend service owns the AI gateway?
- Which model provider should be used first?
- Should OCR be handled by the model provider or a dedicated OCR service?
- What are the exact Pro plan and credit balance APIs?
- Should uploaded source documents be retained, and for how long?
- Which fields are required to create a valid item in the current backend?

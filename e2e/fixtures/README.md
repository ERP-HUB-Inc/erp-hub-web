# Test data

Keep only synthetic, non-secret inputs here. Supply credentials through the
runner environment, never fixtures.

Future builders should create a unique run identifier and record the IDs of all
items, variants, suppliers, purchase orders, stock movements, shifts, and sales
created by that run. Generate SKU and barcode values within the actual field
constraints, with a unique suffix for each retry and worker.

Use a dedicated test tenant, location, cash register, and role accounts. Record
starting quantities so inventory assertions compare a known baseline with the
persisted result. Never depend on yesterday's test records or names shared by
parallel runs.

Cleanup must use the product's supported cancellation, reversal, or archive
operations and affect only run-owned records. Keep transaction history where
required. Backend seed/reset helpers are planned; no cleanup API is assumed or
implemented in this scaffold.

// stockInSchema.js

export const stockInSchema = {
  type: "IN", // Stock movement type: IN / OUT
  number: "", // Auto-generated stock IO number (e.g., ST-IN-20251002-002)
  name: "Stock In from Supplier",
  locationId: "", // Reference to location
  userId: "", // Creator / operator ID
  receiverId: "", // Receiver of stock
  vendorId: "", // Vendor / supplier ID
  date: new Date().toISOString(), // Default to current datetime
  description: "", // Description or remark
  quantity: 0, // Total quantity
  amount: 0, // Total amount
  status: "draft", // Could be: draft, approved, completed, canceled
  entries: [
    {
      itemId: "", // Product ID
      itemName: "", // Product name
      variantId: "", // Variant ID (if any)
      variantName: "", // Variant name
      quantity: 0, // Quantity of this item
      cost: 0, // Cost per unit
      unitId: "", // Unit reference (e.g., pcs, box)
      unitName: "" // Display name for the unit
    }
  ]
};

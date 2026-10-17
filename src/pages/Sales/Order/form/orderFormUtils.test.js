import { calculateOrderPreview } from "./orderFormUtils";

test("counts lines and units separately and rounds discounted tax per line", () => {
  const preview = calculateOrderPreview([
    { quantity: 2, price: 8, discount: 0, tax: 0 },
    { quantity: 1, price: 5, discount: 0.5, discountType: "USD", tax: 10 }
  ], 1, 1.5);

  expect(preview).toEqual({ units: 3, subtotal: 20.5, discount: 1, taxTotal: 0.45, payable: 21.45 });
});

test("keeps the final payable pending when the provider has no known fee", () => {
  expect(calculateOrderPreview([{ quantity: 1, price: 2.5, discount: 0, tax: 0 }], 0, null).payable).toBeNull();
});

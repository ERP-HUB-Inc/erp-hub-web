import { getItemProductOption, normalizeProductOption } from "./product-option";

test.each([[0, 0], [1, 1], ["1", 1], ["2", 2], [undefined, 0], [null, 0], ["invalid", 0]])(
  "normalizes option %p to %p", (value, expected) => {
    expect(normalizeProductOption(value)).toBe(expected);
  }
);

test.each([[1, 0, 1], ["1", "0", 1], [1, undefined, 1], [1, 1, 1], [0, "1", 1], [0, 0, 0], [1, 2, 2], [2, undefined, 2]])(
  "saved option %p and form option %p resolve to %p", (saved, current, expected) => {
    expect(getItemProductOption(saved, current)).toBe(expected);
  }
);

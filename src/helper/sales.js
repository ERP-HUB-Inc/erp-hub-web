export const formatCurrency = (props = { amount, currency: "$", position: 0, precision: 2 }) => {
  let { amount, currency, position, precision } = props;

  let unsigne = "";

  if (amount < 0) {
    amount = Math.abs(amount);
    unsigne = "-";
  }

  // ✅ KHR rounding to nearest 100
  if (currency === "៛") {
    amount = Math.round(amount / 100) * 100;
  } else if (currency === "$") {
    precision = 2; // Force 2 decimal places for USD
  }

  // ✅ Safer integer check
  const hasFraction = !Number.isInteger(amount);
  // Always respect precision for USD
  let fixed = currency === "$" ? amount.toFixed(precision) : hasFraction ? amount.toFixed(precision) : amount.toFixed(0);

  // Add commas
  let result = fixed.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // Position currency
  if (position === 0) {
    result = `${currency}${result}`;
  } else {
    result = `${result}${currency}`;
  }

  return `${unsigne}${result}`;
};

export const toSubCurrencyGrantTotal = (amount, subCurrency, baseCurrency) => {
  if (!subCurrency || !baseCurrency) return 0;

  const exchangeRate = subCurrency.exchangeRate / baseCurrency.exchangeRate;
  return amount * exchangeRate;
};

export const convertKHRToUSD = (amountKHR = 0, exchangeRate) => {
  if (!exchangeRate || exchangeRate <= 0) {
    return 0; // safe fallback
  }

  return amountKHR / exchangeRate;
};

export const convertUSDToKHR = (amountUSD = 0, exchangeRate) => {
  if (!exchangeRate || exchangeRate <= 0) {
    return 0; // safe fallback
  }

  return amountUSD * exchangeRate;
};

export const generateQuickCashSuggestions = (total) => {
  // Normalize to 100 KHR minimum unit
  const normalize100 = (amount) => Math.ceil(amount / 100) * 100;
  const roundUp1000 = (amount) => Math.ceil(amount / 1000) * 1000;

  const normalizedTotal = normalize100(total);
  const nextStep = roundUp1000(normalizedTotal);

  // If total is already exactly a 1000 multiple, next step should still be +1000
  const finalNextStep = nextStep === normalizedTotal ? normalizedTotal + 1000 : nextStep;

  return [normalizedTotal, finalNextStep];
};

export const generateQuickCashSuggestionsUSD = (total) => {
  const normalizeCent = (amount) => Math.ceil(amount * 100) / 100;

  const roundUp = (amount, base) => Math.ceil(amount / base) * base;

  const normalizedTotal = normalizeCent(total);

  const nextDollar = roundUp(normalizedTotal, 1);

  let bigNote;
  if (normalizedTotal < 20) {
    bigNote = roundUp(normalizedTotal, 5);
  } else {
    bigNote = roundUp(normalizedTotal, 10);
  }

  const suggestions = Array.from(new Set([normalizedTotal, nextDollar, bigNote]));

  return suggestions.sort((a, b) => a - b);
};

export const generateQuickCashDynamicV2 = (total) => {
  const suggestions = new Set();
  suggestions.add(total);

  const remainder = total % 1000;
  let next;

  if (remainder <= 200) {
    next = Math.ceil(total / 500) * 500;
  } else if (remainder <= 700) {
    next = Math.ceil(total / 1000) * 1000;
  } else {
    next = Math.ceil(total / 1000) * 1000;
    suggestions.add(next + 500);
  }

  suggestions.add(next);

  // Always suggest one larger clean note
  const bigNote = Math.ceil(total / 5000) * 5000;
  suggestions.add(bigNote);

  return Array.from(suggestions).sort((a, b) => a - b);
};

export const toSubCurrencyGrantTotal = (amount, subCurrency, baseCurrency) => {
  if (!subCurrency || !baseCurrency) return 0;

  const exchangeRate = subCurrency.exchangeRate / baseCurrency.exchangeRate;
  return amount * exchangeRate;
};

export const convertKHRToUSD = (amountKHR = 0, subCurrency) => {
  const rate = subCurrency?.value;

  if (!rate || rate <= 0) {
    return 0; // safe fallback
  }

  return amountKHR / rate;
};

export const convertUSDToKHR = (amountUSD = 0, subCurrency) => {
  const rate = subCurrency?.value;

  if (!rate || rate <= 0) {
    return 0; // safe fallback
  }

  return amountUSD * rate;
};

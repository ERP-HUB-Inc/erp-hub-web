export const PRODUCT_OPTIONS = [[0, 'Standard'], [1, 'Variant'], [2, 'Composite']];
export const isEnabled = value => value === true || value === 1;

export function errorMessage(error, fallback) {
  const body = error && error.response && error.response.data;
  const value = body && body.error && body.error.message || body && body.message || error && error.message;
  if (typeof value === 'string' && value) return value;
  if (value && typeof value === 'object') {
    const messages = Object.values(value).filter(item => typeof item === 'string');
    if (messages.length) return messages.join(' ');
  }
  return fallback;
}

export function itemTypePayload(values) {
  return {
    name: values.name.trim(), description: (values.description || '').trim(),
    enableInventoryTracking: values.enableInventoryTracking === true,
    isSellable: values.isSellable === true,
    productOption: values.productOption,
    sortOrder: values.sortOrder, status: values.status
  };
}

export function savedItem(response) {
  const item = response && response.data && response.data.data;
  if (!item || typeof item.id !== 'string' || !item.id) {
    throw new Error('The item type was not returned. Refresh the list to check whether your changes were saved.');
  }
  return item;
}

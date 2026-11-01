export const TARGET_TYPES = { MONTHLY: 'Monthly', QUARTERLY: 'Quarterly', YEARLY: 'Yearly' };
export const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function isTargetId(value) {
  if (typeof value === 'number') return Number.isSafeInteger(value) && value > 0;
  if (typeof value === 'string' && /^[1-9]\d*$/.test(value)) return Number.isSafeInteger(Number(value));
  return false;
}

export function targetPayload(values) {
  return {
    locationId: values.locationId, targetType: values.targetType, year: values.year,
    month: values.targetType === 'MONTHLY' ? values.month : null,
    quarter: values.targetType === 'MONTHLY' ? Math.ceil(values.month / 3) : values.targetType === 'QUARTERLY' ? values.quarter : null,
    targetRevenue: values.targetRevenue, status: values.status
  };
}

export function targetEntity(response) {
  const record = response && response.data && response.data.data;
  if (!record || !isTargetId(record.id)) throw new Error('The sales target response could not be read. Refresh before trying again.');
  return record;
}

export function errorText(error, fallback) {
  const body = error && error.response && error.response.data;
  const text = body && body.error && body.error.message || body && body.message || error && error.message;
  return typeof text === 'string' ? text : fallback;
}

export function periodLabel(record) {
  if (record.targetType === 'MONTHLY') return `${MONTHS[record.month - 1] || 'Unknown month'} ${record.year}`;
  if (record.targetType === 'QUARTERLY') return `Q${record.quarter} ${record.year}`;
  return String(record.year);
}

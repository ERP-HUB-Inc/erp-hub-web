export function categoryEntity(response) {
  const body = response && response.data;
  const record = body && body.data && !Array.isArray(body.data) ? body.data : body;
  if (!record || typeof record.id !== 'string' || typeof record.name !== 'string') throw new Error('The expense category response could not be read.');
  return record;
}

export function errorText(error, fallback) {
  const body = error && error.response && error.response.data;
  const text = body && body.error && body.error.message || body && body.message || error && error.message;
  return typeof text === 'string' ? text : fallback;
}

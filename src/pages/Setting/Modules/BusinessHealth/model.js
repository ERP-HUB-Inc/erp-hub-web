export function validThresholds(healthy, critical) {
  return typeof healthy === 'number' && Number.isFinite(healthy) && healthy >= 100 &&
    typeof critical === 'number' && Number.isFinite(critical) && critical >= 0 && critical < healthy;
}

export function readPolicy(response, allowEmpty = true) {
  const policy = response && response.data && response.data.data;
  if (policy === null && allowEmpty) return null;
  if (!policy || typeof policy.version !== 'string' || !policy.version.trim() || typeof policy.enabled !== 'boolean' ||
    !validThresholds(policy.healthyCoveragePercent, policy.criticalBelowCoveragePercent)) throw new Error('The business health policy response could not be read. Reload before making changes.');
  return policy;
}

export function policyError(error, fallback) {
  const body = error && error.response && error.response.data;
  const text = body && body.error && body.error.message || body && body.message || error && error.message;
  return typeof text === 'string' ? text : fallback;
}

export function isPolicyConflict(error) {
  const body = error && error.response && error.response.data;
  const code = body && body.error && body.error.code || body && body.code;
  return error && error.response && error.response.status === 409 &&
    (code === 'POLICY_VERSION_CONFLICT' || code === 'POLICY_ALREADY_EXISTS');
}

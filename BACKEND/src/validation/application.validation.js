/**
 * Shared helper for controller-style validation errors.
 */
function nextValidationError(next, message) {
  const error = new Error(message);
  error.status = 400;
  next(error);
}

function isPlainObject(value) {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function validateOptionalString(value, fieldName, next) {
  if (value !== undefined && (typeof value !== 'string' || !value.trim())) {
    return nextValidationError(next, `${fieldName} must be a non-empty string when provided`);
  }

  return null;
}

/**
 * Validates the body for application creation.
 */
function validateCreateApplication(req, res, next) {
  const { userId, formId, schemaVersion, status, responses, progress, documents, statusHistory } =
    req.body || {};

  if (!userId || typeof userId !== 'string' || !userId.trim()) {
    return nextValidationError(next, 'A userId is required');
  }

  if (!formId || typeof formId !== 'string' || !formId.trim()) {
    return nextValidationError(next, 'A formId is required');
  }

  if (!Number.isInteger(schemaVersion) || schemaVersion < 1) {
    return nextValidationError(next, 'schemaVersion must be an integer greater than or equal to 1');
  }

  if (validateOptionalString(status, 'status', next)) {
    return;
  }

  if (responses !== undefined && !isPlainObject(responses)) {
    return nextValidationError(next, 'responses must be an object when provided');
  }

  if (progress !== undefined && (typeof progress !== 'number' || progress < 0 || progress > 100)) {
    return nextValidationError(next, 'progress must be a number between 0 and 100 when provided');
  }

  if (documents !== undefined && !Array.isArray(documents)) {
    return nextValidationError(next, 'documents must be an array when provided');
  }

  if (statusHistory !== undefined && !Array.isArray(statusHistory)) {
    return nextValidationError(next, 'statusHistory must be an array when provided');
  }

  return next();
}

/**
 * Validates the body for application updates.
 */
function validateUpdateApplication(req, res, next) {
  const { userId, formId, schemaVersion, status, responses, progress, documents, statusHistory } =
    req.body || {};

  if (req.body === undefined || !isPlainObject(req.body) || Object.keys(req.body).length === 0) {
    return nextValidationError(next, 'A request body is required for application updates');
  }

  if (validateOptionalString(userId, 'userId', next)) {
    return;
  }

  if (validateOptionalString(formId, 'formId', next)) {
    return;
  }

  if (
    schemaVersion !== undefined &&
    (!Number.isInteger(schemaVersion) || schemaVersion < 1)
  ) {
    return nextValidationError(next, 'schemaVersion must be an integer greater than or equal to 1');
  }

  if (validateOptionalString(status, 'status', next)) {
    return;
  }

  if (responses !== undefined && !isPlainObject(responses)) {
    return nextValidationError(next, 'responses must be an object when provided');
  }

  if (progress !== undefined && (typeof progress !== 'number' || progress < 0 || progress > 100)) {
    return nextValidationError(next, 'progress must be a number between 0 and 100 when provided');
  }

  if (documents !== undefined && !Array.isArray(documents)) {
    return nextValidationError(next, 'documents must be an array when provided');
  }

  if (statusHistory !== undefined && !Array.isArray(statusHistory)) {
    return nextValidationError(next, 'statusHistory must be an array when provided');
  }

  return next();
}

/**
 * Validates the applicationId route parameter.
 */
function validateApplicationIdParam(req, res, next) {
  const { applicationId } = req.params;

  if (!applicationId || typeof applicationId !== 'string' || !applicationId.trim()) {
    return nextValidationError(next, 'An applicationId is required');
  }

  return next();
}

module.exports = {
  validateCreateApplication,
  validateUpdateApplication,
  validateApplicationIdParam,
};

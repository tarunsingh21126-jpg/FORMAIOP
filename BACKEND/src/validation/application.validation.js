/**
 * Shared helper for controller-style validation errors.
 */
function nextValidationError(next, message) {
  const error = new Error(message);
  error.status = 400;
  next(error);
}

/**
 * Validates the body for application creation.
 */
function validateCreateApplication(req, res, next) {
  const { formId, applicantId, referenceNumber, notes, metadata } = req.body || {};

  if (!formId || typeof formId !== 'string' || !formId.trim()) {
    return nextValidationError(next, 'A formId is required');
  }

  if (!applicantId || typeof applicantId !== 'string' || !applicantId.trim()) {
    return nextValidationError(next, 'An applicantId is required');
  }

  if (referenceNumber !== undefined && typeof referenceNumber !== 'string') {
    return nextValidationError(next, 'referenceNumber must be a string when provided');
  }

  if (notes !== undefined && typeof notes !== 'string') {
    return nextValidationError(next, 'notes must be a string when provided');
  }

  if (
    metadata !== undefined &&
    (metadata === null || Array.isArray(metadata) || typeof metadata !== 'object')
  ) {
    return nextValidationError(next, 'metadata must be an object when provided');
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

/**
 * Validates the supported application listing filters.
 */
function validateApplicationListQuery(req, res, next) {
  const { applicantId, formId } = req.query;

  if (applicantId !== undefined && (typeof applicantId !== 'string' || !applicantId.trim())) {
    return nextValidationError(next, 'applicantId must be a non-empty string when provided');
  }

  if (formId !== undefined && (typeof formId !== 'string' || !formId.trim())) {
    return nextValidationError(next, 'formId must be a non-empty string when provided');
  }

  return next();
}

module.exports = {
  validateCreateApplication,
  validateApplicationIdParam,
  validateApplicationListQuery,
};

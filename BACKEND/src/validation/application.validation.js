/**
 * Creates and forwards a validation error.
 */
function nextValidationError(next, message) {
  const error = new Error(message);
  error.status = 400;
  return next(error);
}

/**
 * Checks whether a value is a non-empty string.
 */
function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Checks whether a value is a valid metadata object.
 */
function isValidMetadata(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value)
  );
}

/**
 * Validates the body for application creation.
 */
function validateCreateApplication(req, res, next) {
  const {
    formId,
    applicantId,
    referenceNumber,
    notes,
    metadata,
  } = req.body || {};

  if (!isNonEmptyString(formId)) {
    return nextValidationError(next, 'A formId is required');
  }

  if (!isNonEmptyString(applicantId)) {
    return nextValidationError(next, 'An applicantId is required');
  }

  if (
    referenceNumber !== undefined &&
    typeof referenceNumber !== 'string'
  ) {
    return nextValidationError(
      next,
      'referenceNumber must be a string when provided'
    );
  }

  if (notes !== undefined && typeof notes !== 'string') {
    return nextValidationError(
      next,
      'notes must be a string when provided'
    );
  }

  if (metadata !== undefined && !isValidMetadata(metadata)) {
    return nextValidationError(
      next,
      'metadata must be an object when provided'
    );
  }

  return next();
}

/**
 * Validates the applicationId route parameter.
 */
function validateApplicationIdParam(req, res, next) {
  const { applicationId } = req.params;

  if (!isNonEmptyString(applicationId)) {
    return nextValidationError(next, 'An applicationId is required');
  }

  return next();
}

/**
 * Validates supported application listing filters.
 */
function validateApplicationListQuery(req, res, next) {
  const { applicantId, formId } = req.query;

  if (
    applicantId !== undefined &&
    !isNonEmptyString(applicantId)
  ) {
    return nextValidationError(
      next,
      'applicantId must be a non-empty string when provided'
    );
  }

  if (
    formId !== undefined &&
    !isNonEmptyString(formId)
  ) {
    return nextValidationError(
      next,
      'formId must be a non-empty string when provided'
    );
  }

  return next();
}

module.exports = {
  validateCreateApplication,
  validateApplicationIdParam,
  validateApplicationListQuery,
};

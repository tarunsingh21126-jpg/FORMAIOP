const mongoose = require('mongoose');

function nextValidationError(next, message) {
  const error = new Error(message);
  error.status = 400;
  return next(error);
}

function isPlainObject(value) {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function isValidProgress(value) {
  if (typeof value === 'number') {
    return value >= 0 && value <= 100;
  }

  if (!isPlainObject(value)) {
    return false;
  }

  const { completionPercentage, completedSections, currentSection, totalSections } = value;

  return (
    (completionPercentage === undefined ||
      (typeof completionPercentage === 'number' && completionPercentage >= 0 && completionPercentage <= 100)) &&
    (completedSections === undefined ||
      (Array.isArray(completedSections) && completedSections.every((section) => typeof section === 'string'))) &&
    (currentSection === undefined || typeof currentSection === 'string') &&
    (totalSections === undefined || (Number.isInteger(totalSections) && totalSections >= 0))
  );
}

function validateOptionalString(value, fieldName, next) {
  if (value !== undefined && (typeof value !== 'string' || !value.trim())) {
    return nextValidationError(next, `${fieldName} must be a non-empty string when provided`);
  }

  return null;
}

function validateCreateApplication(req, res, next) {
  const { userId, formId, form, schemaVersion, status, responses, progress, documents, statusHistory, submission } = req.body || {};

  if (!userId || !mongoose.isObjectIdOrHexString(userId)) {
    return nextValidationError(next, 'A valid userId is required');
  }

  if (!formId || typeof formId !== 'string' || !formId.trim()) {
    return nextValidationError(next, 'A formId is required');
  }

  if (form !== undefined && !mongoose.isObjectIdOrHexString(form)) {
    return nextValidationError(next, 'form must be a valid identifier when provided');
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

  if (progress !== undefined && !isValidProgress(progress)) {
    return nextValidationError(next, 'progress must contain valid completion details when provided');
  }

  if (documents !== undefined && !Array.isArray(documents)) {
    return nextValidationError(next, 'documents must be an array when provided');
  }

  if (statusHistory !== undefined && !Array.isArray(statusHistory)) {
    return nextValidationError(next, 'statusHistory must be an array when provided');
  }

  if (submission !== undefined && !isPlainObject(submission)) {
    return nextValidationError(next, 'submission must be an object when provided');
  }

  return next();
}

function validateUpdateApplication(req, res, next) {
  const { userId, formId, form, schemaVersion, status, responses, progress, documents, statusHistory, submission } = req.body || {};

  if (!isPlainObject(req.body) || Object.keys(req.body).length === 0) {
    return nextValidationError(next, 'A request body is required for application updates');
  }

  if (userId !== undefined && !mongoose.isObjectIdOrHexString(userId)) {
    return nextValidationError(next, 'userId must be a valid identifier when provided');
  }

  if (form !== undefined && !mongoose.isObjectIdOrHexString(form)) {
    return nextValidationError(next, 'form must be a valid identifier when provided');
  }

  if (validateOptionalString(formId, 'formId', next)) {
    return;
  }

  if (schemaVersion !== undefined && (!Number.isInteger(schemaVersion) || schemaVersion < 1)) {
    return nextValidationError(next, 'schemaVersion must be an integer greater than or equal to 1');
  }

  if (validateOptionalString(status, 'status', next)) {
    return;
  }

  if (responses !== undefined && !isPlainObject(responses)) {
    return nextValidationError(next, 'responses must be an object when provided');
  }

  if (progress !== undefined && !isValidProgress(progress)) {
    return nextValidationError(next, 'progress must contain valid completion details when provided');
  }

  if (documents !== undefined && !Array.isArray(documents)) {
    return nextValidationError(next, 'documents must be an array when provided');
  }

  if (statusHistory !== undefined && !Array.isArray(statusHistory)) {
    return nextValidationError(next, 'statusHistory must be an array when provided');
  }

  if (submission !== undefined && !isPlainObject(submission)) {
    return nextValidationError(next, 'submission must be an object when provided');
  }

  return next();
}

function validateApplicationIdParam(req, res, next) {
  const { applicationId } = req.params;
  if (!applicationId || !mongoose.isObjectIdOrHexString(applicationId)) {
    return nextValidationError(next, 'A valid applicationId is required');
  }
  return next();
}

module.exports = {
  validateCreateApplication,
  validateUpdateApplication,
  validateApplicationIdParam,
};

const mongoose = require('mongoose');
const { APPLICATION_STATUSES } = require('../constants/application.constants');

function nextValidationError(next, message) {
  const error = new Error(message);
  error.status = 400;
  return next(error);
}

function isPlainObject(value) {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

function resolveActorId(req) {
  const fromRequest = req?.user || req?.actor || req?.context?.user || req?.context?.actor;
  if (!fromRequest) return null;

  if (typeof fromRequest === 'string') return fromRequest;
  if (typeof fromRequest === 'object') {
    return fromRequest._id || fromRequest.id || fromRequest.userId || null;
  }

  return null;
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
  const body = req.body || {};
  const { formId, form, schemaVersion, responses, progress, documents, status, statusHistory, submission, submittedAt } = body;
  const actorId = resolveActorId(req);
  const protectedFields = [
    'owner',
    'status',
    'statusHistory',
    'submission',
    'submittedAt',
    'submittedBy',
    'submissionReference',
    '_id',
    'id',
    'createdAt',
    'updatedAt',
  ];

  for (const field of protectedFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      return nextValidationError(next, `The "${field}" field is protected and cannot be set by clients`);
    }
  }

  if (actorId) {
    if (body.userId && body.userId !== actorId) {
      return nextValidationError(next, 'The authenticated actor is the application owner');
    }
    body.userId = actorId;
  } else {
    const suppliedUserId = body.userId;
    if (!suppliedUserId || !mongoose.isObjectIdOrHexString(suppliedUserId)) {
      return nextValidationError(next, 'A valid userId is required');
    }
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

  if (status !== undefined) {
    return nextValidationError(next, 'The "status" field is protected and cannot be set by clients');
  }

  if (statusHistory !== undefined) {
    return nextValidationError(next, 'The "statusHistory" field is protected and cannot be set by clients');
  }

  if (submission !== undefined) {
    return nextValidationError(next, 'The "submission" field is protected and cannot be set by clients');
  }

  if (submittedAt !== undefined) {
    return nextValidationError(next, 'The "submittedAt" field is protected and cannot be set by clients');
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

  return next();
}

function validateUpdateApplication(req, res, next) {
  const body = req.body || {};
  const protectedFields = [
    'userId',
    'formId',
    'form',
    'schemaVersion',
    'status',
    'statusHistory',
    'submission',
    'submittedAt',
    'submittedBy',
    'submissionReference',
    'owner',
    '_id',
    'id',
    'createdAt',
    'updatedAt',
  ];

  if (!isPlainObject(body) || Object.keys(body).length === 0) {
    return nextValidationError(next, 'A request body is required for application updates');
  }

  for (const field of protectedFields) {
    if (Object.prototype.hasOwnProperty.call(body, field)) {
      return nextValidationError(next, `The "${field}" field cannot be updated via the generic application endpoint`);
    }
  }

  const { responses, progress, documents } = body;

  if (responses !== undefined && !isPlainObject(responses)) {
    return nextValidationError(next, 'responses must be an object when provided');
  }

  if (progress !== undefined && !isValidProgress(progress)) {
    return nextValidationError(next, 'progress must contain valid completion details when provided');
  }

  if (documents !== undefined && !Array.isArray(documents)) {
    return nextValidationError(next, 'documents must be an array when provided');
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

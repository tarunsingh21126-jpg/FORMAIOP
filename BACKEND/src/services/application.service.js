const { randomUUID } = require('crypto');

const applicationRepository = require('../repositories/application.repository');
const { DEFAULT_APPLICATION_STATUS } = require('../constants/application.constants');

/**
 * Creates the minimal application shell. Submission workflow and progress
 * handling are intentionally deferred.
 */
async function createApplication(payload) {
  const application = await applicationRepository.createApplication({
    applicationId: `app_${randomUUID()}`,
    formId: payload.formId.trim(),
    applicantId: payload.applicantId.trim(),
    status: DEFAULT_APPLICATION_STATUS,
    referenceNumber: payload.referenceNumber?.trim(),
    notes: payload.notes?.trim() || '',
    metadata: payload.metadata || {},
  });

  return toPublicApplication(application);
}

/**
 * Retrieves a single application by its public id.
 */
async function getApplicationByApplicationId(applicationId) {
  const application = await applicationRepository.getApplicationByApplicationId(applicationId);

  if (!application) {
    const error = new Error(`No application found with id "${applicationId}"`);
    error.status = 404;
    throw error;
  }

  return toPublicApplication(application);
}

/**
 * Lists applications for the supplied lightweight filters.
 */
async function listApplications(filters) {
  const applications = await applicationRepository.listApplications(filters);
  return applications.map(toPublicApplication);
}

/**
 * Strips internal Mongo fields and keeps the API contract consistent.
 */
function toPublicApplication(applicationDoc) {
  if (!applicationDoc) {
    return null;
  }

  return {
    applicationId: applicationDoc.applicationId,
    formId: applicationDoc.formId,
    applicantId: applicationDoc.applicantId,
    status: applicationDoc.status,
    referenceNumber: applicationDoc.referenceNumber || null,
    notes: applicationDoc.notes || '',
    metadata: applicationDoc.metadata || {},
    createdAt: applicationDoc.createdAt,
    updatedAt: applicationDoc.updatedAt,
  };
}

module.exports = {
  createApplication,
  getApplicationByApplicationId,
  listApplications,
  toPublicApplication,
};

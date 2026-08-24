const Application = require('../models/application.model');

/**
 * Create and persist a new application.
 */
async function createApplication(payload) {
  const application = await Application.create(payload);
  return application.toObject();
}

/**
 * Find an application using its public application ID.
 */
async function getApplicationByApplicationId(applicationId) {
  return Application.findOne({ applicationId }).lean();
}

/**
 * Get applications based on optional filters.
 */
async function listApplications(filters = {}) {
  const query = {};

  const { applicantId, formId } = filters;

  if (applicantId) {
    query.applicantId = applicantId;
  }

  if (formId) {
    query.formId = formId;
  }

  return Application.find(query)
    .sort({ createdAt: -1 })
    .lean();
}

module.exports = {
  createApplication,
  getApplicationByApplicationId,
  listApplications,
};

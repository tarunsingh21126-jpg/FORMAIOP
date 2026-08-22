const Application = require('../models/application.model');

/**
 * Persists a new application record.
 */
async function createApplication(payload) {
  const application = await Application.create(payload);
  return application.toObject();
}

/**
 * Looks up an application by its public applicationId.
 */
async function getApplicationByApplicationId(applicationId) {
  return Application.findOne({ applicationId }).lean();
}

/**
 * Lists applications using the supported lightweight filters.
 */
async function listApplications(filters = {}) {
  const query = {};

  if (filters.applicantId) {
    query.applicantId = filters.applicantId;
  }

  if (filters.formId) {
    query.formId = filters.formId;
  }

  return Application.find(query).sort({ createdAt: -1 }).lean();
}

module.exports = {
  createApplication,
  getApplicationByApplicationId,
  listApplications,
};

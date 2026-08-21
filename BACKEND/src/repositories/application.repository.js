const Application = require('../models/application.model');

/**
 * Persists a new application record.
 */
async function createApplication(payload) {
  const application = await Application.create(payload);
  return application.toObject();
}

/**
 * Looks up an application by its MongoDB document id.
 */
async function findApplicationById(id) {
  return Application.findById(id).lean();
}

/**
 * Applies partial updates to an application by its MongoDB document id.
 */
async function updateApplication(id, updates) {
  return Application.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).lean();
}

/**
 * Deletes an application by its MongoDB document id.
 */
async function deleteApplication(id) {
  return Application.findByIdAndDelete(id).lean();
}

module.exports = {
  createApplication,
  findApplicationById,
  updateApplication,
  deleteApplication,
};

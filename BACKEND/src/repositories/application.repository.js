const Application = require('../models/application.model');

/**
 * Create and persist a new application.
 */
async function createApplication(payload) {
  const application = await Application.create(payload);
  return application.toObject();
}

async function findApplicationById(id) {
  return Application.findById(id).lean();
}

async function updateApplication(id, updates) {
  return Application.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  }).lean();
}

async function deleteApplication(id) {
  return Application.findByIdAndDelete(id).lean();
}

module.exports = {
  createApplication,
  findApplicationById,
  updateApplication,
  deleteApplication,
};

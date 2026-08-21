const applicationRepository = require('../repositories/application.repository');
const { DEFAULT_APPLICATION_STATUS } = require('../constants/application.constants');

/**
 * Creates the initial application record. More advanced workflow concerns
 * such as submission, resume, and document processing are deferred.
 */
async function createApplication(payload) {
  const application = await applicationRepository.createApplication({
    userId: payload.userId.trim(),
    formId: payload.formId.trim(),
    schemaVersion: payload.schemaVersion,
    status: payload.status || DEFAULT_APPLICATION_STATUS,
    responses: payload.responses || {},
    progress: payload.progress ?? 0,
    documents: payload.documents || [],
    statusHistory: payload.statusHistory || [],
  });

  return toPublicApplication(application);
}

/**
 * Retrieves an application by its MongoDB document id.
 */
async function getApplication(id) {
  const application = await applicationRepository.findApplicationById(id);

  if (!application) {
    const error = new Error(`No application found with id "${id}"`);
    error.status = 404;
    throw error;
  }

  return toPublicApplication(application);
}

/**
 * Applies basic updates to an existing application.
 */
async function updateApplication(id, updates) {
  await getApplication(id);

  const sanitizedUpdates = sanitizeApplicationUpdates(updates);
  const application = await applicationRepository.updateApplication(id, sanitizedUpdates);

  if (!application) {
    const error = new Error(`No application found with id "${id}"`);
    error.status = 404;
    throw error;
  }

  return toPublicApplication(application);
}

/**
 * Deletes an application by its MongoDB document id.
 */
async function deleteApplication(id) {
  const deletedApplication = await applicationRepository.deleteApplication(id);

  if (!deletedApplication) {
    const error = new Error(`No application found with id "${id}"`);
    error.status = 404;
    throw error;
  }

  return toPublicApplication(deletedApplication);
}

/**
 * Normalizes the application shape exposed by the API/service layer.
 */
function toPublicApplication(applicationDoc) {
  if (!applicationDoc) {
    return null;
  }

  return {
    id: applicationDoc._id?.toString?.() || applicationDoc.id || null,
    userId: applicationDoc.userId,
    formId: applicationDoc.formId,
    schemaVersion: applicationDoc.schemaVersion,
    status: applicationDoc.status,
    responses: applicationDoc.responses || {},
    progress: applicationDoc.progress ?? 0,
    documents: applicationDoc.documents || [],
    statusHistory: applicationDoc.statusHistory || [],
    createdAt: applicationDoc.createdAt,
    updatedAt: applicationDoc.updatedAt,
  };
}

/**
 * Restricts updates to the fields supported by the current foundation.
 */
function sanitizeApplicationUpdates(updates = {}) {
  const sanitizedUpdates = {};
  const updatableFields = [
    'userId',
    'formId',
    'schemaVersion',
    'status',
    'responses',
    'progress',
    'documents',
    'statusHistory',
  ];

  for (const field of updatableFields) {
    if (updates[field] === undefined) {
      continue;
    }

    if (typeof updates[field] === 'string') {
      sanitizedUpdates[field] = updates[field].trim();
      continue;
    }

    sanitizedUpdates[field] = updates[field];
  }

  return sanitizedUpdates;
}

module.exports = {
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
  toPublicApplication,
};

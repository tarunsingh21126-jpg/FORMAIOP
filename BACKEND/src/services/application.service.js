const applicationRepository = require('../repositories/application.repository');
const { DEFAULT_APPLICATION_STATUS } = require('../constants/application.constants');

async function createApplication(payload) {
  const application = await applicationRepository.createApplication({
    userId: payload.userId,
    formId: payload.formId.trim(),
    form: payload.form,
    schemaVersion: payload.schemaVersion,
    status: payload.status || DEFAULT_APPLICATION_STATUS,
    responses: payload.responses || {},
    progress: normalizeProgress(payload.progress),
    documents: payload.documents || [],
    statusHistory: payload.statusHistory || [],
    submission: payload.submission,
  });

  return toPublicApplication(application);
}

async function getApplication(id) {
  const application = await applicationRepository.findApplicationById(id);

  if (!application) {
    const error = new Error(`No application found with id "${id}"`);
    error.status = 404;
    throw error;
  }

  return toPublicApplication(application);
}

async function updateApplication(id, updates) {
  await getApplication(id);
  const application = await applicationRepository.updateApplication(
    id,
    sanitizeApplicationUpdates(updates)
  );

  if (!application) {
    const error = new Error(`No application found with id "${id}"`);
    error.status = 404;
    throw error;
  }

  return toPublicApplication(application);
}

async function deleteApplication(id) {
  const application = await applicationRepository.deleteApplication(id);

  if (!application) {
    const error = new Error(`No application found with id "${id}"`);
    error.status = 404;
    throw error;
  }

  return toPublicApplication(application);
}

function toPublicApplication(applicationDoc) {
  if (!applicationDoc) {
    return null;
  }

  return {
    id: applicationDoc._id?.toString?.() || applicationDoc.id || null,
    userId: applicationDoc.userId,
    formId: applicationDoc.formId,
    form: applicationDoc.form,
    schemaVersion: applicationDoc.schemaVersion,
    status: applicationDoc.status,
    responses: applicationDoc.responses || {},
    progress: applicationDoc.progress || {},
    documents: applicationDoc.documents || [],
    statusHistory: applicationDoc.statusHistory || [],
    submission: applicationDoc.submission,
    createdAt: applicationDoc.createdAt,
    updatedAt: applicationDoc.updatedAt,
  };
}

function sanitizeApplicationUpdates(updates = {}) {
  const allowedFields = [
    'userId',
    'formId',
    'form',
    'schemaVersion',
    'status',
    'responses',
    'progress',
    'documents',
    'statusHistory',
    'submission',
  ];

  return Object.fromEntries(
    allowedFields
      .filter((field) => updates[field] !== undefined)
      .map((field) => [field, updates[field]])
  );
}

function normalizeProgress(progress) {
  if (typeof progress === 'number') {
    return { completionPercentage: progress };
  }

  return progress || {};
}

module.exports = {
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
  toPublicApplication,
};

const applicationRepository = require('../repositories/application.repository');
const {
  DEFAULT_APPLICATION_STATUS,
  APPLICATION_STATUS_DRAFT,
} = require('../constants/application.constants');

async function createApplication(payload, actor) {
  const effectiveUserId = resolveActorId(actor) || payload.userId;
  const normalizedPayload = {
    userId: effectiveUserId,
    formId: String(payload.formId || '').trim(),
    form: payload.form,
    schemaVersion: Number(payload.schemaVersion),
    status: payload.status || DEFAULT_APPLICATION_STATUS,
    responses: payload.responses || {},
    progress: normalizeProgress(payload.progress),
    documents: Array.isArray(payload.documents) ? payload.documents : [],
    statusHistory: buildInitialStatusHistory(payload.statusHistory, payload.status || DEFAULT_APPLICATION_STATUS, effectiveUserId),
    submission: payload.submission,
  };

  const application = await applicationRepository.createApplication(normalizedPayload);

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
  const allowedFields = ['responses', 'progress', 'documents'];

  return Object.fromEntries(
    allowedFields
      .filter((field) => updates[field] !== undefined)
      .map((field) => [field, updates[field]])
  );
}

function resolveActorId(actor) {
  if (!actor) return null;

  if (typeof actor === 'string') return actor;

  if (typeof actor === 'object') {
    return actor._id || actor.id || actor.userId || null;
  }

  return null;
}

function buildInitialStatusHistory(existingHistory, status, actorId) {
  if (Array.isArray(existingHistory) && existingHistory.length > 0) {
    return existingHistory;
  }

  return [{
    previousStatus: null,
    newStatus: status || APPLICATION_STATUS_DRAFT,
    changedBy: actorId || 'system',
    reason: 'Application created',
  }];
}

function normalizeProgress(progress) {
  if (typeof progress === 'number') {
    return { completionPercentage: progress };
  }

  if (progress && typeof progress === 'object') {
    return {
      completionPercentage:
        typeof progress.completionPercentage === 'number'
          ? progress.completionPercentage
          : 0,
      completedSections: Array.isArray(progress.completedSections)
        ? progress.completedSections
        : [],
      currentSection: progress.currentSection || undefined,
      totalSections:
        Number.isInteger(progress.totalSections) && progress.totalSections >= 0
          ? progress.totalSections
          : 0,
    };
  }

  return {
    completionPercentage: 0,
    completedSections: [],
    totalSections: 0,
  };
}

module.exports = {
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
  toPublicApplication,
};

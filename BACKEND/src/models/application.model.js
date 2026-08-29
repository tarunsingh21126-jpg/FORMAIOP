const mongoose = require('mongoose');

const {
  APPLICATION_STATUSES,
  DEFAULT_APPLICATION_STATUS,
} = require('../constants/application.constants');

const { Schema } = mongoose;

function isPlainObject(value) {
  return value !== null && !Array.isArray(value) && typeof value === 'object';
}

/**
 * File/document metadata attached to an application. Kept intentionally
 * lightweight so storage, verification, and review workflows can evolve later.
 */
const ApplicationDocumentSchema = new Schema(
  {
    documentId: { type: String, trim: true },
    type: { type: String, trim: true },
    documentType: { type: String, trim: true },
    name: { type: String, trim: true },
    filename: { type: String, trim: true },
    url: { type: String, trim: true },
    storageReference: { type: String, trim: true },
    uploadedAt: { type: Date },
    createdAt: { type: Date, default: Date.now },
    uploadedBy: { type: String, trim: true },
    storageKey: { type: String, trim: true },
    mimeType: { type: String, trim: true },
    sizeBytes: { type: Number, min: 0 },
    checksum: { type: String, trim: true },
    uploadStatus: {
      type: String,
      enum: ['pending', 'uploaded', 'failed'],
      default: 'pending',
    },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
    verifiedAt: { type: Date },
    verifiedBy: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

/**
 * Records state changes over time without imposing lifecycle rules yet.
 */
const ApplicationStatusHistorySchema = new Schema(
  {
    previousStatus: { type: String, enum: APPLICATION_STATUSES },
    newStatus: { type: String, enum: APPLICATION_STATUSES, required: true },
    status: { type: String, enum: APPLICATION_STATUSES },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: String, trim: true },
    reason: { type: String, trim: true },
    comment: { type: String, trim: true },
    note: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const ApplicationProgressSchema = new Schema(
  {
    completionPercentage: { type: Number, min: 0, max: 100, default: 0 },
    completedSections: { type: [String], default: [] },
    currentSection: { type: String, trim: true },
    totalSections: {
      type: Number,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: 'totalSections must be a non-negative integer',
      },
    },
  },
  { _id: false }
);

const ApplicationSubmissionSchema = new Schema(
  {
    submittedAt: { type: Date },
    submittedBy: { type: String, trim: true },
    confirmationId: { type: String, trim: true },
    channel: { type: String, trim: true },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

/**
 * Foundational application model for linking a user, form, and schema version
 * to the in-progress set of responses and supporting metadata.
 */
const ApplicationSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    formId: { type: String, required: true, trim: true, index: true },
    form: {
      type: Schema.Types.ObjectId,
      ref: 'Form',
      index: true,
    },
    schemaVersion: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: 'schemaVersion must be an integer greater than or equal to 1',
      },
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES,
      default: DEFAULT_APPLICATION_STATUS,
      index: true,
    },
    responses: {
      type: Schema.Types.Mixed,
      default: {},
      validate: {
        validator: isPlainObject,
        message: 'responses must be an object',
      },
    },
    progress: {
      type: ApplicationProgressSchema,
      default: () => ({}),
    },
    documents: {
      type: [ApplicationDocumentSchema],
      default: [],
    },
    statusHistory: {
      type: [ApplicationStatusHistorySchema],
      default: [],
    },
    submission: {
      type: ApplicationSubmissionSchema,
      default: undefined,
    },
  },
  { timestamps: true }
);

ApplicationSchema.index({ userId: 1, formId: 1, createdAt: -1 });
ApplicationSchema.index({ formId: 1, schemaVersion: 1 });

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;

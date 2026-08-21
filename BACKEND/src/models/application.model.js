const mongoose = require('mongoose');

const {
  APPLICATION_STATUSES,
  DEFAULT_APPLICATION_STATUS,
} = require('../constants/application.constants');

const { Schema } = mongoose;

/**
 * File/document metadata attached to an application. Kept intentionally
 * lightweight so storage, verification, and review workflows can evolve later.
 */
const ApplicationDocumentSchema = new Schema(
  {
    documentId: { type: String, trim: true },
    type: { type: String, trim: true },
    name: { type: String, trim: true },
    url: { type: String, trim: true },
    uploadedAt: { type: Date },
    uploadedBy: { type: String, trim: true },
    storageKey: { type: String, trim: true },
    mimeType: { type: String, trim: true },
    sizeBytes: { type: Number, min: 0 },
    checksum: { type: String, trim: true },
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
    status: { type: String, enum: APPLICATION_STATUSES, required: true },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: String, trim: true },
    note: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

const ApplicationProgressSchema = new Schema(
  {
    completedFields: { type: Number, min: 0, default: 0 },
    totalFields: { type: Number, min: 0, default: 0 },
    lastCalculatedAt: { type: Date },
    calculationSource: { type: String, trim: true },
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
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    progressDetails: {
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

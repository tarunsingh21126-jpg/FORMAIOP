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
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);

/**
 * Records state changes over time without imposing lifecycle rules yet.
 */
const ApplicationStatusHistorySchema = new Schema(
  {
    status: { type: String, trim: true },
    changedAt: { type: Date, default: Date.now },
    changedBy: { type: String, trim: true },
    note: { type: String, default: '' },
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
    userId: { type: String, required: true, trim: true, index: true },
    formId: { type: String, required: true, trim: true, index: true },
    schemaVersion: { type: Number, required: true, min: 1 },
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
    documents: {
      type: [ApplicationDocumentSchema],
      default: [],
    },
    statusHistory: {
      type: [ApplicationStatusHistorySchema],
      default: [],
    },
  },
  { timestamps: true }
);

ApplicationSchema.index({ userId: 1, formId: 1, createdAt: -1 });

const Application = mongoose.model('Application', ApplicationSchema);

module.exports = Application;

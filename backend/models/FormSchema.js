const mongoose = require('mongoose');

// A single conditional rule: show this field only if another field matches a value
const ShowIfSchema = new mongoose.Schema(
  {
    field: { type: String, required: true },
    operator: {
      type: String,
      enum: ['equals', 'notEquals', 'contains'],
      required: true
    },
    value: { type: mongoose.Schema.Types.Mixed, required: true }
  },
  { _id: false }
);

// Field-level validation rules (all optional, applied by React Hook Form)
const ValidationSchema = new mongoose.Schema(
  {
    required: { type: Boolean, default: false },
    minLength: { type: Number },
    maxLength: { type: Number },
    min: { type: Number },
    max: { type: Number },
    pattern: { type: String }
  },
  { _id: false }
);

// A single question on the form
const FieldSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    label: { type: String, required: true },
    type: {
      type: String,
      enum: ['text', 'number', 'email', 'date', 'select', 'radio', 'checkbox', 'textarea'],
      required: true
    },
    required: { type: Boolean, default: false },
    placeholder: { type: String },
    options: [{ type: String }],
    validation: { type: ValidationSchema, default: undefined },
    showIf: { type: ShowIfSchema, default: undefined }
  },
  { _id: false }
);

// Top-level form document
const FormSchemaSchema = new mongoose.Schema(
  {
    formId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    description: { type: String },
    version: { type: Number, default: 1 },
    fields: [FieldSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model('FormSchema', FormSchemaSchema);

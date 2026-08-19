const mongoose = require('mongoose');

const { Schema } = mongoose;

// Field types supported by the Week 1 dynamic renderer.
const SUPPORTED_FIELD_TYPES = [
  'text',
  'email',
  'number',
  'textarea',
  'select',
  'checkbox',
];

// Operators the generic condition engine understands.
const SUPPORTED_OPERATORS = ['equals', 'notEquals'];

/**
 * Validation rules for a single field. Every rule is optional - only the
 * rules present on a field are applied by the frontend. Kept schema-less
 * on the "value can be any primitive" front (min/max are numbers,
 * minLength/maxLength are numbers, pattern is a regex source string).
 */
const ValidationSchema = new Schema(
  {
    required: { type: Boolean, default: false },
    min: { type: Number },
    max: { type: Number },
    minLength: { type: Number },
    maxLength: { type: Number },
    pattern: { type: String }, // regex source, e.g. "^[A-Za-z]+$"
    message: { type: String }, // optional custom message for pattern mismatches
  },
  { _id: false }
);

/**
 * A dropdown/select option.
 */
const OptionSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

/**
 * Conditional visibility rule. When present on a field, the frontend's
 * generic condition engine evaluates it against the current form values
 * to decide whether the field should be rendered.
 */
const ShowIfSchema = new Schema(
  {
    field: { type: String, required: true }, // id of the field this depends on
    operator: {
      type: String,
      enum: SUPPORTED_OPERATORS,
      default: 'equals',
    },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

/**
 * A single dynamic form field.
 */
const FieldSchema = new Schema(
  {
    id: { type: String, required: true }, // stable key used in form values / showIf references
    type: { type: String, enum: SUPPORTED_FIELD_TYPES, required: true },
    label: { type: String, required: true },
    placeholder: { type: String },
    options: { type: [OptionSchema], default: undefined }, // select fields only
    validation: { type: ValidationSchema, default: () => ({}) },
    showIf: { type: ShowIfSchema, default: undefined },
  },
  { _id: false }
);

/**
 * A complete dynamic form: an id (used in the API URL), display metadata,
 * and the ordered list of fields that make up the schema.
 */
const FormSchema = new Schema(
  {
    formId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    fields: { type: [FieldSchema], default: [] },
  },
  { timestamps: true }
);

const Form = mongoose.model('Form', FormSchema);

module.exports = Form;
module.exports.SUPPORTED_FIELD_TYPES = SUPPORTED_FIELD_TYPES;
module.exports.SUPPORTED_OPERATORS = SUPPORTED_OPERATORS;

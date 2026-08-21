const mongoose = require('mongoose');

const { Schema } = mongoose;

const SUPPORTED_FIELD_TYPES = [
  'text',
  'email',
  'number',
  'textarea',
  'select',
  'checkbox',
];

const SUPPORTED_OPERATORS = ['equals', 'notEquals'];

const ValidationSchema = new Schema(
  {
    required: { type: Boolean, default: false },
    min: { type: Number },
    max: { type: Number },
    minLength: { type: Number },
    maxLength: { type: Number },
    pattern: { type: String }, 
    message: { type: String }, 
  },
  { _id: false }
);


const OptionSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);


const ShowIfSchema = new Schema(
  {
    field: { type: String, required: true }, 
    operator: {
      type: String,
      enum: SUPPORTED_OPERATORS,
      default: 'equals',
    },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { _id: false }
);

const FieldSchema = new Schema(
  {
    id: { type: String, required: true }, 
    type: { type: String, enum: SUPPORTED_FIELD_TYPES, required: true },
    label: { type: String, required: true },
    placeholder: { type: String },
    options: { type: [OptionSchema], default: undefined }, 
    validation: { type: ValidationSchema, default: () => ({}) },
    showIf: { type: ShowIfSchema, default: undefined },
  },
  { _id: false }
);


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

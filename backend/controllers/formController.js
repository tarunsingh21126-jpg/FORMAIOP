const FormSchema = require('../models/FormSchema');
const { asyncHandler } = require('../middleware/errorHandler');

// GET /api/forms/:formId
const getForm = asyncHandler(async (req, res) => {
  const form = await FormSchema.findOne({ formId: req.params.formId });
  if (!form) {
    return res.status(404).json({ success: false, message: 'Form not found' });
  }
  res.json({ success: true, data: form });
});

// POST /api/forms
const createForm = asyncHandler(async (req, res) => {
  const existing = await FormSchema.findOne({ formId: req.body.formId });
  if (existing) {
    return res.status(409).json({ success: false, message: 'formId already exists' });
  }
  const form = await FormSchema.create(req.body);
  res.status(201).json({ success: true, data: form });
});

// PUT /api/forms/:formId
const updateForm = asyncHandler(async (req, res) => {
  const form = await FormSchema.findOneAndUpdate({ formId: req.params.formId }, req.body, {
    new: true,
    runValidators: true
  });
  if (!form) {
    return res.status(404).json({ success: false, message: 'Form not found' });
  }
  res.json({ success: true, data: form });
});

// DELETE /api/forms/:formId
const deleteForm = asyncHandler(async (req, res) => {
  const form = await FormSchema.findOneAndDelete({ formId: req.params.formId });
  if (!form) {
    return res.status(404).json({ success: false, message: 'Form not found' });
  }
  res.json({ success: true, message: 'Form deleted' });
});

module.exports = { getForm, createForm, updateForm, deleteForm };

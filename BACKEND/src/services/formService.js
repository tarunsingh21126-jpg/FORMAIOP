const Form = require('../models/Form');

async function getFormByFormId(formId) {
  return Form.findOne({ formId }).lean();
}

function toPublicForm(form) {
  if (!form) return null;
  return {
    formId: form.formId,
    title: form.title,
    description: form.description || '',
    fields: (form.fields || []).map((field) => ({
      id: field.id,
      type: field.type,
      label: field.label,
      placeholder: field.placeholder || '',
      options: field.options || [],
      validation: field.validation || {},
      showIf: field.showIf || undefined,
    })),
  };
}

module.exports = { getFormByFormId, toPublicForm };

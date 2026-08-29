/**
 * Validates AI-extracted JSON against a form's schema.
 *
 * - Removes any key not present in the schema's field list (the AI can never
 *   invent a field name that reaches the frontend).
 * - Drops values that don't match the field's expected type/allowed options.
 * - Skips null/undefined values entirely - that means "AI found nothing",
 *   so the field is simply left out and stays blank for manual entry.
 *
 * Returns { safeData, rejected } so callers can log/debug what was stripped
 * without ever sending it to the client.
 */
function validateAgainstSchema(aiOutput, formSchema) {
  const allowedFields = new Map(formSchema.fields.map((f) => [f.name, f]));
  const safeData = {};
  const rejected = [];

  for (const [key, value] of Object.entries(aiOutput || {})) {
    const field = allowedFields.get(key);

    if (!field) {
      rejected.push({ key, reason: 'field not in schema' });
      continue;
    }

    if (value === null || value === undefined) {
      continue;
    }

    if (!isValidForType(value, field)) {
      rejected.push({ key, reason: `invalid value for type "${field.type}"` });
      continue;
    }

    safeData[key] = value;
  }

  return { safeData, rejected };
}

function isValidForType(value, field) {
  switch (field.type) {
    case 'number':
      return typeof value === 'number' || (value !== '' && !isNaN(Number(value)));
    case 'checkbox':
      return typeof value === 'boolean';
    case 'select':
    case 'radio':
      return field.options && field.options.length ? field.options.includes(value) : typeof value === 'string';
    case 'text':
    case 'email':
    case 'date':
    case 'textarea':
    default:
      return typeof value === 'string';
  }
}

module.exports = { validateAgainstSchema };

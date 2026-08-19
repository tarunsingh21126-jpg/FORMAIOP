/**
 * Translates a field's `validation` block from the schema into the rules
 * object React Hook Form's `register` expects. Nothing here is specific
 * to any individual field - it only reacts to which validation keys are
 * present on the schema.
 */
function buildValidationRules(field) {
  const v = field.validation || {};
  const rules = {};

  if (v.required) {
    rules.required = `${field.label} is required`;
  }

  if (v.minLength !== undefined) {
    rules.minLength = {
      value: v.minLength,
      message: `${field.label} must be at least ${v.minLength} characters`,
    };
  }

  if (v.maxLength !== undefined) {
    rules.maxLength = {
      value: v.maxLength,
      message: `${field.label} must be at most ${v.maxLength} characters`,
    };
  }

  if (v.min !== undefined) {
    rules.min = {
      value: v.min,
      message: `${field.label} must be at least ${v.min}`,
    };
  }

  if (v.max !== undefined) {
    rules.max = {
      value: v.max,
      message: `${field.label} must be at most ${v.max}`,
    };
  }

  if (v.pattern) {
    rules.pattern = {
      value: new RegExp(v.pattern),
      message: v.message || `${field.label} is not in a valid format`,
    };
  }

  return rules;
}

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p className="field-error" role="alert">
      {message}
    </p>
  );
}

export default function DynamicField({ field, register, errors }) {
  const rules = buildValidationRules(field);
  const errorMessage = errors?.[field.id]?.message;
  const inputId = `field-${field.id}`;

  switch (field.type) {
    case 'text':
    case 'email':
      return (
        <div className="form-field">
          <label htmlFor={inputId}>{field.label}</label>
          <input
            id={inputId}
            type={field.type}
            placeholder={field.placeholder}
            aria-invalid={Boolean(errorMessage)}
            {...register(field.id, rules)}
          />
          <FieldError message={errorMessage} />
        </div>
      );

    case 'number':
      return (
        <div className="form-field">
          <label htmlFor={inputId}>{field.label}</label>
          <input
            id={inputId}
            type="number"
            placeholder={field.placeholder}
            aria-invalid={Boolean(errorMessage)}
            {...register(field.id, { ...rules, valueAsNumber: true })}
          />
          <FieldError message={errorMessage} />
        </div>
      );

    case 'textarea':
      return (
        <div className="form-field">
          <label htmlFor={inputId}>{field.label}</label>
          <textarea
            id={inputId}
            rows={4}
            placeholder={field.placeholder}
            aria-invalid={Boolean(errorMessage)}
            {...register(field.id, rules)}
          />
          <FieldError message={errorMessage} />
        </div>
      );

    case 'select':
      return (
        <div className="form-field">
          <label htmlFor={inputId}>{field.label}</label>
          <select
            id={inputId}
            defaultValue=""
            aria-invalid={Boolean(errorMessage)}
            {...register(field.id, rules)}
          >
            <option value="" disabled>
              Select an option...
            </option>
            {(field.options || []).map((option) => (
              <option key={String(option.value)} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <FieldError message={errorMessage} />
        </div>
      );

    case 'checkbox':
      return (
        <div className="form-field form-field--checkbox">
          <label htmlFor={inputId}>
            <input
              id={inputId}
              type="checkbox"
              aria-invalid={Boolean(errorMessage)}
              {...register(field.id, rules)}
            />
            {field.label}
          </label>
          <FieldError message={errorMessage} />
        </div>
      );

    default:
      // Unknown field type in the schema - surface it instead of
      // silently dropping the field, so a bad schema is easy to spot.
      return (
        <div className="form-field form-field--unsupported">
          Unsupported field type "{field.type}" for field "{field.id}".
        </div>
      );
  }
}

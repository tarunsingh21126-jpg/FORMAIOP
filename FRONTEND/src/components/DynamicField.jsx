function buildValidationRules(field) {
  const v = field.validation || {};
  const rules = {};
  if (v.required) rules.required = `${field.label} is required`;
  if (v.minLength !== undefined) rules.minLength = { value: v.minLength, message: v.message || `${field.label} must be at least ${v.minLength} characters` };
  if (v.maxLength !== undefined) rules.maxLength = { value: v.maxLength, message: `${field.label} must be at most ${v.maxLength} characters` };
  if (v.min !== undefined) rules.min = { value: v.min, message: `${field.label} must be at least ${v.min}` };
  if (v.max !== undefined) rules.max = { value: v.max, message: `${field.label} must be at most ${v.max}` };
  if (v.pattern) {
    try { rules.pattern = { value: new RegExp(v.pattern), message: v.message || `${field.label} is not in a valid format` }; } catch { /* invalid schema pattern is handled by backend data validation */ }
  }
  return rules;
}

function FieldError({ message, id }) {
  return message ? <p id={id} className="field-error" role="alert">{message}</p> : null;
}

function FieldLabel({ field, inputId, aiFilled }) {
  return (
    <label htmlFor={inputId} className="field-label">
      <span>{field.label}</span>
      {field.validation?.required && <span className="required-mark">*</span>}
      {aiFilled && <span className="ai-tag">AI</span>}
    </label>
  );
}

export default function DynamicField({ field, register, errors, aiFilled }) {
  const rules = buildValidationRules(field);
  const errorMessage = errors?.[field.id]?.message;
  const inputId = `field-${field.id}`;
  const common = { id: inputId, 'aria-invalid': Boolean(errorMessage), 'aria-describedby': errorMessage ? `${inputId}-error` : undefined };

  switch (field.type) {
    case 'text':
    case 'email':
      return <div className="form-field"><FieldLabel field={field} inputId={inputId} aiFilled={aiFilled} /><input {...common} type={field.type} placeholder={field.placeholder} {...register(field.id, rules)} /><FieldError message={errorMessage} /></div>;
    case 'number':
  return (
    <div className="form-field">
      <FieldLabel field={field} inputId={inputId} aiFilled={aiFilled} />
      <input
        {...common}
        type="number"
        placeholder={field.placeholder}
        {...register(field.id, {
          ...rules,
          setValueAs: (value) => (value === '' ? undefined : Number(value)),
        })}
      />
      <FieldError message={errorMessage} />
    </div>
  );
    case 'textarea':
      return <div className="form-field"><FieldLabel field={field} inputId={inputId} aiFilled={aiFilled} /><textarea {...common} rows={4} placeholder={field.placeholder} {...register(field.id, rules)} /><FieldError message={errorMessage} /></div>;
    
        case 'date':
  return (
    <div className="form-field">
      <FieldLabel
        field={field}
        inputId={inputId}
        aiFilled={aiFilled}
      />
      <input
        {...common}
        type="date"
        {...register(field.id, rules)}
      />
      <FieldError message={errorMessage} />
    </div>
  );
    case 'select':
      return <div className="form-field"><FieldLabel field={field} inputId={inputId} aiFilled={aiFilled} /><select {...common} defaultValue="" {...register(field.id, rules)}><option value="" disabled>Select an option…</option>{(field.options || []).map((option) => <option key={String(option.value)} value={String(option.value)}>{option.label}</option>)}</select><FieldError message={errorMessage} /></div>;
    case 'checkbox':
      return <div className="form-field checkbox-field"><label className="checkbox-label" htmlFor={inputId}><input {...common} type="checkbox" {...register(field.id, rules)} /><span>{field.label}{field.validation?.required && <span className="required-mark">*</span>}</span>{aiFilled && <span className="ai-tag">AI</span>}</label><FieldError message={errorMessage} /></div>;
    default:
      return <div className="unsupported-field">Unsupported field type “{field.type}” for “{field.id}”.</div>;
  }
}

export default function TextField({ field, register, error, type = 'text' }) {
  return (
    <div className="form-field">
      <label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="required-mark"> *</span>}
      </label>
      <input
        id={field.name}
        type={type}
        placeholder={field.placeholder}
        {...register(field.name, buildValidationRules(field))}
        className={error ? 'input-error' : ''}
      />
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
}

// Shared across TextField, textarea, and any input-like field: turns the
// schema's "validation" object into React Hook Form's register() rules.
export function buildValidationRules(field) {
  const v = field.validation || {};
  const rules = {};

  if (field.required || v.required) {
    rules.required = 'This field is required';
  }
  if (v.minLength) {
    rules.minLength = { value: v.minLength, message: `Minimum length is ${v.minLength}` };
  }
  if (v.maxLength) {
    rules.maxLength = { value: v.maxLength, message: `Maximum length is ${v.maxLength}` };
  }
  if (v.min !== undefined) {
    rules.min = { value: v.min, message: `Minimum value is ${v.min}` };
  }
  if (v.max !== undefined) {
    rules.max = { value: v.max, message: `Maximum value is ${v.max}` };
  }
  if (v.pattern) {
    rules.pattern = { value: new RegExp(v.pattern), message: 'Invalid format' };
  }

  return rules;
}

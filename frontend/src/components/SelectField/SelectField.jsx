import { buildValidationRules } from '../TextField/TextField';

export default function SelectField({ field, register, error }) {
  return (
    <div className="form-field">
      <label htmlFor={field.name}>
        {field.label}
        {field.required && <span className="required-mark"> *</span>}
      </label>
      <select
        id={field.name}
        defaultValue=""
        {...register(field.name, buildValidationRules(field))}
        className={error ? 'input-error' : ''}
      >
        <option value="" disabled>
          Select an option
        </option>
        {(field.options || []).map((opt) => (
          <option key={opt} value={opt}>
            {formatOptionLabel(opt)}
          </option>
        ))}
      </select>
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
}

function formatOptionLabel(opt) {
  return opt.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

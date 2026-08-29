export default function RadioField({ field, register, error }) {
  return (
    <div className="form-field">
      <span className="field-label-static">
        {field.label}
        {field.required && <span className="required-mark"> *</span>}
      </span>
      <div className="radio-group">
        {(field.options || []).map((opt) => (
          <label key={opt} className="radio-option">
            <input
              type="radio"
              value={opt}
              {...register(field.name, field.required ? { required: 'Please select an option' } : {})}
            />
            {formatOptionLabel(opt)}
          </label>
        ))}
      </div>
      {error && <span className="field-error">{error.message}</span>}
    </div>
  );
}

function formatOptionLabel(opt) {
  return opt.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

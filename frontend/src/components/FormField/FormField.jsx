import TextField, { buildValidationRules } from '../TextField/TextField';
import SelectField from '../SelectField/SelectField';
import RadioField from '../RadioField/RadioField';
import CheckboxField from '../CheckboxField/CheckboxField';

/**
 * Dispatches a schema field definition to the right input component.
 * This is the only place that maps "type" -> UI - no question is ever
 * hand-written inside a page component.
 */
export default function FormField({ field, register, errors }) {
  const error = errors[field.name];

  switch (field.type) {
    case 'text':
    case 'email':
    case 'date':
    case 'number':
      return <TextField field={field} register={register} error={error} type={field.type} />;

    case 'textarea':
      return (
        <div className="form-field">
          <label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="required-mark"> *</span>}
          </label>
          <textarea
            id={field.name}
            placeholder={field.placeholder}
            rows={4}
            {...register(field.name, buildValidationRules(field))}
            className={error ? 'input-error' : ''}
          />
          {error && <span className="field-error">{error.message}</span>}
        </div>
      );

    case 'select':
      return <SelectField field={field} register={register} error={error} />;

    case 'radio':
      return <RadioField field={field} register={register} error={error} />;

    case 'checkbox':
      return <CheckboxField field={field} register={register} />;

    default:
      console.warn(`Unknown field type "${field.type}" for field "${field.name}"`);
      return null;
  }
}

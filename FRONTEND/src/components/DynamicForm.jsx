import { useForm } from 'react-hook-form';
import DynamicField from './DynamicField.jsx';
import { isFieldVisible } from '../utils/conditionEngine.js';

/**
 * Builds default values for React Hook Form from the schema, so every
 * field starts controlled/uncontrolled consistently regardless of type.
 */
function buildDefaultValues(fields) {
  const defaults = {};
  for (const field of fields) {
    defaults[field.id] = field.type === 'checkbox' ? false : '';
  }
  return defaults;
}

export default function DynamicForm({ schema, onSubmitSuccess }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: buildDefaultValues(schema.fields),
    mode: 'onBlur',
  });

  const liveValues = watch();

  const onSubmit = (values) => {
    // Fields hidden by showIf shouldn't be treated as real answers, even
    // if React Hook Form still holds a default value for them.
    const visibleFieldIds = new Set(
      schema.fields.filter((field) => isFieldVisible(field, values)).map((field) => field.id)
    );

    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(([id]) => visibleFieldIds.has(id))
    );

    onSubmitSuccess(cleanedValues);
  };

  return (
    <form className="dynamic-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {schema.fields.map((field) =>
        isFieldVisible(field, liveValues) ? (
          <DynamicField key={field.id} field={field} register={register} errors={errors} />
        ) : null
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit claim'}
      </button>
    </form>
  );
}

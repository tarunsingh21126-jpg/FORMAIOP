import { useForm } from 'react-hook-form';
import DynamicField from './DynamicField.jsx';
import { isFieldVisible } from '../utils/conditionEngine.js';

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
    resetField,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: buildDefaultValues(schema.fields),
    mode: 'onBlur',
  });

  const liveValues = watch();

  const onSubmit = (values) => {
    const visibleFieldIds = new Set(
      schema.fields
        .filter((field) => isFieldVisible(field, values))
        .map((field) => field.id)
    );

    const cleanedValues = Object.fromEntries(
      Object.entries(values).filter(([id]) => visibleFieldIds.has(id))
    );

    onSubmitSuccess(cleanedValues);
  };

  const visibleFields = schema.fields.filter((field) =>
    isFieldVisible(field, liveValues)
  );

  return (
    <form className="dynamic-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {visibleFields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          register={register}
          errors={errors}
        />
      ))}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit claim'}
      </button>
    </form>
  );
}

import { forwardRef, useImperativeHandle } from 'react';
import { useForm } from 'react-hook-form';
import FormField from '../FormField/FormField';
import { useConditionalFields } from '../../hooks/useConditionalFields';

/**
 * Renders a complete form purely from a JSON schema. Exposes setValue via
 * ref so parent components (e.g. MagicInput) can auto-fill fields after AI
 * extraction without re-implementing any form logic.
 */
const DynamicForm = forwardRef(function DynamicForm({ schema, onSubmit }, ref) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm({ mode: 'onBlur' });

  useImperativeHandle(ref, () => ({
    setValue: (name, value, options) =>
      setValue(name, value, { shouldValidate: true, shouldDirty: true, ...options })
  }));

  const watchedValues = watch();
  const visibleFields = useConditionalFields(schema.fields, watchedValues);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="dynamic-form" noValidate>
      {visibleFields.map((field) => (
        <FormField key={field.id} field={field} register={register} errors={errors} />
      ))}

      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        Continue
      </button>
    </form>
  );
});

export default DynamicForm;

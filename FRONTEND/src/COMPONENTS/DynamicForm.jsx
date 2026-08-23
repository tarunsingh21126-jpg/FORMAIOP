import { useForm } from "react-hook-form";

function DynamicForm({ schema, onSubmitSuccess }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);

    if (onSubmitSuccess) {
      onSubmitSuccess(data);
    }
  };

  const isFieldVisible = (field) => {
    if (!field.visibleWhen) {
      return true;
    }

    const {
      field: dependentField,
      operator,
      value,
    } = field.visibleWhen;

    const dependentValue = watch(dependentField);

    switch (operator) {
      case "equals":
        return dependentValue === value;

      case "notEquals":
        return dependentValue !== value;

      case "greaterThan":
        return Number(dependentValue) > Number(value);

      case "lessThan":
        return Number(dependentValue) < Number(value);

      default:
        return true;
    }
  };

  if (!schema || !Array.isArray(schema.fields)) {
    return <p>No form schema provided.</p>;
  }

  return (
    <form
      className="dynamic-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {schema.fields.map((field) => {
        if (!isFieldVisible(field)) {
          return null;
        }

        const validationRules = {
          required: field.required
            ? `${field.label} is required`
            : false,

          min:
            field.min !== undefined
              ? {
                  value: field.min,
                  message: `${field.label} must be at least ${field.min}`,
                }
              : undefined,

          max:
            field.max !== undefined
              ? {
                  value: field.max,
                  message: `${field.label} must not exceed ${field.max}`,
                }
              : undefined,
        };

        const fieldName = field.id || field.name;

        switch (field.type) {
          case "text":
            return (
              <div key={fieldName}>
                <label htmlFor={fieldName}>
                  {field.label}
                </label>

                <br />

                <input
                  id={fieldName}
                  type="text"
                  {...register(fieldName, validationRules)}
                />

                {errors[fieldName] && (
                  <p>
                    {errors[fieldName].message}
                  </p>
                )}
              </div>
            );

          case "textarea":
            return (
              <div key={fieldName}>
                <label htmlFor={fieldName}>
                  {field.label}
                </label>

                <br />

                <textarea
                  id={fieldName}
                  {...register(
                    fieldName,
                    validationRules
                  )}
                />

                {errors[fieldName] && (
                  <p>
                    {errors[fieldName].message}
                  </p>
                )}
              </div>
            );

          case "number":
            return (
              <div key={fieldName}>
                <label htmlFor={fieldName}>
                  {field.label}
                </label>

                <br />

                <input
                  id={fieldName}
                  type="number"
                  {...register(fieldName, {
                    ...validationRules,
                    valueAsNumber: true,
                  })}
                />

                {errors[fieldName] && (
                  <p>
                    {errors[fieldName].message}
                  </p>
                )}
              </div>
            );

          case "date":
            return (
              <div key={fieldName}>
                <label htmlFor={fieldName}>
                  {field.label}
                </label>

                <br />

                <input
                  id={fieldName}
                  type="date"
                  {...register(
                    fieldName,
                    validationRules
                  )}
                />

                {errors[fieldName] && (
                  <p>
                    {errors[fieldName].message}
                  </p>
                )}
              </div>
            );

          default:
            return null;
        }
      })}

      <br />

      <button type="submit">
        Submit
      </button>
    </form>
  );
}

export default DynamicForm;
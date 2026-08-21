import { useForm } from "react-hook-form";

function DynamicForm({ schema }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert("Form submitted successfully!");
  };

  const isFieldVisible = (field) => {
    if (!field.visibleWhen) {
      return true;
    }

    const { field: dependentField, operator, value } = field.visibleWhen;
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

  if (!schema) {
    return <p>No form schema provided.</p>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {schema.map((field) => {
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

        switch (field.type) {
          case "text":
            return (
              <div key={field.name}>
                <label>{field.label}</label>
                <br />

                <input
                  type="text"
                  {...register(field.name, validationRules)}
                />

                {errors[field.name] && (
                  <p>{errors[field.name].message}</p>
                )}
              </div>
            );

          case "textarea":
            return (
              <div key={field.name}>
                <label>{field.label}</label>
                <br />

                <textarea
                  {...register(field.name, validationRules)}
                />

                {errors[field.name] && (
                  <p>{errors[field.name].message}</p>
                )}
              </div>
            );

          case "number":
            return (
              <div key={field.name}>
                <label>{field.label}</label>
                <br />

                <input
                  type="number"
                  {...register(field.name, {
                    ...validationRules,
                    valueAsNumber: true,
                  })}
                />

                {errors[field.name] && (
                  <p>{errors[field.name].message}</p>
                )}
              </div>
            );

          case "date":
            return (
              <div key={field.name}>
                <label>{field.label}</label>
                <br />

                <input
                  type="date"
                  {...register(field.name, validationRules)}
                />

                {errors[field.name] && (
                  <p>{errors[field.name].message}</p>
                )}
              </div>
            );

          default:
            return null;
        }
      })}

      <br />

      <button type="submit">Submit</button>
    </form>
  );
}

export default DynamicForm;
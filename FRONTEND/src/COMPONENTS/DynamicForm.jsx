import { useForm } from "react-hook-form";

function DynamicForm({ schema }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
    alert("Form submitted successfully!");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {schema.map((field) => {
        const validationRules = {
          required: field.required
            ? `${field.label} is required`
            : false,
        };

        switch (field.type) {
          case "text":
            return (
              <div key={field.name}>
                <label>{field.label}</label>

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

                <input
                  type="number"
                  {...register(field.name, validationRules)}
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

      <button type="submit">Submit</button>
    </form>
  );
}

export default DynamicForm;
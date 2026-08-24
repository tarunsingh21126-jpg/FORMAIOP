import { useForm } from "react-hook-form";
import DynamicField from "./DynamicField";

function DynamicForm({ schema, onSubmitSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);

    if (onSubmitSuccess) {
      onSubmitSuccess(data);
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
      {schema.fields.map((field) => (
        <DynamicField
          key={field.id}
          field={field}
          register={register}
          errors={errors}
        />
      ))}

      <button type="submit">
        Submit
      </button>
    </form>
  );
}

export default DynamicForm;
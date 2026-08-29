export default function CheckboxField({ field, register }) {
  return (
    <div className="form-field checkbox-field">
      <label className="checkbox-label">
        <input type="checkbox" {...register(field.name)} />
        {field.label}
      </label>
    </div>
  );
}

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import DynamicField from './DynamicField.jsx';
import { isFieldVisible } from '../utils/conditionEngine.js';

function buildDefaultValues(fields) {
  return Object.fromEntries(fields.map((field) => [field.id, field.type === 'checkbox' ? false : '']));
}

export default function DynamicForm({ schema, apiBaseUrl, onSubmitSuccess }) {
  const [aiText, setAiText] = useState('');
  const [aiState, setAiState] = useState('idle');
  const [aiError, setAiError] = useState('');
  const [extractedFields, setExtractedFields] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: buildDefaultValues(schema.fields),
    mode: 'onBlur',
    shouldUnregister: true,
  });

  const liveValues = watch();
  const visibleFields = schema.fields.filter((field) => isFieldVisible(field, liveValues));

  async function fillWithAI() {
    if (!aiText.trim()) {
      setAiState('error');
      setAiError('Describe the incident before asking AI to fill the form.');
      return;
    }

    setAiState('loading');
    setAiError('');
    try {
      const response = await fetch(`${apiBaseUrl}/ai/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formId: schema.formId, text: aiText.trim() }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.success) throw new Error(payload.error || `AI request failed (${response.status})`);

      const extracted = payload.data || {};
      const validIds = new Set(schema.fields.map((field) => field.id));
      const applied = [];

      for (const [id, value] of Object.entries(extracted)) {
        if (!validIds.has(id)) continue;
        const field = schema.fields.find((item) => item.id === id);
        let nextValue = value;
        if (field.type === 'number' && typeof value === 'string') nextValue = Number(value);
        if (field.type === 'select') nextValue = String(value);
        setValue(id, nextValue, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
        clearErrors(id);
        applied.push(id);
      }

      setExtractedFields(applied);
      setAiState('success');
      if (!applied.length) setAiError('AI could not confidently extract any fields from that description.');
    } catch (error) {
      setAiState('error');
      setAiError(error.message || 'AI extraction failed.');
    }
  }

  const onSubmit = (values) => {
    const visibleIds = new Set(schema.fields.filter((field) => isFieldVisible(field, values)).map((field) => field.id));
    const cleanedValues = Object.fromEntries(Object.entries(values).filter(([id]) => visibleIds.has(id)));
    onSubmitSuccess(cleanedValues);
  };

  return (
    <div className="form-layout">
      <section className="magic-card">
        <div className="magic-heading">
          <div className="sparkle">✦</div>
          <div>
            <span className="eyebrow">AI Magic Input</span>
            <h2>Describe your situation</h2>
            <p>Tell us what happened naturally. AI will extract matching details from the live form schema.</p>
          </div>
        </div>
        <textarea
          className="magic-input"
          value={aiText}
          onChange={(event) => { setAiText(event.target.value); if (aiState !== 'loading') setAiState('idle'); setAiError(''); }}
          placeholder="Example: I hit a deer on I-95 yesterday in my Honda. The windshield shattered and nobody was injured."
          rows={5}
          disabled={aiState === 'loading'}
        />
        <div className="character-count">
          {aiText.length}/10000 characters
        </div>
        <div className="magic-actions">
          <button type="button" className="ai-button" onClick={fillWithAI} disabled={aiState === 'loading'}>
            {aiState === 'loading' ? <><span className="mini-spinner" /> Analyzing…</> : <>✦ Fill Form with AI</>}
          </button>
          {aiState === 'success' && extractedFields.length > 0 && <span className="success-text">✓ Filled {extractedFields.length} field{extractedFields.length === 1 ? '' : 's'}</span>}
        </div>
        {aiError && <div className="inline-error" role="alert">{aiError}</div>}
      </section>

      <section className="form-card">
        <div className="form-card-header">
          <div>
            <span className="eyebrow">Dynamic form</span>
            <h2>{schema.title}</h2>
            <p>{schema.description}</p>
          </div>
          <span className="field-count">{visibleFields.length} visible fields</span>
        </div>

        <form className="dynamic-form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {visibleFields.map((field) => (
            <DynamicField key={field.id} field={field} register={register} errors={errors} aiFilled={extractedFields.includes(field.id)} />
          ))}
          <div className="form-footer">
            <span>AI values remain editable and are validated like normal input.</span>
            <button className="primary-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit claim'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

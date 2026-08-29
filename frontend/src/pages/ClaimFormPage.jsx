import { useEffect, useRef, useState } from 'react';
import DynamicForm from '../components/DynamicForm/DynamicForm';
import MagicInput from '../components/MagicInput/MagicInput';
import { getForm } from '../services/formService';

const FORM_ID = 'insurance-claim';

export default function ClaimFormPage() {
  const [schema, setSchema] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [submitted, setSubmitted] = useState(null);
  const formRef = useRef(null);

  useEffect(() => {
    getForm(FORM_ID)
      .then(setSchema)
      .catch(() =>
        setLoadError('Could not load the form. Is the backend running?')
      );
  }, []);

  const handleExtracted = (data) => {
    if (!formRef.current) return;

    Object.entries(data).forEach(([fieldName, value]) => {
      formRef.current.setValue(fieldName, value);
    });
  };

  const handleSubmit = (values) => {
    setSubmitted(values);
    console.log('Form submitted:', values);
  };

  if (loadError) {
    return <div className="page-message error">{loadError}</div>;
  }

  if (!schema) {
    return <div className="page-message">Loading form...</div>;
  }

  return (
    <div
      className="page"
      style={{
        width: '100%',
        minHeight: '100vh',
      }}
    >
      <header
        className="page-header"
        style={{
          width: '90%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <h1>Forma AI</h1>
        <p className="page-subtitle">{schema.title}</p>
      </header>

      <main
        className="page-content"
        style={{
          width: '90%',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <MagicInput
          formId={FORM_ID}
          onExtracted={handleExtracted}
        />

        <DynamicForm
          ref={formRef}
          schema={schema}
          onSubmit={handleSubmit}
        />

        {submitted && (
          <div className="submitted-preview">
            <h3>Submitted values</h3>

            <pre>
              {JSON.stringify(submitted, null, 2)}
            </pre>
          </div>
        )}
      </main>
    </div>
  );
}
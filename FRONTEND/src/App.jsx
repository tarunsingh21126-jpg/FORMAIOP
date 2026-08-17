import { useEffect, useState } from 'react';
import DynamicForm from './components/DynamicForm.jsx';
import './App.css';
import 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Which form this Week 1 demo loads. Nothing about its fields is
// hardcoded anywhere else - only this id, used to fetch the schema.
const FORM_ID = 'insurance-claim';

export default function App() {
  const [schema, setSchema] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [submittedValues, setSubmittedValues] = useState(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadSchema() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response = await fetch(`${API_BASE_URL}/forms/${FORM_ID}`);
        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(payload.error || `Request failed with status ${response.status}`);
        }

        if (!cancelled) {
          setSchema(payload.data);
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadSchema();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleSubmitSuccess(values) {
    setSubmittedValues(values);
  }

  function handleStartOver() {
    setSubmittedValues(null);
    setFormKey((key) => key + 1); // remounts DynamicForm with fresh defaults
  }

  return (
    <div className="page">
      <main className="card">
        {isLoading && <p className="status-message">Loading form...</p>}

        {!isLoading && loadError && (
          <div className="status-message status-message--error">
            <p>Couldn't load the form: {loadError}</p>
            <p className="hint">
              Make sure the backend is running and the sample form has been seeded (
              <code>npm run seed</code> in <code>backend/</code>).
            </p>
          </div>
        )}

        {!isLoading && !loadError && schema && !submittedValues && (
          <>
            <header className="card-header">
              <h1>{schema.title}</h1>
              {schema.description && <p>{schema.description}</p>}
            </header>
            <DynamicForm key={formKey} schema={schema} onSubmitSuccess={handleSubmitSuccess} />
          </>
        )}

        {submittedValues && (
          <section className="submission-summary">
            <h2>Claim submitted</h2>
            <p>Here's what was sent:</p>
            <dl>
              {Object.entries(submittedValues).map(([id, value]) => (
                <div className="summary-row" key={id}>
                  <dt>{id}</dt>
                  <dd>{formatValue(value)}</dd>
                </div>
              ))}
            </dl>
            <button type="button" onClick={handleStartOver}>
              Submit another claim
            </button>
          </section>
        )}
      </main>
    </div>
  );
}

function formatValue(value) {
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (value === '' || value === undefined || value === null) return '—';
  return String(value);
}

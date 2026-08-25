import { useEffect, useState } from 'react';
import './App.css';
import DynamicForm from './components/DynamicForm.jsx';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const FORM_ID = 'insurance-claim';

const LOCAL_FORM_SCHEMA = {
  formId: FORM_ID,
  title: 'Insurance Claim',
  description:
    'Tell us what happened and provide the details needed to process your claim.',
  fields: [
    {
      id: 'fullName',
      type: 'text',
      label: 'Full Name',
      placeholder: 'Enter your full name',
      validation: {
        required: true,
      },
    },
    {
      id: 'incidentType',
      type: 'select',
      label: 'Incident Type',
      options: [
        { value: 'accident', label: 'Accident' },
        { value: 'theft', label: 'Theft' },
        { value: 'weather', label: 'Weather Damage' },
        { value: 'other', label: 'Other' },
      ],
      validation: {
        required: true,
      },
    },
    {
      id: 'age',
      type: 'number',
      label: 'Age',
      placeholder: 'Enter your age',
      validation: {
        required: true,
        min: 18,
        max: 100,
      },
    },
    {
      id: 'birthDate',
      type: 'date',
      label: 'Birth Date',
      validation: {
        required: true,
      },
    },
    {
      id: 'message',
      type: 'textarea',
      label: 'Describe the incident',
      placeholder: 'Describe what happened...',
      validation: {
        required: true,
        minLength: 10,
      },
    },
    {
      id: 'injuries',
      type: 'checkbox',
      label: 'Were there any injuries?',
      validation: {
        required: false,
      },
    },
    {
      id: 'injuryDetails',
      type: 'textarea',
      label: 'Describe the injuries',
      placeholder: 'Provide injury details...',
      visibleWhen: {
        field: 'injuries',
        operator: 'equals',
        value: true,
      },
      validation: {
        required: true,
      },
    },
  ],
};

export default function App() {
  const [schema, setSchema] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [submittedValues, setSubmittedValues] = useState(null);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function loadSchema() {
      setIsLoading(true);
      setLoadError('');

      try {
        const response = await fetch(
          `${API_BASE_URL}/forms/${FORM_ID}`,
          {
            signal: controller.signal,
          }
        );

        const payload = await response.json();

        if (!response.ok || !payload.success) {
          throw new Error(
            payload.error || `Request failed (${response.status})`
          );
        }

        setSchema(payload.data);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.warn(
            'Backend unavailable. Using local form schema.',
            error
          );

          setSchema(LOCAL_FORM_SCHEMA);
          setLoadError('');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadSchema();

    return () => controller.abort();
  }, []);

  if (isLoading) {
    return (
      <main className="page">
        <section className="app-shell">
          <div className="loading-card">
            <div className="spinner" />
            <h2>Loading FormAI</h2>
            <p>Loading the dynamic insurance form...</p>
          </div>
        </section>
      </main>
    );
  }

  if (!schema) {
    return (
      <main className="page">
        <section className="app-shell">
          <div className="error-card">
            <span className="eyebrow">FormAI</span>
            <h1>Unable to load the form</h1>
            <p>
              {loadError ||
                'The form schema could not be loaded.'}
            </p>

            <button
              className="primary-button"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="app-shell">
        <header className="hero">
          <div>
            <span className="eyebrow">
              FormAI · InsurTech workflow automation
            </span>

            <h1>AI-powered claim intake</h1>

            <p>
              Describe what happened in your own words.
              FormAI extracts the details and reveals only
              the questions that matter.
            </p>
          </div>

          <div className="hero-badge">
            Live dynamic schema
          </div>
        </header>

        {!submittedValues ? (
          <DynamicForm
            key={formKey}
            schema={schema}
            apiBaseUrl={API_BASE_URL}
            onSubmitSuccess={setSubmittedValues}
          />
        ) : (
          <section className="submission-card">
            <div className="success-icon">✓</div>

            <span className="eyebrow">
              Submission ready
            </span>

            <h2>Claim details captured</h2>

            <p>
              Review the values that were submitted by the
              dynamic form.
            </p>

            <dl className="summary-grid">
              {Object.entries(submittedValues).map(
                ([id, value]) => (
                  <div
                    key={id}
                    className="summary-item"
                  >
                    <dt>{id}</dt>
                    <dd>{formatValue(value)}</dd>
                  </div>
                )
              )}
            </dl>

            <button
              className="primary-button"
              onClick={() => {
                setSubmittedValues(null);
                setFormKey((key) => key + 1);
              }}
            >
              Submit another claim
            </button>
          </section>
        )}
      </section>
    </main>
  );
}

function formatValue(value) {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (
    value === '' ||
    value === undefined ||
    value === null
  ) {
    return '—';
  }

  return String(value);
}
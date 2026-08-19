import { useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import DynamicForm from "./COMPONENTS/DynamicForm";
import "./App.css";

function App() {
  const formSchema = {
    title: "Dynamic Form",
    description:
      "Fill out the form below.",
    fields: [
      {
        id: "fullName",
        type: "text",
        label: "Full Name",
        required: true,
      },
      {
        id: "message",
        type: "textarea",
        label: "Message",
        required: true,
      },
      {
        id: "age",
        type: "number",
        label: "Age",
        required: true,
        min: 18,
        max: 100,
      },
      {
        id: "birthDate",
        type: "date",
        label: "Birth Date",
        required: true,
      },
    ],
  };

  const [submittedValues, setSubmittedValues] =
    useState(null);

  const [formKey, setFormKey] = useState(0);

  function handleSubmitSuccess(values) {
    setSubmittedValues(values);
  }

  function handleStartOver() {
    setSubmittedValues(null);
    setFormKey((key) => key + 1);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div className="page">
              <main className="card">
                {!submittedValues ? (
                  <>
                    <header className="card-header">
                      <h1>{formSchema.title}</h1>

                      {formSchema.description && (
                        <p>
                          {formSchema.description}
                        </p>
                      )}
                    </header>

                    <DynamicForm
                      key={formKey}
                      schema={formSchema}
                      onSubmitSuccess={
                        handleSubmitSuccess
                      }
                    />
                  </>
                ) : (
                  <section className="submission-summary">
                    <h2>Form Submitted</h2>

                    <p>
                      Here's what you submitted:
                    </p>

                    <dl>
                      {Object.entries(
                        submittedValues
                      ).map(([id, value]) => (
                        <div
                          className="summary-row"
                          key={id}
                        >
                          <dt>{id}</dt>

                          <dd>
                            {formatValue(value)}
                          </dd>
                        </div>
                      ))}
                    </dl>

                    <button
                      type="button"
                      onClick={handleStartOver}
                    >
                      Submit Another Form
                    </button>
                  </section>
                )}
              </main>
            </div>
          }
        />

        <Route
          path="/dynamic-form"
          element={
            <div className="page">
              <main className="card">
                <header className="card-header">
                  <h1>{formSchema.title}</h1>

                  {formSchema.description && (
                    <p>
                      {formSchema.description}
                    </p>
                  )}
                </header>

                <DynamicForm
                  schema={formSchema}
                  onSubmitSuccess={
                    handleSubmitSuccess
                  }
                />
              </main>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

function formatValue(value) {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (
    value === "" ||
    value === undefined ||
    value === null
  ) {
    return "—";
  }

  return String(value);
}

export default App;
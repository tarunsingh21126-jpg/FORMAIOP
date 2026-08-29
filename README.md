<<<<<<< HEAD
# Forma AI — AI-Augmented Dynamic Form Engine

Week 1 & Week 2 implementation: a schema-driven dynamic form renderer, plus an AI "Magic Input" that extracts structured data from free text and auto-fills the form.

## What's included

- **Week 1** — MongoDB-backed form schemas, conditional branching (`showIf`), a fully schema-driven React form (`DynamicForm`), React Hook Form validation, and an 18-question seeded insurance claim form.
- **Week 2** — `MagicInput` component, a schema-aware LangChain extraction service, backend validation that strips any field the AI wasn't authorized to return, and auto-fill into the same form via `setValue()`.

No auth, payments, deployment config, analytics, or save/resume — intentionally out of scope for Week 1/2, per the project brief.

## Prerequisites

- Node.js 18+
- A running MongoDB instance (local `mongod`, or a MongoDB Atlas connection string)
- An OpenAI API key (or swap the provider — see below)
=======
# FormAI — AI-Augmented Dynamic Form Engine

FormAI is a schema-driven dynamic form platform for **InsurTech & workflow automation**. It combines MongoDB-powered form schemas, React Hook Form, generic conditional logic, and LangChain + an LLM to turn natural-language incident descriptions into editable form values.

## What is implemented

### Week 1 — Dynamic Form Engine

- MongoDB/Mongoose is the source of truth for form schemas.
- Dynamic field renderer supports `text`, `email`, `number`, `textarea`, `select`, and `checkbox`.
- Validation rules come from the backend schema: required, min/max, minLength/maxLength, regex/pattern, and messages.
- Generic `showIf` engine supports `equals` and `notEquals` without field-specific branching code.
- Insurance claim demo contains multiple conditional branches.
- Backend endpoint: `GET /api/forms/:formId`.

### Week 2 — AI Integration

- LangChain + `@langchain/openai` integration in the Node.js backend.
- Schema-aware extraction: the current MongoDB form schema is sent to the LLM.
- Strict JSON extraction with server-side filtering/type validation.
- Backend endpoint: `POST /api/ai/extract`.
- AI Magic Input in the React UI.
- Loading, success, empty-input, and error states.
- AI results automatically populate React Hook Form and remain editable.
- Conditional questions react to AI-populated values.
- API keys stay on the backend and are loaded from environment variables.

## Architecture

```text
Natural-language input
        ↓
React Magic Input
        ↓
POST /api/ai/extract
        ↓
Express Controller
        ↓
MongoDB Form Schema ──────┐
        ↓                  │
LangChain + LLM           │
        ↓                  │
Strict JSON + validation  │
        └───────────────→ React Hook Form
                              ↓
                        showIf engine
                              ↓
                       Dynamic questions
```

## Project structure

```text
FORMAIOP-main/
├── BACKEND/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── seed/
│   │   ├── services/
│   │   ├── tests/
│   │   └── validation/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── FRONTEND/
│   ├── src/
│   │   ├── components/
│   │   └── utils/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Requirements

- Node.js 18+
- MongoDB 6+ (local or MongoDB Atlas)
- OpenAI API key for live AI extraction
>>>>>>> c36a96c96808336215902ba0e144d0ba32d6a1d0

## 1. Backend setup

```bash
<<<<<<< HEAD
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
MONGODB_URI=mongodb://localhost:27017/forma-ai
PORT=5000
LLM_PROVIDER=openai
LLM_API_KEY=sk-...your key...
LLM_MODEL=gpt-4o-mini
```

Seed the sample insurance claim form (18 questions, with branching):
=======
cd BACKEND
npm install
```

Create `BACKEND/.env` from `.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/formai
CORS_ORIGIN=http://localhost:5173
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_TIMEOUT_MS=30000
```

`MONGO_URI` is also accepted as an alternative to `MONGODB_URI`.

Seed the insurance form:
>>>>>>> c36a96c96808336215902ba0e144d0ba32d6a1d0

```bash
npm run seed
```

<<<<<<< HEAD
You should see: `Seeded "insurance-claim" with 18 fields`

=======
>>>>>>> c36a96c96808336215902ba0e144d0ba32d6a1d0
Start the backend:

```bash
npm run dev
```

<<<<<<< HEAD
Visit `http://localhost:5000/api/health` — should return `{"status":"ok"}`.

## 2. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`. The dev server proxies `/api` requests to the backend on port 5000 (configured in `vite.config.js`), so no CORS setup is needed locally.

## 3. Testing Week 1 (dynamic form + branching)

1. Confirm the form renders with all top-level questions (injury/other-vehicle/police-report follow-ups should be hidden initially).
2. Check "Was anyone injured?" → the "Describe the injury" field should appear immediately, with no page reload.
3. Try submitting with required fields empty → inline validation errors should appear under each field.
4. Fill everything and submit → a "Submitted values" JSON preview appears below the form.

To verify nothing is hard-coded: edit a field's `label` or add a new field directly in MongoDB (or via `PUT /api/forms/insurance-claim`), refresh the page, and confirm the new label / field appears without any frontend code changes.

## 4. Testing Week 2 (Magic Input / AI extraction)

1. In the "✨ Describe what happened" box, enter something like:
   > I hit a deer on I-95 yesterday in my Honda Civic. The windshield shattered. No one was injured.
2. Click **✨ Extract Information**. The button should show "Analyzing your description..." while loading.
3. On success, you should see "✓ Information extracted successfully", and fields like Incident Type, Vehicle Make, Vehicle Model, and Damage Type should populate automatically.
4. Manually edit any AI-filled field to confirm it's still a normal, editable input.
5. To test failure handling: temporarily set an invalid `LLM_API_KEY` in `.env`, restart the backend, and retry extraction. You should see "Unable to extract information. Please fill the form manually." — and the rest of the form should still work normally.

## Switching the LLM provider

All provider-specific logic lives in `backend/services/aiService.js`, inside `getChatModel()`. To add a new provider:

1. Install its LangChain package (e.g. `@langchain/anthropic`).
2. Add a `case` in the `switch` statement for the new `LLM_PROVIDER` value.
3. Update `.env` — no other file needs to change.

## API reference

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/forms/:formId` | Fetch a form schema |
| POST | `/api/forms` | Create a form schema |
| PUT | `/api/forms/:formId` | Update a form schema |
| DELETE | `/api/forms/:formId` | Delete a form schema |
| POST | `/api/ai/extract` | `{ formId, text }` → schema-validated structured JSON |

## Common errors & fixes

| Symptom | Fix |
|---|---|
| `MongoDB connection error` on backend start | Make sure MongoDB is running and `MONGODB_URI` in `.env` is correct |
| Frontend shows "Could not load the form" | Backend isn't running, or you haven't run `npm run seed` yet |
| Extraction always fails | Check `LLM_API_KEY` is valid and `LLM_MODEL` is a real model name for your provider |
| `LLM did not return valid JSON` in backend logs | Some models add commentary despite instructions — the prompt in `aiService.js` already strips markdown fences; if it persists, try lowering `temperature` further or switching models |
| New field added to schema doesn't appear in the form | Hard refresh — the frontend re-fetches the schema on page load only, there's no live subscription (out of scope for Week 1/2) |

## What's next (Week 3 / Week 4 — not implemented here)

Per the brief, this build stops after Week 2. Later phases (not included): connecting extracted JSON confidence indicators, client-side validation UI polish, save/resume, and deployment.
=======
or:

```bash
npm start
```

Backend URL:

```text
http://localhost:5000
```

Health check:

```text
GET http://localhost:5000/api/health
```

## 2. Frontend setup

Open another terminal:

```bash
cd FRONTEND
npm install
```

Create `FRONTEND/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

## API

### Get a form schema

```http
GET /api/forms/insurance-claim
```

### AI extraction

```http
POST /api/ai/extract
Content-Type: application/json
```

Example body:

```json
{
  "formId": "insurance-claim",
  "text": "I hit a deer on I-95 yesterday in my Honda. The windshield shattered and nobody was injured."
}
```

Example response shape:

```json
{
  "success": true,
  "data": {
    "vehicleModel": "Honda",
    "incidentDescription": "I hit a deer on I-95 yesterday in my Honda.",
    "windshieldDamage": true,
    "damageType": "collision",
    "injuries": false
  }
}
```

The exact extracted fields depend on what the LLM can confidently map to the live MongoDB schema.

## Demo flow

1. Start MongoDB.
2. Run `npm run seed` in `BACKEND`.
3. Start the backend.
4. Start the frontend.
5. Open the insurance claim form.
6. In **AI Magic Input**, enter:

```text
I hit a deer on I-95 yesterday in my Honda. The windshield shattered. It was a collision and nobody was injured.
```

7. Click **Fill Form with AI**.
8. Review/edit the AI-populated values.
9. The collision question appears automatically because the form schema says `damageType = collision`.
10. The injury question remains hidden when `injuries = false`.
11. Submit the completed form.

## Testing

Frontend condition-engine tests:

```bash
cd FRONTEND
npm test
```

Backend tests:

```bash
cd BACKEND
npm test
```

The AI integration itself requires a valid `OPENAI_API_KEY` for a live LLM call. Unit tests should mock the model where a live API call is not appropriate.

## Important security notes

- Never put `OPENAI_API_KEY` in the React frontend.
- Never commit `.env` files containing secrets.
- Only `.env.example` files should be committed.
- The backend filters AI output against the MongoDB schema before returning it to the frontend.
- Unknown AI fields are discarded.

## Definition of done

The project is intended to satisfy the Week 1 and Week 2 requirements:

- [x] MongoDB dynamic form schema
- [x] Dynamic React renderer
- [x] React Hook Form
- [x] Schema-driven validation
- [x] Generic conditional rendering
- [x] Insurance claim example
- [x] LangChain integration
- [x] Schema-aware LLM extraction
- [x] Strict JSON parsing and server-side filtering
- [x] AI Magic Input
- [x] AI loading/error/success states
- [x] Automatic form population
- [x] Editable AI values
- [x] AI-triggered conditional rendering
- [x] Environment configuration
- [x] Backend/frontend separation

## Note about dependencies

The source tree intentionally does not include `node_modules`. Run `npm install` separately in `BACKEND` and `FRONTEND` after extracting the project so npm generates fresh lockfiles for the installed environment.
>>>>>>> c36a96c96808336215902ba0e144d0ba32d6a1d0

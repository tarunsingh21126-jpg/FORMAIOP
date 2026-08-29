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

## 1. Backend setup

```bash
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

```bash
npm run seed
```

You should see: `Seeded "insurance-claim" with 18 fields`

Start the backend:

```bash
npm run dev
```

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

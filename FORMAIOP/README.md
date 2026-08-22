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

## 1. Backend setup

```bash
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

```bash
npm run seed
```

Start the backend:

```bash
npm run dev
```

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

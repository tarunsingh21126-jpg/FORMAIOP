🚀 FormAI — AI-Augmented Dynamic Form Engine

FormAI is an AI-powered dynamic form engine designed for complex workflows such as Insurance, Healthcare, and Enterprise applications.

Instead of forcing users to manually answer dozens of questions, FormAI allows users to describe their situation in natural language. The AI extracts relevant information and automatically fills the corresponding form fields.

The application combines:

- React
- React Hook Form
- Node.js
- Express.js
- MongoDB
- LangChain
- LLM-based information extraction
- Dynamic JSON-driven forms
- Conditional form rendering

---

📌 Problem Statement

Large organizations often use complex forms containing 50+ questions with conditional branching.

For example:

«If Question 12 = "Yes", show Questions 13–20.»

Building and maintaining these forms manually in React can become difficult, especially when the form contains hundreds of fields and deeply nested conditional logic.

FormAI solves this problem by storing the form structure and business rules in MongoDB and dynamically generating the frontend form from the backend schema.

It also uses AI to understand unstructured user input and convert it into structured form data.

---

✨ Key Features

Week 1 — Dynamic Form Engine

🔹 Dynamic Form Rendering

Forms are generated dynamically from a JSON schema stored in MongoDB.

Supported field types include:

- Text
- Email
- Number
- Textarea
- Dropdown / Select
- Checkbox

No need to hardcode every question in React.

---

🔹 React Hook Form Integration

Form state and validation are managed using React Hook Form.

This provides:

- Efficient form state management
- Field validation
- Error handling
- Dynamic field registration
- Programmatic field updates

---

🔹 Dynamic Validation

Validation rules are defined in the backend schema.

Supported validation rules include:

- Required
- Minimum value
- Maximum value
- Minimum length
- Maximum length
- Regular expressions
- Custom validation messages

Example:

{
  "id": "email",
  "type": "email",
  "label": "Email",
  "validation": {
    "required": true,
    "pattern": "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
  }
}

---

🔹 Conditional Form Logic

Form fields can dynamically appear or disappear based on previous answers.

Example:

Was the accident a collision?
        |
       Yes
        ↓
Describe the collision

Conditional rules are stored in the form schema rather than hardcoded inside React components.

Supported operators include:

- "equals"
- "notEquals"

---

🔹 MongoDB Schema Store

MongoDB stores:

- Form definitions
- Fields
- Field types
- Options
- Validation rules
- Conditional rules
- Branching logic

This allows the same frontend renderer to support multiple types of forms.

---

🤖 Week 2 — AI Integration

🔹 AI Magic Input

Users can describe their situation using normal language.

Example:

I hit a deer on I-95 yesterday in my Honda.
The windshield shattered and nobody was injured.

Instead of manually answering multiple questions, the AI analyzes the description.

---

🔹 LangChain + LLM

The backend integrates LangChain with an LLM provider.

The AI receives:

1. User's natural-language description
2. Dynamic form schema

The model extracts only information that matches the available form fields.

Example output:

{
  "vehicleModel": "Honda",
  "damageType": "collision",
  "windshieldDamage": true,
  "injuries": false
}

---

🔹 Schema-Aware Extraction

The AI does not use a fixed set of questions.

Instead, the backend provides the current form schema to the AI.

This allows the same extraction engine to work with different forms.

The AI is instructed to:

- Return valid JSON
- Use only fields defined in the schema
- Respect field types
- Respect available options
- Avoid inventing information
- Leave unknown information empty or omitted

---

🔹 Automatic Form Population

After the AI extracts the information, the frontend automatically updates React Hook Form.

For example:

Vehicle Model
[ Honda ]

Damage Type
[ Collision ▼ ]

Injuries
[ No ]

The user can still edit all AI-generated values.

---

🔹 AI + Conditional Rendering

AI extraction automatically triggers the existing conditional form engine.

Example:

AI detects:

damageType = collision

Then:

Collision Details
[________________________]

automatically appears.

This creates a complete flow:

Natural Language
       ↓
      AI
       ↓
Structured JSON
       ↓
React Hook Form
       ↓
Conditional Logic
       ↓
Dynamic Questions

---

🏗️ System Architecture

                   ┌──────────────────────┐
                   │       User           │
                   └──────────┬───────────┘
                              │
                              ↓
                   ┌──────────────────────┐
                   │   AI Magic Input     │
                   │  Natural Language    │
                   └──────────┬───────────┘
                              │
                              ↓
                   ┌──────────────────────┐
                   │     React Frontend   │
                   │   React Hook Form    │
                   └──────────┬───────────┘
                              │
                              ↓
                   ┌──────────────────────┐
                   │   Node.js + Express  │
                   └───────┬───────┬──────┘
                           │       │
                 ┌─────────┘       └─────────┐
                 ↓                           ↓
        ┌─────────────────┐        ┌─────────────────┐
        │    MongoDB      │        │    LangChain    │
        │ Form Schemas    │        │       + LLM     │
        └─────────────────┘        └────────┬────────┘
                                            │
                                            ↓
                                   Structured JSON
                                            │
                                            ↓
                                  React Hook Form
                                            │
                                            ↓
                                   Dynamic Rendering

---

📁 Project Structure

FORMAIOP-main/
│
├── BACKEND/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── validation/
│   │   └── seed/
│   │
│   ├── package.json
│   └── .env
│
├── FRONTEND/
│   ├── src/
│   │   ├── components/
│   │   ├── COMPONENTS/
│   │   ├── utils/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
└── README.md

---

🛠️ Technologies Used

Frontend

- React
- React Hook Form
- JavaScript
- HTML
- CSS

Backend

- Node.js
- Express.js
- Mongoose

Database

- MongoDB

AI

- LangChain
- LLM / OpenAI-compatible model

---

⚙️ Installation

1. Clone the Repository

git clone <your-repository-url>
cd FORMAIOP-main

---

🗄️ Backend Setup

Navigate to the backend:

cd BACKEND

Install dependencies:

npm install

Create a ".env" file:

PORT=5000
MONGO_URI=mongodb://localhost:27017/formai
CORS_ORIGIN=http://localhost:5173
OPENAI_API_KEY=your_api_key_here

Start the backend:

npm run dev

If the project does not have a development script, use:

npm start

The backend should run on:

http://localhost:5000

---

🌐 Frontend Setup

Open another terminal:

cd FRONTEND

Install dependencies:

npm install

Start the frontend:

npm run dev

The frontend will normally be available at:

http://localhost:5173

---

🍃 MongoDB Setup

Make sure MongoDB is running locally or use MongoDB Atlas.

Example local connection:

MONGO_URI=mongodb://localhost:27017/formai

If using MongoDB Atlas:

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>/<database>

After connecting MongoDB, seed the sample insurance form if the project provides a seed script.

Example:

npm run seed

---

🔑 Environment Variables

Variable| Description
"PORT"| Backend server port
"MONGO_URI"| MongoDB connection string
"CORS_ORIGIN"| Frontend URL
"OPENAI_API_KEY"| LLM API key

Never commit ".env" files containing real API keys.

Use ".env.example" for sharing configuration.

---

🔌 API Endpoints

Get Dynamic Form

GET /api/forms/:formId

Example:

GET /api/forms/insurance-claim

Returns the dynamic form schema.

---

AI Extraction

POST /api/ai/extract

Request:

{
  "formId": "insurance-claim",
  "text": "I hit a deer yesterday in my Honda and the windshield shattered."
}

Response:

{
  "vehicleModel": "Honda",
  "damageType": "collision",
  "windshieldDamage": true
}

---

🧪 Example User Flow

Step 1

User opens the insurance claim form.

Step 2

Instead of filling many fields manually, the user enters:

I hit a deer on I-95 yesterday in my Honda.
The windshield shattered and nobody was injured.

Step 3

User clicks:

✨ Fill Form with AI

Step 4

The backend sends the user input and form schema to the LLM.

Step 5

The LLM returns structured JSON.

{
  "vehicleModel": "Honda",
  "damageType": "collision",
  "windshieldDamage": true,
  "injuries": false
}

Step 6

React Hook Form automatically populates the fields.

Step 7

The conditional rendering engine evaluates the values.

Step 8

Relevant questions appear automatically.

Step 9

The user reviews and edits the extracted information.

Step 10

The completed form can be submitted normally.

---

🔐 Security

The project follows basic security practices:

- API keys stored in environment variables
- No API keys exposed in frontend code
- Backend handles LLM communication
- Input validation
- JSON validation
- Error handling
- MongoDB schema validation

Never place the LLM API key directly inside React code.

---

🎯 Project Objectives

FormAI is designed to demonstrate:

- Dynamic UI generation
- Schema-driven forms
- Complex conditional workflows
- React Hook Form
- MongoDB-based configuration
- AI-powered information extraction
- LangChain integration
- Natural-language form filling
- Enterprise workflow automation

---

🚀 Future Enhancements

Possible future improvements include:

- Multi-form support
- More conditional operators
- Nested conditions
- AND/OR rule groups
- Form versioning
- Save and resume
- User authentication
- Role-based access
- Audit logs
- AI confidence scores
- Human review workflow
- Multiple LLM providers
- Local LLM support
- Advanced analytics
- Admin form builder
- Drag-and-drop form creation

---

📚 Week 1 & Week 2 Coverage

Week 1

✅ MongoDB dynamic schema
✅ Dynamic React renderer
✅ React Hook Form
✅ Dynamic validation
✅ Conditional "showIf" logic
✅ Insurance claim form
✅ Backend API
✅ MongoDB integration

Week 2

✅ LangChain integration
✅ LLM-based extraction
✅ Schema-aware AI prompts
✅ Strict JSON extraction
✅ AI Magic Input
✅ Loading state
✅ Automatic React Hook Form population
✅ AI + conditional rendering
✅ Error handling
✅ Human-editable AI results

---

👨‍💻 Project

Project Name: FormAI
Domain: InsurTech & Workflow Automation
Architecture: MERN + LangChain
Frontend: React
Backend: Node.js + Express
Database: MongoDB
AI: LangChain + LLM

---

⭐ Summary

FormAI modernizes traditional enterprise forms by combining dynamic schema-driven rendering with AI-powered natural-language input.

Instead of asking users to navigate a large number of rigid questions, FormAI allows them to describe their situation naturally. The AI converts that description into structured data, automatically fills the form, and dynamically reveals the relevant questions based on business rules.

Natural Language → AI → Structured JSON → Dynamic Form → Conditional Workflow

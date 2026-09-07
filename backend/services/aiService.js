const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');

function getChatModel() {
  const apiKey = process.env.LLM_API_KEY;
  const modelName = process.env.LLM_MODEL || 'gemini-2.5-flash';

  if (!apiKey) {
    throw new Error('LLM_API_KEY is not set in .env');
  }

  return new ChatGoogleGenerativeAI({
    apiKey,
    model: modelName,
    temperature: 0
  });
}
function buildExtractionPrompt(formSchema, userText) {
  const fieldDescriptions = formSchema.fields.map((f) => {
    let description = `- "${f.name}" (${f.type}): ${f.label}`;

    if (f.options && f.options.length) {
      description += `
  EXACT allowed values: ${f.options.map((option) => `"${option}"`).join(', ')}
  IMPORTANT: If selecting this field, return EXACTLY one of these values. Do not change capitalization, spacing, underscores, or wording.`;
    }

    return description;
  });

  const systemPrompt = `You are a strict data extraction engine for a form called "${formSchema.title}".

Extract information from the user's description and return ONLY a single flat JSON object.

FORM FIELDS:
${fieldDescriptions.join('\n')}

STRICT RULES:

1. Return ONLY valid JSON. No explanation, markdown, or code fences.

2. Use ONLY the exact field names listed above.

3. Never invent information.

4. If information is not clearly present, omit the field or use null.

5. SELECT/RADIO FIELDS:
   You MUST return the exact allowed option value.
   Do NOT return the human-readable label if it differs from the allowed value.
   Do NOT capitalize or modify the value.

6. For example, if the allowed values are:
   ["collision", "animal_collision", "theft", "other"]

   and the user says:
   "I collided with another car"

   return:
   {"incidentType":"collision"}

   NOT:
   {"incidentType":"Collision"}

   NOT:
   {"incidentType":"car collision"}

   NOT:
   {"incidentType":"vehicle collision"}

7. For checkbox fields, return true or false.

8. For number fields, return a JSON number.

9. For date fields, return the date in YYYY-MM-DD format whenever the date can be determined.

10. Only extract information actually supported by the user's description.

11. Return one flat JSON object and nothing else.`;

  return [
    new SystemMessage(systemPrompt),
    new HumanMessage(userText)
  ];
}
async function extractStructuredData(formSchema, userText) {
  const model = getChatModel();

  const messages = buildExtractionPrompt(
    formSchema,
    userText
  );

  const response = await model.invoke(messages);

  const rawText =
    typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);

  return parseJsonSafely(rawText);
}

function parseJsonSafely(text) {
  const cleaned = String(text || '')
    .replace(/```(?:json)?/gi, '')
    .replace(/```/g, '')
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {}

  const match = cleaned.match(/\{[\s\S]*\}/);

  if (match) {
    try {
      return JSON.parse(match[0]);
    } catch {}
  }

  throw new Error('LLM did not return valid JSON');
}

module.exports = {
  extractStructuredData
};

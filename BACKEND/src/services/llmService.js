const { ChatOpenAI } = require('@langchain/openai');
const { HumanMessage, SystemMessage } = require('@langchain/core/messages');

function getModel() {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error('OPENAI_API_KEY is not configured. Add it to BACKEND/.env to use AI extraction.');
    error.status = 503;
    throw error;
  }

  return new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0,
    timeout: Number(process.env.OPENAI_TIMEOUT_MS || 30000),
  });
}

function buildExtractionPrompt(form) {
  const schema = form.fields.map((field) => ({
    id: field.id,
    type: field.type,
    label: field.label,
    options: field.options || [],
    validation: field.validation || {},
  }));

  return `You are FormAI, a strict structured information extraction engine.\n\nFORM SCHEMA:\n${JSON.stringify(schema, null, 2)}\n\nRules:\n- Return ONLY one valid JSON object. No markdown, no explanation.\n- Only use field IDs that exist in the supplied form schema.\n- Never invent information that is not stated or strongly implied by the user's text.\n- Respect field types and select options exactly.\n- For boolean checkbox fields, return true or false only when the user's text supports that value. Otherwise omit the field.\n- For select fields, use the option value, not the label.\n- If a value cannot be confidently extracted, omit that field.\n- Do not create extra keys.\n- Preserve useful user wording for text/textarea fields when appropriate.\n\nThe JSON object must contain only extracted fields.`;
}

function parseJsonContent(content) {
  const raw = typeof content === 'string' ? content.trim() : '';
  if (!raw) throw new Error('LLM returned an empty response.');

  try {
    return JSON.parse(raw);
  } catch {
    const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    if (fenced) return JSON.parse(fenced[1]);
    const object = raw.match(/\{[\s\S]*\}/);
    if (object) return JSON.parse(object[0]);
    throw new Error('LLM returned invalid JSON.');
  }
}

function validateExtraction(extracted, form) {
  if (!extracted || typeof extracted !== 'object' || Array.isArray(extracted)) {
    throw new Error('AI extraction must be a JSON object.');
  }

  const fields = new Map(form.fields.map((field) => [field.id, field]));
  const result = {};

  for (const [key, value] of Object.entries(extracted)) {
    const field = fields.get(key);
    if (!field || value === undefined || value === null) continue;

    if (field.type === 'text' || field.type === 'email' || field.type === 'textarea') {
      if (typeof value !== 'string') continue;
    } else if (field.type === 'number') {
      if (typeof value !== 'number' || Number.isNaN(value)) continue;
    } else if (field.type === 'checkbox') {
      if (typeof value !== 'boolean') continue;
    } else if (field.type === 'select') {
      const allowed = (field.options || []).map((option) => String(option.value));
      if (!allowed.includes(String(value))) continue;
    }

    const validation = field.validation || {};
    if (typeof value === 'string') {
      if (validation.minLength !== undefined && value.length < validation.minLength) continue;
      if (validation.maxLength !== undefined && value.length > validation.maxLength) continue;
      if (validation.pattern) {
        let pattern;
        try { pattern = new RegExp(validation.pattern); } catch { continue; }
        if (!pattern.test(value)) continue;
      }
    }
    if (typeof value === 'number') {
      if (validation.min !== undefined && value < validation.min) continue;
      if (validation.max !== undefined && value > validation.max) continue;
    }

    result[key] = value;
  }

  return result;
}

async function extractStructuredData(form, text) {
  const model = getModel();
  const response = await model.invoke([
    new SystemMessage(buildExtractionPrompt(form)),
    new HumanMessage(`Extract data from this user description:\n\n${text}`),
  ]);

  const content = Array.isArray(response.content)
    ? response.content.map((part) => part.text || '').join('')
    : response.content;

  const parsed = parseJsonContent(content);
  return validateExtraction(parsed, form);
}

module.exports = { extractStructuredData, buildExtractionPrompt, validateExtraction };

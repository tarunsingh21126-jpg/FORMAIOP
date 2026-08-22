const formService = require('../services/formService');
const { extractStructuredData } = require('../services/llmService');

async function extractAI(req, res, next) {
  try {
    const { formId, text } = req.body || {};

    if (!formId || typeof formId !== 'string') {
      const error = new Error('formId is required.');
      error.status = 400;
      throw error;
    }

    if (!text || typeof text !== 'string' || !text.trim()) {
      const error = new Error('text is required and must not be empty.');
      error.status = 400;
      throw error;
    }

    if (text.length > 10000) {
      const error = new Error('text must be 10,000 characters or fewer.');
      error.status = 400;
      throw error;
    }

    const form = await formService.getFormByFormId(formId);
    if (!form) {
      const error = new Error(`No form found with id "${formId}"`);
      error.status = 404;
      throw error;
    }

    const data = await extractStructuredData(form, text.trim());

    res.status(200).json({
      success: true,
      data,
      meta: { formId, extractedFields: Object.keys(data).length },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { extractAI };

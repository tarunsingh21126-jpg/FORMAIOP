const formService = require('../services/formService');
const { extractStructuredData } = require('../services/llmService');

function createValidationError(message) {
  const error = new Error(message);
  error.status = 400;
  return error;
}

async function extractAI(req, res, next) {
  try {
    const { formId, text } = req.body || {};

    // Validate formId
    if (typeof formId !== 'string' || !formId.trim()) {
      throw createValidationError('formId is required.');
    }

    const normalizedFormId = formId.trim();

    // Validate text
    if (typeof text !== 'string' || !text.trim()) {
      throw createValidationError(
        'text is required and must not be empty.'
      );
    }

    const normalizedText = text.trim();

    if (normalizedText.length > 10000) {
      throw createValidationError(
        'text must be 10,000 characters or fewer.'
      );
    }

    // Check whether the form exists
    const form = await formService.getFormByFormId(normalizedFormId);

    if (!form) {
      const error = new Error(
        `No form found with id "${normalizedFormId}"`
      );
      error.status = 404;
      throw error;
    }

    // Extract structured data using AI
    const data = await extractStructuredData(
      form,
      normalizedText
    );

    // Ensure a predictable response
    const extractedData = data || {};

    return res.status(200).json({
      success: true,
      data: extractedData,
      meta: {
        formId: normalizedFormId,
        extractedFields: Object.keys(extractedData).length,
      },
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  extractAI,
};

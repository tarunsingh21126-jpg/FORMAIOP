const formService = require('../services/formService');

/**
 * GET /api/forms/:formId
 *
 * Returns the JSON schema for a single dynamic form so the frontend can
 * render it without any form structure being hardcoded in React.
 */
async function getForm(req, res, next) {
  try {
    const { formId } = req.params;

    if (!formId || !formId.trim()) {
      const error = new Error('A formId is required, e.g. /api/forms/insurance-claim');
      error.status = 400;
      throw error;
    }

    const form = await formService.getFormByFormId(formId);

    if (!form) {
      const error = new Error(`No form found with id "${formId}"`);
      error.status = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: formService.toPublicForm(form),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getForm,
};

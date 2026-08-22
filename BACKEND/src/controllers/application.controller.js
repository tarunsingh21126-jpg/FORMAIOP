const applicationService = require('../services/application.service');

/**
 * POST /api/applications
 *
 * Creates the initial application shell for a user and form.
 */
async function createApplication(req, res, next) {
  try {
    const application = await applicationService.createApplication(req.body);

    res.status(201).json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/applications/:applicationId
 *
 * Returns a single application by public id.
 */
async function getApplication(req, res, next) {
  try {
    const application = await applicationService.getApplicationByApplicationId(
      req.params.applicationId
    );

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/applications
 *
 * Lists applications for the supported query filters.
 */
async function listApplications(req, res, next) {
  try {
    const applications = await applicationService.listApplications({
      applicantId: req.query.applicantId,
      formId: req.query.formId,
    });

    res.status(200).json({
      success: true,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createApplication,
  getApplication,
  listApplications,
};

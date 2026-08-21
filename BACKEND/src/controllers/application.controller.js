const applicationService = require('../services/application.service');

/**
 * POST /api/applications
 *
 * Creates the initial application record.
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
 * Returns a single application by id.
 */
async function getApplication(req, res, next) {
  try {
    const application = await applicationService.getApplication(req.params.applicationId);

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/applications/:applicationId
 *
 * Applies a partial update to an application.
 */
async function updateApplication(req, res, next) {
  try {
    const application = await applicationService.updateApplication(
      req.params.applicationId,
      req.body
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
 * DELETE /api/applications/:applicationId
 *
 * Deletes an application by id.
 */
async function deleteApplication(req, res, next) {
  try {
    const application = await applicationService.deleteApplication(req.params.applicationId);

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createApplication,
  getApplication,
  updateApplication,
  deleteApplication,
};

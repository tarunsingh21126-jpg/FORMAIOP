const express = require('express');

const applicationController = require('../controllers/application.controller');
const {
  validateCreateApplication,
  validateUpdateApplication,
  validateApplicationIdParam,
} = require('../validation/application.validation');

const router = express.Router();

router.post('/', validateCreateApplication, applicationController.createApplication);
router.get('/:applicationId', validateApplicationIdParam, applicationController.getApplication);
router.put(
  '/:applicationId',
  validateApplicationIdParam,
  validateUpdateApplication,
  applicationController.updateApplication
);
router.delete(
  '/:applicationId',
  validateApplicationIdParam,
  applicationController.deleteApplication
);

module.exports = router;

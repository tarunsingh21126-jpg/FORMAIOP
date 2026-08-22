const express = require('express');

const applicationController = require('../controllers/application.controller');
const {
  validateCreateApplication,
  validateApplicationIdParam,
  validateApplicationListQuery,
} = require('../validation/application.validation');

const router = express.Router();

router.get('/', validateApplicationListQuery, applicationController.listApplications);
router.post('/', validateCreateApplication, applicationController.createApplication);
router.get(
  '/:applicationId',
  validateApplicationIdParam,
  applicationController.getApplication
);

module.exports = router;

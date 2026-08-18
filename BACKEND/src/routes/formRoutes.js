const express = require('express');

const { getForm } = require('../controllers/formControllers');

const router = express.Router();

router.get('/:formId', getForm);

module.exports = router;

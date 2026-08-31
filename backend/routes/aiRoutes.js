const express = require('express');
const { extractFromText } = require('../controllers/aiController');

const router = express.Router();

router.post('/extract', extractFromText);

module.exports = router;

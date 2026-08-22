const express = require('express');
const { extractAI } = require('../controllers/aiController');

const router = express.Router();
router.post('/extract', extractAI);

module.exports = router;

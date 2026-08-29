const express = require('express');
const { getForm, createForm, updateForm, deleteForm } = require('../controllers/formController');

const router = express.Router();

router.get('/:formId', getForm);
router.post('/', createForm);
router.put('/:formId', updateForm);
router.delete('/:formId', deleteForm);

module.exports = router;

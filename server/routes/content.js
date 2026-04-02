const express = require('express');
const router = express.Router();
const { generate } = require('../controllers/content');

router.post('/generate', generate);

module.exports = router;
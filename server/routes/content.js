const express = require('express');
const router = express.Router();
const { generate, editContent } = require('../controllers/content');

router.post('/generate', generate);
router.post('/edit', editContent);

module.exports = router;
const express = require('express');
const router = express.Router();
const { getFeedback, downloadFeedback } = require('../controllers/feedback');

router.get('/:platform', getFeedback);
router.get('/:platform/download', downloadFeedback);

module.exports = router;
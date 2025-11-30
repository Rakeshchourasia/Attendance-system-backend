const express = require('express');
const router = express.Router();
const { registerVisitor, getVisitors, scanVisitor } = require('../controllers/visitorController');

router.post('/', registerVisitor);
router.get('/', getVisitors);
router.post('/scan', scanVisitor);

module.exports = router;
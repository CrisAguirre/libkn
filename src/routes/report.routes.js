const router = require('express').Router();
const ctrl = require('../controllers/report.controller');
const authMiddleware = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.get('/sales-summary', authMiddleware, role('admin'), ctrl.salesSummary);
router.get('/top-products', authMiddleware, role('admin'), ctrl.topProducts);
router.get('/low-rotation', authMiddleware, role('admin'), ctrl.lowRotation);

module.exports = router;

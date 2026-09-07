const router = require('express').Router();
const ctrl = require('../controllers/scanner.controller');
const authMiddleware = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.get('/status', authMiddleware, ctrl.getScannerStatus);
router.get('/inventory', authMiddleware, ctrl.listInventoryAssets);
router.post('/start', authMiddleware, role('admin'), ctrl.startScanner);
router.post('/stop', authMiddleware, role('admin'), ctrl.stopScanner);
router.post('/scan', authMiddleware, ctrl.scanImage);
router.post('/scan-update', authMiddleware, role('admin', 'operador'), ctrl.scanAndUpdateInventory);

module.exports = router;

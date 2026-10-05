const router = require('express').Router();
const multer = require('multer');
const ctrl = require('../controllers/scanner.controller');
const authMiddleware = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.get('/status', authMiddleware, ctrl.getScannerStatus);
router.get('/inventory', authMiddleware, ctrl.listInventoryAssets);
router.post('/start', authMiddleware, role('admin'), ctrl.startScanner);
router.post('/stop', authMiddleware, role('admin'), ctrl.stopScanner);
router.post('/scan', authMiddleware, ctrl.scanImage);
router.post('/scan-auto', authMiddleware, ctrl.scanAuto);
router.post('/zone-session', authMiddleware, ctrl.scanZoneSession);
router.get('/zones-report', authMiddleware, ctrl.getZonesReport);
router.post('/scan-update', authMiddleware, role('admin', 'operador'), ctrl.scanAndUpdateInventory);
router.post('/reference/:productId', authMiddleware, role('admin', 'operador'), upload.single('image'), ctrl.uploadReference);

module.exports = router;

const router = require('express').Router();
const ctrl = require('../controllers/cashClosing.controller');
const authMiddleware = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.post('/open', authMiddleware, role('admin', 'cajero', 'operador'), ctrl.open);
router.put('/:id/close', authMiddleware, role('admin', 'cajero', 'operador'), ctrl.close);
router.get('/', authMiddleware, role('admin'), ctrl.getAll);
router.get('/current', authMiddleware, role('admin', 'cajero', 'operador'), ctrl.getCurrent);

module.exports = router;

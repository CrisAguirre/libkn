const Supplier = require('../models/Supplier');

// GET /api/suppliers
exports.getAll = async (req, res, next) => {
  try {
    const { search, active } = req.query;
    const filter = {};
    if (active !== undefined) filter.isActive = active === 'true';
    if (search) filter.$text = { $search: search };

    const suppliers = await Supplier.find(filter).sort({ name: 1 });
    res.json(suppliers);
  } catch (err) { next(err); }
};

// GET /api/suppliers/:id
exports.getOne = async (req, res, next) => {
  try {
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json(supplier);
  } catch (err) { next(err); }
};

// POST /api/suppliers
exports.create = async (req, res, next) => {
  try {
    const supplier = new Supplier(req.body);
    await supplier.save();
    res.status(201).json(supplier);
  } catch (err) { next(err); }
};

// PUT /api/suppliers/:id
exports.update = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!supplier) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json(supplier);
  } catch (err) { next(err); }
};

// DELETE /api/suppliers/:id  (soft-delete)
exports.remove = async (req, res, next) => {
  try {
    const supplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!supplier) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json({ message: 'Proveedor desactivado', supplier });
  } catch (err) { next(err); }
};

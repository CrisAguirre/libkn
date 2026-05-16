const Supplier = require('../models/Supplier');

// GET /api/suppliers
exports.getAll = async (req, res, next) => {
  try {
    const { search, active } = req.query;
    const filter = {};
    if (active !== undefined) filter.isActive = active === 'true';
    if (search) filter.$text = { $search: search };

    const suppliers = await Supplier.find(filter).populate('categories', 'name icon code').sort({ name: 1 });
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
    // Auto-generate supplier code (2 digits, sequential)
    const lastSupplier = await Supplier.findOne({ code: { $exists: true, $ne: '' } })
      .sort({ code: -1 });
    let nextCode = '01';
    if (lastSupplier && lastSupplier.code) {
      const num = parseInt(lastSupplier.code, 10) + 1;
      nextCode = num.toString().padStart(2, '0');
    }
    req.body.code = nextCode;

    const supplier = new Supplier(req.body);
    await supplier.save();
    // Populate categories before returning
    await supplier.populate('categories', 'name icon code');
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

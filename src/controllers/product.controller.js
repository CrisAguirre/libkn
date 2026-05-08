const Product = require('../models/Product');
const Alert = require('../models/Alert');

exports.getAll = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 50, active } = req.query;
    const filter = {};

    if (search) filter.$text = { $search: search };
    if (category) filter.category = category;
    if (active !== undefined) filter.isActive = active === 'true';

    const products = await Product.find(filter)
      .populate('category', 'name icon')
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Product.countDocuments(filter);
    res.json({ products, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name icon');
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true
    }).populate('category', 'name icon');
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json(product);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });
    res.json({ message: 'Producto desactivado' });
  } catch (error) {
    next(error);
  }
};

exports.updateStock = async (req, res, next) => {
  try {
    const { quantity, type } = req.body; // type: 'entrada' | 'salida'
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Producto no encontrado' });

    if (type === 'entrada') {
      product.stock += Number(quantity);
    } else {
      if (product.stock < quantity) {
        return res.status(400).json({ message: 'Stock insuficiente' });
      }
      product.stock -= Number(quantity);
    }

    await product.save();

    // Generar alerta si el stock está bajo
    if (product.stock <= product.minStock) {
      await Alert.create({
        product: product._id,
        type: product.stock === 0 ? 'sin_stock' : 'stock_bajo',
        message: product.stock === 0
          ? `"${product.name}" se ha agotado`
          : `"${product.name}" tiene stock bajo (${product.stock} unidades)`,
        priority: product.stock === 0 ? 'alta' : 'media'
      });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
};

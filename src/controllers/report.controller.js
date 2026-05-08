const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.salesSummary = async (req, res, next) => {
  try {
    const { period = 'day' } = req.query; // day, week, month
    const now = new Date();
    let startDate;

    if (period === 'day') {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    } else if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const sales = await Sale.find({ createdAt: { $gte: startDate } });
    const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
    const totalTransactions = sales.length;
    const averageTicket = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;

    // Ventas por día para gráfica
    const salesByDay = await Sale.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          total: { $sum: '$total' },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({ totalRevenue, totalTransactions, averageTicket, salesByDay, period });
  } catch (error) {
    next(error);
  }
};

exports.topProducts = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const topProducts = await Sale.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.productName' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.subtotal' }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: Number(limit) }
    ]);
    res.json(topProducts);
  } catch (error) {
    next(error);
  }
};

exports.lowRotation = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Productos con ventas recientes
    const soldProductIds = await Sale.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      { $unwind: '$items' },
      { $group: { _id: '$items.product' } }
    ]);
    const soldIds = soldProductIds.map(p => p._id);

    // Productos activos sin ventas en 30 días
    const stagnant = await Product.find({
      isActive: true,
      _id: { $nin: soldIds }
    }).populate('category', 'name').sort({ stock: -1 });

    res.json(stagnant);
  } catch (error) {
    next(error);
  }
};

const mongoose = require('mongoose');

const stockCountSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  productName: { type: String, required: true, trim: true },
  oldStock: { type: Number, required: true, min: 0 },
  counted: { type: Number, required: true, min: 0 },
  newStock: { type: Number, required: true, min: 0 },
  difference: { type: Number, required: true },
  source: { type: String, enum: ['scan', 'manual'], default: 'scan' },
  confidence: { type: Number, min: 0, max: 1 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

stockCountSchema.index({ product: 1, createdAt: -1 });
stockCountSchema.index({ createdAt: -1 });

module.exports = mongoose.model('StockCount', stockCountSchema);

import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  amount: { type: Number, required: true },
  phone: { type: String, required: true },
  checkoutRequestId: { type: String },
  merchantRequestId: { type: String },
  mpesaReceiptNumber: { type: String, default: null },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  resultDesc: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
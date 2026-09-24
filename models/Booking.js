import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  customerName: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true,
  },
  customerPhone: {
    type: String,
    required: [true, 'Phone number is required'],
  },
  customerEmail: {
    type: String,
    default: '',
  },
  service: {
    type: String,
    required: [true, 'Service is required'],
  },
  servicePrice: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: [true, 'Date and time are required'],
  },
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'completed', 'pending'],
    default: 'confirmed',
  },
  notes: {
    type: String,
    default: '',
  },
  subscriptionStatus: {
    type: String,
    enum: ['trial', 'active', 'expired', 'cancelled'],
    default: 'trial',
  },
  trialEndsAt: {
    type: Date,
  },
  subscriptionExpiresAt: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

});

// Index to prevent double booking (unique constraint on businessId + date)
BookingSchema.index({ businessId: 1, date: 1 }, { unique: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
import mongoose from 'mongoose';

const BusinessSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  phone: {
    type: String,
    default: '',
  },
  location: {
    type: String,
    default: '',
  },
  availability: {
    monday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      enabled: { type: Boolean, default: true }
    },
    tuesday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      enabled: { type: Boolean, default: true }
    },
    wednesday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      enabled: { type: Boolean, default: true }
    },
    thursday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      enabled: { type: Boolean, default: true }
    },
    friday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '17:00' },
      enabled: { type: Boolean, default: true }
    },
    saturday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '14:00' },
      enabled: { type: Boolean, default: true }
    },
    sunday: {
      start: { type: String, default: '09:00' },
      end: { type: String, default: '14:00' },
      enabled: { type: Boolean, default: false }
    }
  },
  services: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      duration: { type: Number, required: true, default: 60 },
    }
  ],
  bookingLink: {
    type: String,
    unique: true,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Business || mongoose.model('Business', BusinessSchema);
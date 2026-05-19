import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    originalUrl: {
      type: String,
      required: [true, 'Original URL is required'],
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      trim: true,
    },
    customAlias: {
      type: String,
      default: null,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    totalClicks: {
      type: Number,
      default: 0,
    },
    lastVisitedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes
urlSchema.index({ shortCode: 1 }, { unique: true });
urlSchema.index({ userId: 1, createdAt: -1 });
urlSchema.index({ userId: 1, isActive: 1 });

export default mongoose.model('Url', urlSchema);

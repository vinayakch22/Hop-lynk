import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true,
  },
  browser: { type: String, default: 'Unknown' },
  os: { type: String, default: 'Unknown' },
  device: { type: String, default: 'Unknown' },
  country: { type: String, default: 'Unknown' },
  referrer: { type: String, default: 'Direct', maxlength: 500 },
  // No raw IP stored — privacy compliant
  timestamp: { type: Date, default: Date.now },
});

// Individual field indexes for analytics queries
analyticsSchema.index({ urlId: 1, timestamp: -1 });
analyticsSchema.index({ urlId: 1, browser: 1 });
analyticsSchema.index({ urlId: 1, os: 1 });
analyticsSchema.index({ urlId: 1, device: 1 });
analyticsSchema.index({ urlId: 1, country: 1 });

export default mongoose.model('Analytics', analyticsSchema);

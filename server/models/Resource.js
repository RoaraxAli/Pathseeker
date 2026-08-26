const mongoose = require('mongoose');

const RESOURCE_TYPES = ['pdf', 'checklist', 'template', 'guide'];

const resourceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, enum: RESOURCE_TYPES, default: 'pdf' },
    domain: { type: String, trim: true },
    tags: { type: [String], default: [] },

    sourceType: { type: String, enum: ['upload', 'external'], required: true },
    file: {
      filename: String,
      originalName: String,
      mimeType: String,
      size: Number,
    },
    externalUrl: { type: String, trim: true },

    downloadCount: { type: Number, default: 0 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
module.exports.RESOURCE_TYPES = RESOURCE_TYPES;

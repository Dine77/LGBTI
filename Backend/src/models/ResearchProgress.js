const mongoose = require('mongoose');

const ResearchProgressSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['planned', 'in-progress', 'completed'], default: 'planned' },
    startedAt: { type: Date },
    completedAt: { type: Date },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ResearchProgress', ResearchProgressSchema);

const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    id: String,
    type: String,
    co2Impact: Number,
    xpReward: Number,
    date: String,
    icon: String
}, { _id: false });

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    level: { type: Number, default: 1 },
    xp: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastLogin: { type: Date, default: Date.now },
    badges: [String],
    co2Saved: { type: Number, default: 0 },
    completedModules: [String],
    customMissions: [{
        id: String,
        title: String,
        type: { type: String, enum: ['daily', 'weekly'] },
        completed: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],
    completedMissions: [String],
    logs: [LogSchema]
});

module.exports = mongoose.model('User', UserSchema);

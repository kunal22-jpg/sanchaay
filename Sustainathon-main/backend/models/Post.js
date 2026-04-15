const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: { type: String, required: true },
    text: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

const PostSchema = new mongoose.Schema({
    user: { type: String, required: true },
    content: { type: String, required: true },
    likes: [{ type: String }],  // Array of usernames who liked
    comments: [CommentSchema],
    timestamp: { type: Date, default: Date.now },
    color: { type: String, default: 'bg-white' }
});

module.exports = mongoose.model('Post', PostSchema);

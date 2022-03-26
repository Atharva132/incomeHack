const mongoose = require('mongoose');
const { Schema } = mongoose;

goalSchema = new Schema({
    goal: String,
    target: Number,
    amount: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Goal', goalSchema);

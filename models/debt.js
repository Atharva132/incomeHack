const mongoose = require('mongoose');
const { Schema } = mongoose;

debtSchema = new Schema({
    debt: String,
    amount: Number,
    repayed: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Debt', debtSchema);

const mongoose = require('mongoose');
const { Schema } = mongoose;

budgetSchema = new Schema({
    month: String,
    year: Number,
    income: Number,
    expenses: {
        rent: Number,
        mortgage: Number,
        travel: Number,
        groceries: Number,
        utilities: Number,
        education: Number,
        loans: Number,
        insurances: Number,
        personal: Number,
        misc: Number, 
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

module.exports = mongoose.model('Budget', budgetSchema);
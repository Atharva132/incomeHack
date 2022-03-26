const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
	email: {
		type: String,
		required: true,
		unique: [true, 'Email already in use']
	},
    resetPasswordToken: String,
    resetPasswordExpires: Date,
	risk: String
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.post('save', function (error, doc, next) {
    if (error.code === 11000) 
        next(new Error('Email already in use'));
    else next(error);
});

UserSchema.post('findOneAndUpdate', function (error, doc, next) {
    if (error.code === 11000) 
        next(new Error('Email already in use'));
    else next(error);
});


module.exports = mongoose.model('User', UserSchema);

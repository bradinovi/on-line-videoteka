const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  username: {type: String, required: true},
  dateOfBirth: {type: Date, required: true},
  email: {type: String, required: true, unique: true}, // unique isn't a validator it has to be handled
  password: { type: String, required: true},
  role: { type: String, required: true, default: 'user'}
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);

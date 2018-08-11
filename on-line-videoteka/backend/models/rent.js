const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const rentSchema = mongoose.Schema({
  user: {type: Schema.Types.ObjectId, required: true},
  movie: {type: Schema.Types.ObjectId, required: true},
  duration: {type: Number, required: true},
  hasLiked: {type: Boolean, default: false},
});

rentSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', rentSchema);

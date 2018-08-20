const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;
const rentSchema = mongoose.Schema({
  user: {type: Schema.Types.ObjectId, required: true, ref: 'User'},
  movie: {type: Schema.Types.ObjectId, required: true, ref: 'Movie'},
  duration: {type: Number, required: true},
  rentDay: {type: Date, required: true}
});

rentSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Rent', rentSchema);

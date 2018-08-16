const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;
const roleSchema = mongoose.Schema({
  movie: {type: Schema.Types.ObjectId, required: true, ref: 'Movie'},
  actor: {type: Schema.Types.ObjectId, required: true, ref: 'Actor'},
  name: { type: String, required: true },
});

module.exports = mongoose.model('Role', roleSchema);

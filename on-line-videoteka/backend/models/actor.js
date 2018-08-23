const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;

const actorSchema = mongoose.Schema({
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  born: {type: Date },
  died: {type: Date },
  ocupations: [{type: String, required: true}],
  bio: {type: String},
  portraitPath: {type: String},
  roles: [{ type: Schema.Types.ObjectId }],
  directed: [{ type: Schema.Types.ObjectId , ref: 'Movie'}]
});

module.exports = mongoose.model('Actor', actorSchema);

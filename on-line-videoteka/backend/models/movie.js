const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
var Schema = mongoose.Schema,ObjectId = Schema.ObjectId;

const movieSchema = mongoose.Schema({
  title: {type: String, required: true},
  release: {type: Date, required: true},
  duration: {type: Number },
  trailerLink: {type: String},
  plotsum: {type: String},
  posterPath: {type: String},
  genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
  roles: [{ type: Schema.Types.ObjectId }],
  directors: [{ type: Schema.Types.ObjectId , ref: 'Actor'}],
  rents: {type: Number },
  year: {type: Number }
});

module.exports = mongoose.model('Movie', movieSchema);

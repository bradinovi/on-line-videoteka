const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const movieSchema = mongoose.Schema({
  title: {type: String, required: true},
  release: {type: Date, required: true},
  duration: {type: Number },
  trailerLink: {type: String},
  plotsum: {type: String},
  posterPath: {type: String},
  genre: [{ type: Schema.Types.ObjectId }],
  roles: [{ type: Schema.Types.ObjectId }],
  directors: [{ type: Schema.Types.ObjectId }],
  likes: {type: Number },
});

module.exports = mongoose.model('Movie', movieSchema);

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const movieSchema = mongoose.Schema({
  title: {type: String, required: true},
  release: {type: Date, required: true},
  genre: [{type: String, required: true}],
  duration: {type: Number },
  likes: {type: Number },
  rating: [{ type: String }],
  bio: {type: String},
  trailerLink: {type: String},
  posterPath: {type: String},
  plotsum: {type: String},
  roles: [{ type: Schema.Types.ObjectId }],
  directors: [{ type: Schema.Types.ObjectId }]
});

module.exports = mongoose.model('Movie', movieSchema);

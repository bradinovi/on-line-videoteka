const Movie = require('../models/movie');

exports.addMovie = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");

  const movie = new Movie(
    {
      title: req.body.title,
      release: new Date(req.body.release),
      duration: req.body.release,
      trailerLink: req.body.trailerLink,
      plotsum: req.body.plotsum,
      posterPath: url + '/images/posters/' + req.file.filename,
      genres: req.body.genres
    }
  );

}

exports.getMovies = (req, res, next) => {

}

exports.getMovie = (req, res, next) => {

}

exports.updateMovie = (req, res, next) => {

}

exports.deleteMovie = (req, res, next) => {

}

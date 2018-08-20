const Rent = require('../models/rent');

exports.addRent = (req, res, next) => {
  const rent = new Rent(
    {
      user: req.userData.userId,
      movie: req.body.movieId,
      duration: req.body.duration,
      rentDay:  new Date()
    }
  );
  rent.save().then(
    (rentData) => {
      res.status(201).json({
        message: 'Movie rented'
      });
    }
  );

}

exports.getRentsForUser = (req, res, next) => {
  Rent.find({ user: req.userData.userId }).populate({ path: 'movie' }).then(
    (rentedMovies) => {
      res.json({
        message: 'Your movies fetched succesfully!',
        mymovies: rentedMovies
      });
    }
  ).catch(
    error => {
      res.status(500).json({
        message: 'Fatching your movies failed!',
     });
    }
  );
}

exports.getRents = (req, res, next) => {

}

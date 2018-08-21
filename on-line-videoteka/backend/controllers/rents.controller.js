const Rent = require('../models/rent');
const mongoose = require('mongoose');
exports.addRent = (req, res, next) => {
  const rent = new Rent(
    {
      user: req.userData.userId,
      movie: req.body.movieId,
      duration: req.body.duration,
      rentDay:  new Date()
    }
  );
  const today = new Date()
  const day =24*60*60000;
  //console.log(req.body.movieId);
  Rent.aggregate([
    { $match: { movie: mongoose.Types.ObjectId(req.body.movieId), user: mongoose.Types.ObjectId(req.userData.userId) } },
    { $project: { rentDay: '$rentDay', duration:'$duration', days: {$multiply : ['$duration',day]}}},
    { $project: { rentDay: '$rentDay', duration:'$duration', exp: {$add : ['$days','$rentDay']}}},
    { $match: { exp: {$gte: today} }},
    ])
    .then(
    rentFound => {
      console.log(rentFound)
      if(rentFound[0]){
        res.status(200).json({ rentId: rentFound[0]._id, message: 'Already have rent on that movie'});
      }
      else{
        rent.save().then(
          (rentData) => {
            res.status(201).json({
              message: 'Movie rented'
            });
          }
        );
      }
    }
  );
  /*
  */

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

exports.extendRent = (req, res, next) => {
  console.log(req.body.rentId);
  console.log(req.body.duration);
  Rent.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(req.body.rentId) },
    { $inc: { duration: parseInt(req.body.duration)} }
  ).then(
    (updateData) => {
      res.status(200).json({ message: 'Duration prolonged' })
    }
  );
}

const Rent = require('../models/rent');
const Movie = require('../models/movie');
const mongoose = require('mongoose');
exports.addRent = (req, res, next) => {
  const rent = new Rent(
    {
      user: req.userData.userId,
      movie: req.body.movieId,
      duration:  req.body.duration,
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
        Movie.findOneAndUpdate(
          { _id: mongoose.Types.ObjectId(req.body.movieId) },
          { $inc: { rents: 1} }
        ).then(
          (updateData) => {
            rent.save().then(
              (rentData) => {
                res.status(201).json({
                  message: 'Movie rented'
                });
              }
            );
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

exports.getRents = (req, res, next) => {
  const pageSize = parseInt(req.query.pagesize);
  const currentPage = parseInt(req.query.page);
  let rentQuery  = Rent.find();
  let fetchedRents;

  if(req.query.user) {
    rentQuery = Rent.find({ user: req.query.user});
  }

  if (pageSize && currentPage) {
    rentQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  rentQuery.populate({path:'movie', select: '_id title posterPath'}).populate({path:'user'});

  rentQuery.then((documents) => {
    fetchedRents = documents;
    return Rent.count();
  }).then(
    count => {
      res.status(200).json(
        {
          message: 'Rents fetched',
          rents: fetchedRents,
          maxRents: count
        }
      );
    }
  );
}

exports.addRentAdmin = (req, res, next) => {
  console.log(req.body);
  const rent = new Rent(
    {
      user: req.body.userId,
      movie: req.body.movieId,
      duration: parseInt(req.body.duration),
      rentDay:  new Date(req.body.rentDay)
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

exports.updateRent = (req, res, next) => {
  const rent = new Rent(
    {
      _id: req.body.rentId,
      user: req.body.userId,
      movie: req.body.movieId,
      duration: req.body.duration,
      rentDay:  new Date(req.body.rentDay)
    }
  );

  Rent.updateOne({_id: req.body.rentId}, rent).then(
    (updateData) => {
      if(updateData.n > 0) {
        res.status(201).json({
          message: 'Rent updated'
        });
      }
    }
  );
}

exports.deleteRent = (req, res, next) => {
  Rent.deleteOne({_id: req.params.Id}).then(
    (deleteData) => {
      if(deleteData.n > 0) {
        res.status(201).json({
          message: 'Rent deleted'
        });
      }
    }
  );
}

exports.getTopMoviesForMonth = (req, res, next) => {
  let pageSize = +req.query.pagesize;
  if(!pageSize) {
    pageSize = 3;
  }
  const date = new Date();
  const firstDayOfTheMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  Rent.aggregate([
    { $match:  { rentDay: { $gt: firstDayOfTheMonth } } },
    { $group: { _id : "$movie", count: { $sum: 1 } } },
    { $sort: {  count: -1 } },
    { $limit: pageSize}
  ]).then(
    data => {
      movieIdArray =[];
      data.forEach(movie => {
        movieIdArray.push(movie._id);
      });
      Movie.find( { _id: { $in: movieIdArray} } ).then(
        moviesTop => {
          res.status(200).json({
            topmonth: moviesTop
          })
        }
      )
    }
  );
}

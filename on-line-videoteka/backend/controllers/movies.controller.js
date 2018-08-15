const Movie = require('../models/movie');
const Role = require('../models/role');
const Actor = require('../models/actor');
const mongoose= require('mongoose');

exports.addMovie = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");

  let genreArray = JSON.parse(req.body.genres).genres;
  const genresForDB = []
  genreArray.forEach(genre => {
    genresForDB.push(mongoose.Types.ObjectId(genre))
  });

  const movie = new Movie(
    {
      title: req.body.title,
      release: new Date(req.body.release),
      duration: req.body.duration,
      trailerLink: req.body.trailerLink,
      plotsum: req.body.plotsum,
      posterPath: url + '/images/posters/' + req.file.filename,
      genres: genresForDB
    }
  );

  movie.save().then((createdMovie) => {
    res.status(201).json({
      message: 'Movie created',
      createdMovie: createdMovie
    });
  });

}

exports.getMovies = (req, res, next) => {
  const pageSize = req.query.pagesize;
  const currentPage = req.query.page;
  let movieQuery;
  let fetchedMovies;
  const textQuery = req.query.text;
  if(textQuery){
    movieQuery = Movie.find({ $text: { $search: textQuery } });
  } else {
    movieQuery = Movie.find();
  }

  if (pageSize && currentPage) {
    movieQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  movieQuery.then((documents) => {
    fetchedMovies = documents;
    return Movie.count();
  })
  .then( count => {
    res.json({
      message: 'Movies fetched succesfully!',
      actors: fetchedMovies,
      maxPosts: count
    });
  }).catch( error =>{
    res.status(500).json({
      message: 'Fatching Movies failed!',
   });
  });
}

exports.getMovie = (req, res, next) => {
  Movie.findById(req.params.id).then( movie => {
    if(movie){
      res.status(200).json(movie);
    } else {
      res.status(404).json({message: 'Movie not found'});
    }
  }).catch( error =>{
    res.status(500).json({
      message: 'Fatching Movie failed!',
    });
  })
}

exports.updateMovie = (req, res, next) => {
  let imagePath = req.body.imagePath;
  let genreArray = [];
  const genresForDB = []
  console.log(req.body);
  genreArray = req.body.genres.genres;
  if (req.file) {
    console.log('HAS FILE');
    genreArray = JSON.parse(req.body.genres).genres;
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + '/images/posters/' + req.file.filename;
  };

  genreArray.forEach(genre => {
    genresForDB.push(mongoose.Types.ObjectId(genre))
  });

  const movie = new Movie({
    _id: req.body.id,
    title: req.body.title,
    release: new Date(req.body.release),
    duration: req.body.release,
    trailerLink: req.body.trailerLink,
    plotsum: req.body.plotsum,
    posterPath: imagePath,
    genres: req.body.genres
  });

  Movie.updateOne({ _id: req.body.id }, movie).then((result) => {
    console.log(result);
    if(result.n > 0) {
      res.status(200).json({
        message: 'Movie updated successfully',
     });
    } else {
      res.status(401).json({
        error: {message: 'Not authorized!'},
     });
    }
  }).catch(error =>{
    res.status(500).json({
      message: 'Failed update movie',
   });
    console.log(error);
  });

}

exports.deleteMovie = (req, res, next) => {
  console.log("TO DELETE:" + req.params.id);
  Movie.deleteOne({ _id: req.params.id }).then( result => {
    if(result.n > 0) {
      // TO DO - Remove movie from directed
      Role.deleteMany({ movie: req.params.id}).then(deleteRoleRes => {
        // TO DO - Remove All roles from Actors
        res.status(200).json({
          message: 'Movie and roles deleted successfully',
        });
      });

    } else {
      res.status(401).json({
        error: {message: 'Not authorized!'}
     });
    }
  });



}

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
      genres: genresForDB,
      rents: 0,
      year :new Date(req.body.release).getFullYear()
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
  const pageSize = parseInt(req.query.pagesize) ;
  const currentPage = parseInt(req.query.page);

  const searchText = req.query.searchText;
  const selectedGenre = req.query.selectedGenre;
  const selectedYear = req.query.selectedYear;
  const selectedSort = req.query.selectedSort;
  let movieQuery;
  let fetchedMovies;

  if(searchText !== 'undefined'){
    movieQuery = Movie.find({ $text: { $search: searchText } });
  } else {
    movieQuery = Movie.find();
  }
  if (selectedGenre && selectedGenre !== 'undefined') {
    movieQuery = movieQuery.find({genres: { $in: [mongoose.Types.ObjectId(selectedGenre)]}});
  }
  if (selectedYear && selectedYear !== 'undefined') {
    movieQuery = movieQuery.find({ year: selectedYear });
  }
  if (selectedSort && selectedSort !== 'undefined') {
    if (selectedSort == 'year'){
      movieQuery = movieQuery.sort({ release: -1 });
    }
    if (selectedSort == 'rents' && selectedSort){
      movieQuery = movieQuery.sort({ rents: -1 });
    }
  }
  const count = Movie.count(movieQuery);
  if (pageSize && currentPage) {
    movieQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  movieQuery.then((documents) => {
    fetchedMovies = documents;
    return count;
  })
  .then( count => {
    res.json({
      message: 'Movies fetched succesfully!',
      movies: fetchedMovies,
      maxPosts: count
    });
  }).catch( error =>{
    res.status(500).json({
      error: 'Fatching Movies failed!'
   });
  });
}

exports.getMovie = (req, res, next) => {
  Movie.findById(req.params.id).populate({ path: 'genres' }).then( movie => {
    if(movie){
      res.status(200).json(movie);
    } else {
      res.status(400).json({error: 'Movie not found'});
    }
  }).catch( error =>{
    res.status(500).json({
      error: 'Fatching Movie failed!',
    });
  })
}

exports.updateMovie = (req, res, next) => {
  let imagePath = req.body.posterPath;
  let genreArray = [];
  const genresForDB = [];
  genreArray = req.body.genres.genres;
  if (req.file) {
    genreArray = JSON.parse(req.body.genres).genres;
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + '/images/posters/' + req.file.filename;
  };

  genreArray.forEach(genre => {
    genresForDB.push(mongoose.Types.ObjectId(genre))
  });

  const movie = {
    _id: req.body.id,
    title: req.body.title,
    release: new Date(req.body.release),
    duration: req.body.duration,
    trailerLink: req.body.trailerLink,
    plotsum: req.body.plotsum,
    posterPath: imagePath,
    genres: genresForDB,
    year: new Date(req.body.release).getFullYear()
  };

  Movie.findByIdAndUpdate(req.body.id, movie).then((result) => {
    console.log(result);
    if(result) {
      res.status(200).json({
        message: 'Movie updated successfully',
     });
    } else {
      res.status(400).json({
        error: 'Movie does not exits',
     });
    }
  }).catch(error =>{
    console.log(error);
    res.status(500).json({
      error: 'Failed update movie',
   });
  });
}

exports.deleteMovie = (req, res, next) => {

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
      res.status(400).json({
        error: 'Movie does not exits'
     });
    }
  });
}

exports.addDirector = (req, res, next) => {
  const movieId = req.params.id;
  const directorId = req.body.actorId;
  // TO Do: push to movie directors and push to actor directed

  Movie.updateOne({_id: movieId}, { $push: { directors: directorId} }).then((moviepush) => {
    Actor.updateOne({_id: directorId}, { $push: { directed: movieId} }).then(
      (actorpush) => {
        res.status(201).json(
          {
            message: 'Director added'
          }
        );
      }
    );
  });

}

exports.deleteDirector = (req, res, next) => {
  const movieId = req.params.id;
  const directorId =  req.body.actorId;
  // TO DO: Pull from movie actorID and pull from actor movieid
  Movie.updateOne({_id: movieId}, { $pull: { directors: directorId} }).then((moviepull) => {
    Actor.updateOne({_id: directorId}, { $pull: { directed: movieId} }).then(
      (actorpull) => {
        res.status(201).json(
          {
            message: 'Director deleted'
          }
        );
      }
    );
  });
}

exports.getDirectorsForMovie = (req, res, next) => {
  const movieId = req.params.id;

  Movie.find({_id:movieId},'title directors').populate({ path: 'directors', select: 'firstName lastName portraitPath' }).then(
    (directors) => {

      res.status(200).json({
        directors: directors[0]
      });
    }
  );

}

exports.getRecentMovies = (req, res, next) => {

  let pageSize = 3;
  if(req.query.pagesize) {
    pageSize = +req.query.pagesize;
  }
  Movie.find().sort({ release: -1 }).limit(pageSize).then(
    nRecent => {
      res.status(200).json({
        movies: nRecent
      });
    }
  );
}


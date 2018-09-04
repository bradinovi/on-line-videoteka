const Genre = require('../models/genre');

exports.addGenre = (req, res, next) => {
  const genre = new Genre({
    name: req.body.name
  });

  genre.save().then(
    (createdGenre) => {
      res.status(201).json({
        message: 'Genre added successfully'
      })
    }
  );
}

exports.getGenres = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let genreQuery  = Genre.find();
  let fetchedGenres;

  if (pageSize && currentPage) {
    genreQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  genreQuery.then((documents) => {
    fetchedGenres = documents;
    return Genre.count();
  })
  .then( count => {
    res.json({
      message: 'Genres fetched succesfully!',
      genres: fetchedGenres,
      maxGenres: count
    });
  }).catch( error =>{
    res.status(500).json({
      error: 'Fatching Genres failed!'
   });
  });
}

exports.getGenre = (req, res, next) => {
  Genre.findById(req.params.id).then( genre => {
    if(genre){
      res.status(200).json(genre);
    } else {
      res.status(400).json({error: 'Genre does not exist'});
    }
  }).catch( error => {
    res.status(500).json({
      message: 'Fatching Genre failed!',
    });
  })
}

exports.deleteGenre = (req, res, next) => {
  Genre.deleteOne({ _id: req.params.id }).then( result => {
    if(result.n > 0) {
      res.status(200).json({
        message: 'Genre deleted successfully',
     });
    } else {
      res.status(400).json({
        error:  'Genre does not exist'
     });
    }
  });
}

exports.updateGenre = (req, res, next) => {
  const genreId = req.body.id;
  genre = new Genre({
    _id: genreId,
    name: req.body.name
  });
  Genre.updateOne({ _id: genreId }, genre).then((result) => {
    console.log(result);
    if(result.n > 0) {
      res.status(200).json({
        message: 'Genre updated successfully',
      });
    } else {
      res.status(400).json({
        error:  'Genre does not exist'
      });
    }
  });
}

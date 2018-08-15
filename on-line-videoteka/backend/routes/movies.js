const express = require('express');

const MoviesController = require('../controllers/movies.controller');
const extractMoviePosterFile = require('../middleware/poster-file');

const router = express.Router();

router.post('/', extractMoviePosterFile ,MoviesController.addMovie);

router.get('/', MoviesController.getMovies);

router.get('/:id', MoviesController.getMovie);

router.put('/', extractMoviePosterFile,MoviesController.updateMovie);

router.delete('/:id', MoviesController.deleteMovie);

module.exports = router;

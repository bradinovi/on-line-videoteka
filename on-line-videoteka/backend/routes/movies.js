const express = require('express');

const MoviesController = require('../controllers/movies.controller');
const extractMoviePosterFile = require('../middleware/poster-file');

const router = express.Router();

router.post('/', extractMoviePosterFile ,MoviesController.addMovie);

module.exports = router;

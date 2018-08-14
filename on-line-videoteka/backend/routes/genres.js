const express = require('express');

const GenreController = require('../controllers/genre.controller');

const router = express.Router();

router.post('/',GenreController.addGenre);

router.get('/',GenreController.getGenres);

router.get('/:id', GenreController.getGenre);

router.put('/',GenreController.updateGenre);

router.delete('/:id',GenreController.deleteGenre);

module.exports = router;

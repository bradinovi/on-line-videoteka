const express = require('express');
const adminAuthCheck = require('../middleware/auth-check-admin');
const MoviesController = require('../controllers/movies.controller');
const extractMoviePosterFile = require('../middleware/poster-file');
const authCheck = require('../middleware/auth-check');
const router = express.Router();

router.post('/',adminAuthCheck, extractMoviePosterFile ,MoviesController.addMovie);

router.get('/', authCheck, MoviesController.getMovies);

router.get('/:id', authCheck, MoviesController.getMovie);

router.put('/',adminAuthCheck, extractMoviePosterFile,MoviesController.updateMovie);

router.delete('/:id',adminAuthCheck, MoviesController.deleteMovie);

router.get('/director/:id', authCheck, MoviesController.getDirectorsForMovie);
router.post('/director/:id',adminAuthCheck, MoviesController.addDirector);
router.delete('/director/:id',adminAuthCheck, MoviesController.deleteDirector);

module.exports = router;

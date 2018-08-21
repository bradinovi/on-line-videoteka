const express = require('express');
const adminAuthCheck = require('../middleware/auth-check-admin');
const GenreController = require('../controllers/genre.controller');
const authCheck = require('../middleware/auth-check');
const router = express.Router();

router.post('/', adminAuthCheck, GenreController.addGenre);

router.get('/',authCheck,  GenreController.getGenres);

router.get('/:id',authCheck, GenreController.getGenre);

router.put('/',adminAuthCheck, GenreController.updateGenre);

router.delete('/:id',adminAuthCheck, GenreController.deleteGenre);

module.exports = router;

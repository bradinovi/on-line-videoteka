const express = require('express');
const authCheck = require('../middleware/auth-check');
const RentsController = require('../controllers/Rents.controller');


const router = express.Router();

router.get('/mymovies',authCheck, RentsController.getRentsForUser);

router.post('/rentmovie', authCheck,RentsController.addRent);

module.exports = router;

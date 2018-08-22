const express = require('express');
const authCheck = require('../middleware/auth-check');
const RentsController = require('../controllers/Rents.controller');
const adminAuthCheck = require('../middleware/auth-check-admin');

const router = express.Router();

router.post('/', adminAuthCheck, authCheck, RentsController.addRentAdmin);
router.put('/', adminAuthCheck, authCheck,RentsController.updateRent);
router.delete('/', adminAuthCheck, authCheck,RentsController.deleteRent);
router.get('/', adminAuthCheck, RentsController.getRents);

router.get('/topmonth',  RentsController.getTopMoviesForMonth);

router.get('/mymovies',authCheck, RentsController.getRentsForUser);

router.post('/rentmovie', authCheck,RentsController.addRent);

router.patch('/extendrent', authCheck,RentsController.extendRent);

module.exports = router;

const express = require('express');
const authCheck = require('../middleware/auth-check');
const RentsController = require('../controllers/Rents.controller');


const router = express.Router();

router.post('/', authCheck, RentsController.addRentAdmin);
router.put('/', authCheck,RentsController.updateRent);
router.delete('/', authCheck,RentsController.deleteRent);
router.get('/', authCheck, RentsController.getRents);


router.get('/mymovies',authCheck, RentsController.getRentsForUser);

router.post('/rentmovie', authCheck,RentsController.addRent);

router.patch('/extendrent', authCheck,RentsController.extendRent);

module.exports = router;

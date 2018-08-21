const express = require('express');
const authCheck = require('../middleware/auth-check');
const RolesController = require('../controllers/roles.controller');
const adminAuthCheck = require('../middleware/auth-check-admin');

const router = express.Router();

router.post('/', adminAuthCheck, RolesController.addRole);

router.get('/actor/:actorId',authCheck, RolesController.getRolesActor);

router.get('/movie/:movieId',authCheck, RolesController.getRolesMovie);

router.get('/:id',authCheck, RolesController.getRole);

router.put('/',adminAuthCheck, RolesController.updateRole);

router.delete('/:id',adminAuthCheck, RolesController.deleteRole);

module.exports = router;

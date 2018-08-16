const express = require('express');

const RolesController = require('../controllers/roles.controller');


const router = express.Router();

router.post('/', RolesController.addRole);

router.get('/actor/:actorId', RolesController.getRolesActor);

router.get('/movie/:movieId', RolesController.getRolesMovie);

router.get('/:id', RolesController.getRole);

router.put('/', RolesController.updateRole);

router.delete('/:id', RolesController.deleteRole);

module.exports = router;

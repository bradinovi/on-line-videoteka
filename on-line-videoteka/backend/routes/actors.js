const express = require('express');

const ActorController = require('../controllers/actors.controller');

const router = express.Router();

const extractPortraitFile = require('../middleware/portrait-file');
const checkAuthAdmin = require('../middleware/auth-check-admin');

router.post('/',extractPortraitFile, ActorController.addActor);

router.put('/',checkAuthAdmin, ActorController.updateActor);

router.get('/', ActorController.getActors);

router.get('/:id', ActorController.getActor);

router.delete('/:id',checkAuthAdmin, ActorController.deleteActor);

module.exports = router;

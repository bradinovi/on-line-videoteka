const express = require('express');
const adminAuthCheck = require('../middleware/auth-check-admin');
const ActorController = require('../controllers/actors.controller');
const authCheck = require('../middleware/auth-check');
const router = express.Router();

const extractPortraitFile = require('../middleware/portrait-file');
const checkAuthAdmin = require('../middleware/auth-check-admin');

router.post('/', adminAuthCheck, extractPortraitFile, ActorController.addActor);

router.put('/', adminAuthCheck, extractPortraitFile, ActorController.updateActor);

router.get('/',  authCheck, ActorController.getActors);

router.get('/:id', authCheck, ActorController.getActor);

router.delete('/:id', authCheck, ActorController.deleteActor);

router.get('/directed/:id', authCheck, ActorController.getDirectedByActor);

module.exports = router;

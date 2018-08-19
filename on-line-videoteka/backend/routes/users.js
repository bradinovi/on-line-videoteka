const express = require('express');

const UserController = require('../controllers/users.controllers');

const router = express.Router();

router.post('/signup', UserController.createUser);
router.post('/login', UserController.loginUser);

// router.get('/:id',UserController.getUser);

router.get('/',UserController.getUsers);

router.patch('/',UserController.updateUser);
router.delete('/:id',UserController.deleteUser);

router.patch('/userpass',UserController.userChangePassword);
router.patch('/userinfo',UserController.userChangeUserInfo);



module.exports = router;

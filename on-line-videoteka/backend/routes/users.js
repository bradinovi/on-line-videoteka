const express = require('express');
const authCheck = require('../middleware/auth-check');
const UserController = require('../controllers/users.controllers');
const adminAuthCheck = require('../middleware/auth-check-admin');
const router = express.Router();

router.post('/signup', UserController.createUser);
router.post('/login', UserController.loginUser);

// router.get('/:id',UserController.getUser);

router.get('/verify/:token', UserController.verifyUser);
router.post('/forgotpassword', UserController.issueNewPassword);

router.get('/', adminAuthCheck, UserController.getUsers);
router.patch('/', adminAuthCheck, UserController.updateUser);
router.delete('/:id', adminAuthCheck, UserController.deleteUser);
router.patch('/userpass', authCheck,UserController.userChangePassword);
router.patch('/userinfo', authCheck,UserController.userChangeUserInfo);



module.exports = router;

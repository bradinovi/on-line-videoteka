const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser =  (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then( hash => {
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      dateOfBirth: new Date(req.body.dateOfBirth),
      email: req.body.email,
      password: hash
    });
    user.save()
      .then( result => {
        res.status(201).json({
          massage: 'User created!',
          result: result
        });

        }).catch( err => {
          res.status(500).json({
            error: err
          });
      });
  });
}

exports.loginUser = (req, res, next) => {
  let userFound = {};
  User.findOne({ email: req.body.email }).then( user => {
    if(!user){
      return res.status(401).json({ massage: 'Auth failed' });
    }
    userFound = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if(!result){
      return res.status(401).json({ massage: 'Auth failed' });
    }
    const token = jwt.sign(
      { email:userFound.email, userId: userFound._id, role: userFound.role },
      'S7vrly7NDuMZ_R8MdDRGDddtY3iIvJ0wS7S-fgh0syUSDg3CLT9G4BqUESRRPp0YNnYQuFV6uOgbux_9CVop9cejRzJfwEGFnbaSN7QPQFAYogSar5Hrjqqnayrgs_764VrozPfpFGZeIejnuItx9x8Z8VB9uhB2vzi35co9-jmUn1KxxkmQB2-BNrjH9pf0kNJSjX4277IrYn1FOjRk-bdK3kR1ylQePgiTmzqsOXXXpVjktigYXcSRX4J_x4kP44wPKuA4w2QZHfIqo5Q_m607TlNfhuc87nLw1zhphVWYGC5DI7F7tTrfuYijvJLydMMj3XAbaW7CDcrRm5D45Q',
      { expiresIn: '3h'});
    res.status(200).json({
      token: token,
      expiresIn: 10800,
      userId: userFound._id
    })
  }).catch(
    err => {
      console.log(err);
      return res.status(500).json({
        error: err
      });}
  )
}

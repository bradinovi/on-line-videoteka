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

exports.updateUser = (req, res, next) => {
  const userData = req.body;
  const userId = req.body.id;
    const patchData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      dateOfBirth: userData.dateOfBirth,
      email: userData.email,
      role: userData.role
  }
  if(userData.password) {
    const newPassword = bcrypt.hashSync(req.body.password, 10);
    patchData['password'] = newPassword;
  }
  User.findOneAndUpdate( { _id: userId }, patchData ).then(
    (updatedUser, err) => {
      if(updatedUser){
        res.status(201).json({
          message: 'User update worked',
          old: updatedUser
        });
      } else {
        res.status(201).json({
          message: 'User updated successfuly!'
        });
      }
    }
  );
}

exports.deleteUser = (req, res, next) => {
  User.deleteOne({ _id: req.params.id}).then(
    (result) => {
      if(result.n > 0) {
        res.status(201).json({message: 'User deleted!'});
      } else {
        res.status(500).json({
          message: 'User delete failed (ID not found)'
        });
      }
    }
  )
}

exports.userChangePassword = (req, res, next) => {
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const userEmail = req.body.email;
  User.findOne({ email: userEmail }).then( user => {
    if(!user){
      return res.status(401).json({ massage: 'That is not your registered email' });
    }
    userFound = user;
    return bcrypt.compare(oldPassword, user.password);
  }).then(
    (compareRes) => {
      if(!compareRes){
        return res.status(401).json({ massage: 'Wrong password' });
      }
      bcrypt.hash(newPassword, 10).then( hash => {
        User.findOneAndUpdate( { email: userEmail }, { password: hash } ).then(
          (updatedUser, err) => {
            if(updatedUser){
              res.status(201).json({
                message: 'Password change successful!',
                error: updatedUser
              });
            }
          }
        );
      });
    }
  );

}

exports.userChangeUserInfo = (req, res, next) => {
  const userData = req.body;
  const userId = req.body.id;
    const patchData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      dateOfBirth: userData.dateOfBirth,
      email: userData.email
  }

  User.findOneAndUpdate( { _id: userId }, patchData ).then(
    (updatedUser) => {
      if(updatedUser){
        res.status(201).json({
          message: 'User info data updated',
          info: updatedUser
        });
      } else {
        res.status(500).json({
          message: 'User indo update data failed'
        });
      }
    }
  );
}


exports.getUsers = (req, res, next) => {
  const pageSize = parseInt(req.query.pagesize) ;
  const currentPage = parseInt(req.query.page);

  const userQuery = User.find({}, { password: 0});

  if (pageSize && currentPage) {
    userQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  let fetchedUsers;
  userQuery.then(
    (usersData) => {
      fetchedUsers = usersData;
      return User.count();
    }
  ).then(
    count => {
      res.status(200).json(
        {
          users: fetchedUsers,
          message: 'Users fetched',
          maxUsers: count
        }
      );
    }
  );
}

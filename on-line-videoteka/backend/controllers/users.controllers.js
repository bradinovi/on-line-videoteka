const User = require('../models/user');
const Rent = require('../models/rent');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');

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
        console.log('CREATED USER   ' + result._id);
        const token = jwt.sign({ userId: result._id }, process.env.EMAIL_ACT_SEC);
        var link = req.protocol + '://' + req.get('host') + '/' + 'api/users/verify/' + token;
        console.log(link);
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'moviestacks.acc.management@gmail.com',
            pass: 'borna1997'
          }
        });
        var mailOptions = {
          from: 'moviestacks.acc.management@gmail.com',
          to: req.body.email,
          subject: 'Movistacks Account Verification',
          text: 'Thanks for registering at Moviestacks. Here is your varification link: ' + link
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
          } else {
            res.status(201).json({
              massage: 'User created!',
              result: result
            });
            console.log('Email sent: ' + info.response);
        }
        });


      })
  });
}

exports.loginUser = (req, res, next) => {
  let userFound = {};
  User.findOne({ email: req.body.email, verified: true }).then( user => {
    if(!user){
      console.log('email or activated');
      return res.status(401).json({ error: 'Email not registered or activated.' });
    }
    userFound = user;
    return bcrypt.compare(req.body.password, user.password);
  }).then(result => {
    if(typeof(result) !== 'object') {
      if(!result){
        return res.status(401).json({ error: 'Wrong password' });
      } else {
        const token = jwt.sign(
          { email:userFound.email, userId: userFound._id, role: userFound.role },
          process.env.PASSWORD_SEC,
          { expiresIn: '3h'});

        return res.status(200).json({
          token: token,
          expiresIn: 10800,
          userId: userFound._id,
          role: userFound.role
        })
      }
    }
  }).catch(
    err => {
      console.log('error se desi');
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
  Rent.deleteMany({user: req.params.id}).then(
    () => {
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
  );
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
  const userId = req.userData.userId;
    const patchData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      username: userData.username,
      dateOfBirth: userData.dateOfBirth
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
  textQuery = req.query.text;

  let userQuery;
  if(textQuery){
    userQuery = User.find({ $text: { $search: textQuery } });
  } else {
    userQuery = User.find({}, { password: 0});
  }

  if (pageSize && currentPage) {
    userQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  let fetchedUsers;
  userQuery.then(
    (usersData) => {
      fetchedUsers = usersData;
      return User.count(userQuery);
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

exports.verifyUser = (req, res, next) => {
  // res.status(200).json({ drek: req.params.token});

  try {
    const token = req.params.token;
    const decodedToken = jwt.verify(token, process.env.EMAIL_ACT_SEC);
    console.log('DECODED ID:  ' +decodedToken.userId);
    User.findOneAndUpdate({ _id: decodedToken.userId}, { verified: true }).then(
      (update) => {
        console.log(update);
        if (update) {
          res.redirect(process.env.REDIRECT_URL + 'login?ver=1');
        } else {
          res.redirect(process.env.REDIRECT_URL + 'login?ver=0');
        }
      }
    )
  } catch (error) {

      console.log(error);
      res.redirect(process.env.REDIRECT_URL + 'login?error=1');

  }
}

exports.issueNewPassword = (req, res, next) => {
  const newPasswordString = Math.random().toString(36).substring(0,20);
  bcrypt.hash(newPasswordString, 10).then( hash => {
    User.findOneAndUpdate({ email: req.body.email },{ password: hash}).then(
      (data) => {
        if(data) {
          //
          var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'moviestacks.acc.management@gmail.com',
              pass: 'borna1997'
            }
          });
          var mailOptions = {
            from: 'moviestacks.acc.management@gmail.com',
            to: req.body.email,
            subject: 'New Password',
            text: 'Your new password is:' + newPasswordString
          };
          transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
              console.log(error);
            } else {
              res.status(200).json({message: 'Password sent to email'});
              console.log('Email sent: ' + info.response);
          }
          });
        } else {
          res.status(401).json({message: 'Email does not exist'})
        }
      }
    );
  });

}

exports.getUserInfo = (req, res, next) => {
  User.findById(req.userData.userId).then(
    userData => {
      res.status(200).json(
        {
          message: 'User data fetched',
          myprofile: userData
        }
      );
    }
  );
}

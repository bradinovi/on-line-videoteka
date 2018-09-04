const Role = require('../models/role');
const Movie = require('../models/movie');
const Actor = require('../models/actor');
const  async = require('async');
const mongoose= require('mongoose');

exports.addRole = (req, res, next) => {
  // TO DO: Add Role, Add to Actor roles[], Add to Movie roles[]
  const movieId = req.body.movie;
  const actorId = req.body.actor;

  if (movieId.length < 24 || actorId.length < 24) {
    res.status(400).json({
      error: 'Data not valid'
    });
  } else{
  const role = new Role({
    movie: movieId,
    actor: actorId,
    name: req.body.name
  });

  role.save().then(
    createdRole => {
    const roleId = createdRole._id.toString();
    const movieId = createdRole.movie.toString();
    const actorId = createdRole.actor.toString();

    Actor.update({ _id: actorId }, { $push: {roles: roleId}}).then((actorRoleUpdateData)=>{
      const actorRoleUpdateRes = actorRoleUpdateData;
      console.log(actorRoleUpdateData);
      if( actorRoleUpdateRes.n > 0 ){
        Movie.update({ _id: movieId }, { $push: {roles: roleId}}).then((movieRoleUpdateData)=>{
          console.log(movieRoleUpdateData);
          if(movieRoleUpdateData.n > 0 ){
            res.json({
              message: 'Role added successfuly'
            });
          } else {
            Role.deleteOne({_id:roleId}).then((deleteData) => {
              Actor.update({ _id: actorId }, { $pull: { roles: roleId}}).then((deleteActorRoleData) =>{
                res.status(400).json({
                  error:'Role does not exist'
                });
              });
            });
          }
        });
      } else {
        Role.deleteOne({_id:roleId}).then((deleteData) => {
          res.status(400).json({
            message: 'Role does data not valid'
          });
        });
      }
    });
  })
}
}

exports.getRolesActor = (req, res, next) => {
  // TO DO: Get Roles for Actor -> JOIN Roles with Movie
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let roleQuery  = Role.find({ actor: req.params.actorId }).populate({ path: 'movie', select: 'title' });
  console.log(req.params.actorId);
  if (pageSize && currentPage) {
    roleQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  roleQuery.then((documents) => {
    fetchedRoles = documents;
    return Role.count();
  })
  .then( count => {
    res.json({
      message: 'Actor roles fetched succesfully!',
      roles: fetchedRoles,
      maxGenres: count
    });
  }).catch( error =>{
    res.status(500).json({
      error: 'Fatching Roles for Actor failed!'
   });
  });
 }

exports.getRolesMovie = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let roleQuery  = Role.find({ movie: req.params.movieId }).populate({ path: 'actor', select: 'firstName lastName portraitPath' });

  if (pageSize && currentPage) {
    roleQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  roleQuery.then((documents) => {
    fetchedRoles = documents;
    return Role.count();
  })
  .then( count => {
    res.json({
      message: 'Movie roles fetched succesfully!',
      roles: fetchedRoles,
      maxGenres: count
    });
  }).catch( error =>{
    res.status(500).json({
      error: 'Fatching Roles for Movie failed!'
   });
  });
}



exports.getRole = (req, res, next) => {
  // TO DO: GET ROLE BY roleId
  Role.find({_id: req.params.id})
    .populate({ path: 'actor', select: 'firstName lastName portraitPath' })
    .populate(({ path: 'movie', select: 'title' })).then(
      (roleFound) => {
        res.json(
          {
            message: "Role found",
            role: roleFound
          }
        )
      }
  ).catch( (err) => {
    res.status(500).json({
      error: 'Fatching Role failed!'
    });
  });


}

exports.updateRole = (req, res, next) => {
  const roleId = req.body.id;
  const actorId = req.body.actor;
  const movieId = req.body.movie;
  const name = req.body.name;

  Role.findById(roleId).then(
    role => {
      const roleUpdate = new Role({
        _id: roleId,
        movie: movieId,
        actor: actorId,
        name: name
      });
      if(actorId === role.actor.toString()) {
        // TO DO - Update Name of role
        Role.updateOne({ _id : roleId}, roleUpdate).then( (updateRes) =>{
          res.status(201).json({
            message: 'Role name updated!'
          });
        });
      } else {
        // TO DO - Update actor role array  and Update role actor
        Role.updateOne({ _id : roleId}, roleUpdate).then( (updateRes) =>{
          Actor.update({ _id: role.actor }, { $pull: { roles: roleId}}).then((resb) =>{
            Actor.update({ _id: actorId }, { $push: { roles: mongoose.Types.ObjectId(roleId)}}).then((resb) =>{
              res.status(201).json({message: 'Actor on role updated'});
            });
          });
        });
      }
    }
  )

}

exports.deleteRole = (req, res, next) => {
  Role.findById(req.params.id).then((role) => {
    console.log(role);
    const roleId = role.id;
    const movieId = role.movie;
    const actorId = role.actor;
    console.log('Movie:' + movieId);
    console.log('Actor:' + actorId);
    Role.deleteOne({ _id: req.params.id }).then( result => {
      if(result.n > 0) {
        Movie.update({ _id: movieId }, { $pull: { roles: roleId}}).then((resa) =>{
          console.log(resa);
          Actor.update({ _id: actorId }, { $pull: { roles: roleId}}).then((resb) =>{
            console.log(resb);
            res.status(201).json({message: 'Role deleted!'});
          });
        });
      } else {
        res.status(400).json({
          error: {message: 'Role does not exist!'}
       });
      }
    });
  });



}

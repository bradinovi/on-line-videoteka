const Actor = require('../models/actor')

exports.getActors = (req, res, next) => {
  console.log("working")
  res.status(200).json({message: 'OK'});
}

exports.getActor = (req, res, next) => {
  res
}

exports.addActor = (req, res, next) => {
  console.log(req.body);
  const url = req.protocol + '://' + req.get("host");

  const actor = new Actor({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    born: new Date(req.body.born),
    died: new Date(req.body.died),
    ocupations: JSON.parse( req.body.ocupations),
    bio: req.body.bio,
    portraitPath: url + "/images/portrait" + req.file.filename,
  });
  actor.save().then( createdActor => {
    res.status(201).json({
      message: 'Actor added successfully'
    })
  })
}

exports.deleteActor = (req, res, next) => {

}

exports.updateActor = (req, res, next) => {

}

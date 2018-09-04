const Actor = require('../models/actor')

exports.getActors = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  let actorQuery;
  let fetchedActors;
  const textQuery = req.query.text;
  if(textQuery){
    actorQuery = Actor.find({ $text: { $search: textQuery } });
  } else {
    actorQuery = Actor.find();
  }
  actorQueryCount = Actor.count(actorQuery);
  if (pageSize && currentPage) {
    actorQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  actorQuery.then((documents) => {
    fetchedActors = documents;
    return actorQueryCount;
  })
  .then( count => {
    res.json({
      message: 'Actors fetched succesfully!',
      actors: fetchedActors,
      maxActors: count
    });
  }).catch( error =>{
    res.status(500).json({
      error: 'Fatching Actors failed!',
   });
  });
}

exports.getActor = (req, res, next) => {
  Actor.findById(req.params.id).then( actor => {
    if(actor){
      res.json(actor);
    } else {
      res.status(400).json({error: 'Actor not found'});
    }
  }).catch( error =>{
    res.status(500).json({
      error: 'Fatching Actor failed!',
    });
  })
}

exports.addActor = (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  let born = null;
  let died = null;
  if (req.body.born !== '') {
    born = new Date(req.body.born);
  }
  if (req.body.died !== '') {
    died = new Date(req.body.died);
  }
  const actor = new Actor({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    born: born,
    died: died,
    ocupations: JSON.parse(req.body.ocupations).ocupations,
    bio: req.body.bio,
    portraitPath: url + "/images/portrait/" + req.file.filename,
  });
  actor.save().then( createdActor => {
    res.status(201).json({
      message: 'Actor added successfully'
    })
  })
}

exports.deleteActor = (req, res, next) => {
  console.log(req.params.id);
  Actor.deleteOne({ _id: req.params.id }).then( result => {
    if(result.n > 0) {
      res.status(200).json({
        message: 'Actor deleted successfully',
     });
    } else {
      res.status(400).json({
        error: 'Actor does not exist in database'
     });
    }
  });
}

exports.updateActor = (req, res, next) => {
  console.log(req.body);
  let imagePath = req.body.imagePath;
  let occupationsForDB = req.body.ocupations.ocupations;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/portrait" + req.file.filename;
    occupationsForDB = JSON.parse(req.body.ocupations).ocupations;
  };

  const actor = new Actor({
    _id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    born: new Date(req.body.born),
    died: new Date(req.body.died),
    ocupations: occupationsForDB,
    bio: req.body.bio,
    portraitPath: imagePath,
  });

  Actor.updateOne({ _id: req.body.id }, actor).then((result) => {
    console.log(result);
    if(result.n > 0) {
      res.json({
        message: 'Actor updated successfully',
     });
    } else {
      res.status(400).json({
        error: 'Actor does not exist',
     });
    }

  }).catch(error =>{
    res.status(500).json({
      error: 'Failed update Actor',
   });
    console.log(error);
  });
}

exports.getActorsBySearch = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const actorQuery = Actor.find();
  let fetchedActors;
  if (pageSize && currentPage) {
    actorQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  actorQuery.then((documents) => {
    fetchedActors = documents;
    return Actor.count();
  })
  .then( count => {
    res.json({
      message: 'Actors fetched succesfully!',
      actors: fetchedActors,
      maxPosts: count
    });
  }).catch( error =>{
    res.status(500).json({
      error: 'Fatching Actors failed!',
   });
  });
}

exports.getDirectedByActor = (req, res, next) => {
  const actorId = req.params.id;

  Actor.find({_id:actorId},'firstName lastName').populate({ path: 'directed', select: 'title _id' }).then(
    (directed) => {
      res.json({
        directed: directed[0]
      });
    }
  );
}

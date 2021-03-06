const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes= require('./routes/users');
const actorRoutes= require('./routes/actors');
const movieRoutes = require('./routes/movies');
const genreRoutes = require('./routes/genres');
const roleRoutes = require('./routes/roles');
const rentsRoutes = require('./routes/rents');

const app = express();
// mongodb+srv://borna:qsnjMteIbEfJotQS@clustermeanudemy-mcba4.mongodb.net/node-angular
mongoose.connect('mongodb+srv://videoteka:'+ process.env.MONGO_ACCESS + '@videoteka-aippe.mongodb.net/test?retryWrites=true', {useNewUrlParser: true}).then(() => {
  console.log('Database connected...')
}).catch(() => {
  console.log('Connection failed! Error when connecting to database!!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('/images', express.static(path.join('backend/images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
});

app.use('/api/users', userRoutes);

app.use('/api/actors', actorRoutes);

app.use('/api/movies', movieRoutes);

app.use('/api/genres', genreRoutes);

app.use('/api/roles', roleRoutes);

app.use('/api/rents', rentsRoutes);

module.exports = app;

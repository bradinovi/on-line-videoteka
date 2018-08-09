const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes= require('./routes/users');



const app = express();
// mongodb+srv://borna:qsnjMteIbEfJotQS@clustermeanudemy-mcba4.mongodb.net/node-angular
mongoose.connect('mongodb+srv://videoteka:9mD738nncgx1JjgT@videoteka-aippe.mongodb.net/test?retryWrites=true').then(() => {
  console.log('Database connected...')
}).catch(() => {
  console.log('Connection failed! Error when connecting to database!!');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods','GET, POST, PATCH, DELETE, OPTIONS, PUT');
  next();
});

/*
app.use('/api/posts', postsRoutes);
*/
app.use('/api/users', userRoutes);

module.exports = app;

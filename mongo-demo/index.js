'use strict';

require('dotenv').config('.env');
const mongoose = require('mongoose');
const mongoDbServer = process.env.mongoDbServer;
const mongoDatabase = process.env.mongoDatabase;



mongoose.connect(`mongodb://${mongoDbServer}/${mongoDatabase}`, { useNewUrlParser: true }) //connect method, returns a promise
  .then(() => console.log('OK...connected to mongoDB!'))
  .catch(err => console.log('ERROR...connecting to mongoDB!', err));

'use strict';

require('dotenv').config('.env');
const mongoose = require('mongoose');
const mongoDbServer = process.env.mongoDbServer;
const mongoDatabase = process.env.mongoDatabase;

// mongoose is mongodb (native driver for interacting with a mongodb instance) PLUS an object modelling tool. 
// SCHEMA in MONGOOSE: (schema is not part of mongoDB, it is specific to mongoose)
// use schema to define the shape of documents withing a collection in mongoDB



mongoose.connect(`mongodb://${mongoDbServer}/${mongoDatabase}`, { useNewUrlParser: true }) //connect method, returns a promise
  .then(() => console.log('OK...connected to mongoDB!'))
  .catch(err => console.log('ERROR...connecting to mongoDB!', err));

// schema, defines the shape of documents in a mongoDB database
const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [ String ],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

// once we have a schema, we have to compile that into a model,
// which gives us a Class...
// next we can create an Object based on that Class...
// and this object maps to a document in a mongoDB database


const Course = mongoose.model('Course', courseSchema);
const course = new Course({
  name: 'Node.js Course',
  author: 'Mosh',
  tags: ['node', 'backend'],
  isPublished: true
});

course.save(); // course here is a document(object), the save method returns a promise

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
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean
});

// once we have a schema, we have to compile that into a model,
// which gives us a Class...
// next we can create an Object based on that Class...
// and this object maps to a document in a mongoDB database


const Course = mongoose.model('Course', courseSchema);


async function createCourse() {
  const course = new Course({
    name: 'Angular Course',
    author: 'Mosh',
    tags: ['angular', 'frontend'],
    isPublished: true
  });

  const result = await course.save(); // course here is a document(object), the save method returns a promise
  console.log(result);
}

//createCourse();




// querying documents
async function getCourses(){
  //
  // COMPARISON OPERATORS
  //
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)




  const courses = await Course
  
  //.find({ price: { $gte: 10, $lte: 20 } }) // only where price is at least 10 but not higher than 20
  //.find({ price: {$in: [10, 15, 20]} }) // 10 or 15 or 20
  .find({author: 'Mosh', isPublished: true}) // filter the resulting documents
  .limit(10)
  .sort({name: 1})
  .select({name: 1, tags: 1}); // only select the property you want from the document
  console.log(courses);
}

getCourses();




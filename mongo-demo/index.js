'use strict';

require('dotenv').config('.env');
const mongoose = require('mongoose');
const mongoDbServer = process.env.mongoDbServer;
const mongoDatabase = process.env.mongoDatabase;

// mongoose is mongodb (native driver for interacting with a mongodb instance) PLUS an object modelling tool. 
// SCHEMA in MONGOOSE: (schema is not part of mongoDB, it is specific to mongoose)
// use schema to define the shape of documents withing a collection in mongoDB


// connect using mongoose
mongoose.connect(`mongodb://${mongoDbServer}/${mongoDatabase}`, { useNewUrlParser: true }) //connect method, returns a promise
  .then(() => console.log('OK...connected to mongoDB!'))
  .catch(err => console.log('ERROR...connecting to mongoDB!', err));

// schema, defines the shape of documents in a mongoDB database.
// create schema
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

// Course = Collection (table in SQL) = Class
// course = document (row/record in SQL) = object






// add document to a collection 
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




// querying documents with collection methods chain
async function getCourses() {
  //
  // COMPARISON OPERATORS!
  //
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)
  //
  // LOGICAL OPERATORS!
  //
  // or .or([ {filter object} ])  <-- the find() method ahead of it will be empty
  // and .and([ {filter object} ])  <-- works the same way as or

  const pageNumber = 2;
  const pageSize = 10;
  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course

    //.find({ price: { $gte: 10, $lte: 20 } }) // only where price is at least 10 but not higher than 20
    //.find({ price: {$in: [10, 15, 20]} }) // 10 or 15 or 20
    .find({ author: 'Mosh', isPublished: true }) // filter the resulting documents
    //.find()
    //.or([  {author: 'Mosh'}, {isPublished: true}  ])  // filter objects! the .find() method ahead of .or() is empty! Result: documents where author is Mosh OR it is published
    .skip((pageNumber - 1) * pageSize) // pagination method, together with following .limit() method
    .limit(pageSize) // .limit(10) <-- show 10 documents max.
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 }); // only select the property you want from the document
  //.countDocuments(); // returns the number of docs. that match the above criteria
  console.log(courses);
}

// you either use .countDocuments() OR .select()

//getCourses();







// UPDATING a document - 2 approaches
async function updateCourseQF(id) {
  // approach: query first (QF)
  // findById()
  // modify its properties
  // save


  const course = await Course.findById(id);
  if (!course) {
    return console.log('there is no course with that id');
  }

  //course.isPublished = true;
  //course.author = 'Another Author';

  course.set({
    isPublished: true,
    author: 'Another Author'
  });

  const result = await course.save();
  console.log(result);

}

//updateCourseQF('5d175ec39a28d921a8c4a8df');




async function updateCourseUF(id) {
  // USAGE: likes, upvotes/downvotes

  // approach: update first (UF)
  // update directly
  // optionally - get the updated document

  // mongodb UPDATE OPERATORS are needed for the collections .update() methods second paramater,
  // that is an UPDATE OBJECT
  // docs.mongodb.com/manual/reference/operator/update

  const result = await Course.update({ _id: id }, {
    $set: {
      author: 'Mosh',
      isPublished: false
    }
  }
  ); //{ isPublished: false } -- you could update all those documents where isPublished is false


  console.log(result); // result here is similar to OK Packet in MySQL

}

//updateCourseUF('5d175ec39a28d921a8c4a8df')




// get the document that was updated
async function updateCourseUF2(id) {


  const course = await Course.findByIdAndUpdate(id, {
    $set: {
      author: 'Jason',
      isPublished: false
    }
  }, { new: true }); // , { new: true } without this you will get the document back before the update process


  // printing the resulting record (object) THIS IS THE DOCUMENT BEFORE THE UPDATE OPERATION
  //
  // if you need the updated document back you need to pass an option... { new: true }
  //
  //



  console.log(course);


}

updateCourseUF2('5d175ec39a28d921a8c4a8df')

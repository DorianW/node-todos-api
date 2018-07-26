//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').insertOne({
  //   text: 'Something',
  //   completed: false
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Error while insertOne', err);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // User name, age, location

  // db.collection('Users').insertOne({
  //   name: 'Dorian',
  //   age: 30,
  //   location: 'Berlin'
  // }, (err, result) => {
  //   if (err) {
  //     return console.log('Error while insertOne of user', err);
  //   }
  //   console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2));
  // });

  db.close();
});

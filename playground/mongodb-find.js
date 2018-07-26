//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }
  console.log('Connected to MongoDB server');

  // db.collection('Todos').find({
  //   _id: new ObjectID('5b58df46e8af3c1881f37b1f')
  // }).toArray().then((docs) => {
  //   console.log('Todos:');
  //   console.log(JSON.stringify(docs, undefined, 2));
  //
  // }, (err) => {
  //   if (err) {
  //     console.log('Error while todos to array call', err);
  //   }
  // });

  // db.collection('Todos').find().count().then((count) => {
  //   console.log('Todos count:', count);
  // }, (err) => {
  //   if (err) {
  //     console.log('Error while counting todos', err);
  //   }
  // });

  db.collection('Users').find({name : 'Dorian'}).toArray().then((docs) => {
    console.log('Users with the name "Dorian"');
    console.log(JSON.stringify(docs, undefined, 2));
  }, (err) => {
    console.log('Error while taking all users with the name "Dorian"', err);
  })

  //db.close();
});

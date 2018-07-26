//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }
  console.log('Connected to MongoDB server');

  // deleteMany
  // db.collection('Todos').deleteMany({text : 'Eat lunch'}).then((result) => {
  //   console.log(result);
  // }, (err) => {
  //   if (err) {
  //     console.log('Unable to deleteMany', err);
  //   }
  // });
  //
  // // deleteOne
  // db.collection('Todos').deleteOne({text : 'Mach was du willst :)'}).then((result) => {
  //   console.log(result);
  // }, (err) => {
  //   if (err) {
  //     console.log('Unable to deleteMany', err);
  //   }
  // });

  // findOneAndDelete

  // db.collection('Todos').findOneAndDelete({completed : false}).then((result) => {
  //   console.log(result);
  // }, (err) => {
  //   if (err) {
  //     console.log('Unable to deleteMany', err);
  //   }
  // });

  db.collection('Users').findOneAndDelete({_id: new ObjectID('5b58e2dc95ebdc189b4f204b')}).then((result) => {
    console.log(result);
  }, (err) => {
    console.log(err);
  });

  db.collection('Users').deleteMany({name: 'Jasper'});


  //db.close();
});

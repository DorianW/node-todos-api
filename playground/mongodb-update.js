//const MongoClient = require('mongodb').MongoClient;

const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
  if (err) {
    return console.log('Unable to connect to MongoDB server', err);
  }
  console.log('Connected to MongoDB server');

// findOneAndUpdate

db.collection('Users').findOneAndUpdate({name: 'Dorian'},{
  $inc: {
    age: 1
  }
}, {
  returnOriginal: false
}).then((results => {
  console.log(results);
}, (err) => {
  console.log(err);
}));

  //db.close();
});

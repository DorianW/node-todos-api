
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var theID = '5b59e90ac587dc451e12a757';

if (!ObjectID.isValid(theID)) {
  console.log('The ID is not valide');
}

// Todo.find({
//   _id: theID
// }).then((todos) => {
//   console.log(todos);
// });

// Todo.findOne({
//   _id: theID
// }).then((todo) => {
//   console.log(todo);
// });

// Todo.findById(theID).then((todobyid) => {
//   if (!todobyid) {
//     return console.log('Id not found');
//   }
//   console.log(todobyid);
// }).catch((e) => {
//   console.log(e);
// })

//user find by ID 1. user not found, user found, errors
User.findById(theID).then((user) => {
  if (!user) {
    return console.log('No user found');
  } else {
    console.log(user);
  }

}, (err) => {
  if (err) {
    console.log(err);
  }
}).catch((err) => {
  console.log(e);
})

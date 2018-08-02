const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');
var {Todo} = require('./../../models/todo');
var {User} = require('./../../models/user');


const idForTesting = new ObjectID();
const idForTesting2 = new ObjectID();

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

//Todos
const todos = [{
  text: 'First test todo',
  _id: idForTesting,
  _creator: userOneId
}, {
  text: 'Second test todo',
  _id: idForTesting2,
  completed: true,
  completedAt: 666,
  _creator: userTwoId
}]

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
}

//Users
const users = [{
  _id: userOneId,
  email: 'name@example.com',
  password: 'abc123',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id:userOneId, access: 'auth'}, 'secret value').toString()
  }]
}, {
  _id: userTwoId,
  email: 'secondName@example.com',
  password: 'secondUserPassword',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id:userTwoId, access: 'auth'}, 'secret value').toString()
  }]
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();

    return Promise.all([userOne, userTwo]);
  }).then(() => done());
}

module.exports = {todos, populateTodos, idForTesting, idForTesting2, populateUsers, users, userOneId, userTwoId}

require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();

//Check midware again
app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
  var text = req.body.text;
  var newTodo = new Todo({
    text,
    _creator: req.user._id
  });

  newTodo.save().then((doc) => {
    res.status(200).send(doc);
  }, (err) => {
    if (err) {
    res.status(400).send(err);
    }
  });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({
    _creator: req.user._id
  }).then((todos) => {
    res.send({todos});
  }, (err) => {
    if (err) {
      res.status(400).send(e);
    }
  })
});

app.get('/todos/:id', authenticate, (req, res) => {
  var {id} = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send({error:'Invalid ID'});
  }

  Todo.findOne({
    _id: id,
    _creator: req.user._id
  }).then((todo) => {
    if (todo) {
      res.send({todo});
    } else {
      res.status(404).send();
    }
  }, (err) => {
    if (err) {
      res.status(400).send(e);
    }
  })
});

app.delete('/todos/:id', authenticate, async (req, res) => {
  var {id} = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send({error:'Invalid ID'});
  }

  try {
    const todo = await Todo.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });

    if (todo) {
      res.status(200).send({todo});
    } else {
      res.status(404).send();
    }

  } catch (e) {
    res.status(400).send(e);
  }
});

app.patch('/todos/:id', authenticate, (req, res) => {
  var {id} = req.params;
  var body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    return res.status(400).send({error:'Invalid ID'});
  }

  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findOneAndUpdate({
    _id: id,
    _creator: req.user._id}, {
    $set: body
  }, {
    new: true
  }).then((todo) => {
    if (!todo) {
      return res.status(404).send();
    }
    res.status(200).send({todo});

  }).catch((e) => {
    res.status(400).send();
  });

});

//Users
app.post('/users', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User(body);

  try {
    await user.save();
    const token = await user.generateAuthToken();
    res.header('x-auth', token).status(200).send(user.toJSON());
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', async (req, res) => {
  try {
    const body = _.pick(req.body, ['email', 'password']);
    const user = await User.findByLogin(body.email, body.password);
    const token = await user.generateAuthToken();
    res.header('x-auth', token).status(200).send(user);
  } catch (e) {
    res.status(401).send();
  }
});

app.delete('/users/me/token', authenticate, async (req, res) => {
  try {
    await req.user.removeToken(req.token);
    res.status(200).send();
  } catch (e) {
    res.status(400).send();
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Started on port ${process.env.PORT}`);
});

module.exports = {app};

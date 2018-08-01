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

app.post('/todos', (req, res) => {
  var text = req.body.text;
  var newTodo = new Todo({text});
  newTodo.save().then((doc) => {
    res.status(200).send(doc);
  }, (err) => {
    if (err) {
    res.status(400).send(err);
    }
  });
});

app.get('/todos', (req, res) => {
  Todo.find().then((todos) => {
    res.send({todos});
  }, (err) => {
    if (err) {
      res.status(400).send(e);
    }
  })
});

app.get('/todos/:id', (req, res) => {
  var {id} = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send({error:'Invalid ID'});
  }

  Todo.findById(id).then((todo) => {
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

app.delete('/todos/:id', (req, res) => {
  var {id} = req.params;
  if (!ObjectID.isValid(id)) {
    return res.status(400).send({error:'Invalid ID'});
  }

  Todo.findByIdAndRemove(id).then((todo) => {
    if (todo) {
      res.status(200).send({todo});
    } else {
      res.status(404).send();
    }
  }, (err) => {
    if (err) {
      res.status(400).send(e);
    }
  })
});

app.patch('/todos/:id', (req, res) => {
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

  Todo.findByIdAndUpdate(id, {
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
app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).status(200).send(user.toJSON());
  })
  .catch((err) => {
    //console.log(err);
    res.status(400).send(err);
  });

});

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.listen(process.env.PORT, () => {
  console.log(`Started on port ${process.env.PORT}`);
});

module.exports = {app};

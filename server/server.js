var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

const port = process.env.PORT || 3000;

//Check midware again
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  //console.log(req.body);
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
//check if is ID valid if not send 400 send empty body
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
//check if is ID valid if not send 400 send empty body
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



app.listen(port, () => {
  console.log(`Started on port ${port}`);
})

module.exports = {app};

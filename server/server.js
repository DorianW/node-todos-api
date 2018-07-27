var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/Todo');
var {User} = require('./models/User');

var app = express();

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
  return res.status(400).send('Invalid ID');
}

  Todo.findById(id).then((todo) => {
    if (todo) {
      res.send({todo});
    } else {
      res.send();
    }
  }, (err) => {
    if (err) {
      res.status(400).send(e);
    }
  })
});



app.listen(3000, () => {
  console.log('Started on port 3000');
})

module.exports = {app};

var express = require('express');
var bodyParser = require('body-parser');

var {mangoose} = require('./db/mongoose');
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



app.listen(3000, () => {
  console.log('Started on port 3000');
})

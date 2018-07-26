var express = require('express');
var bodyParser = require('body-parser');

var {mangoose} = require('./db/mongoose');
var {Todo} = require('./models/Todo');
var {User} = require('./models/User');

var app = express();

app.listen(3000, () => {
  console.log('Started on port 3000');
})

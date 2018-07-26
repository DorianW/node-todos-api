const mongoose = require('mongoose');

// Lets active first levery party promise solution
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ToDoApp');

var Todo = mongoose.model('Todo', {
  text: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Number,
    default: null
  }
});

var newTodo = new Todo({text: '     Add this video     '});

newTodo.save().then((doc) => {
  console.log(doc);
}, (err) => {
  console.log(err);
});

// ---

//new user model for email, require it  + trim it and min minlength
var User = mongoose.model('User', {
  email: {
    type: String,
    required: true,
    minlength: 3,
    trim: true
  }
});

var newUser1 = new User({email: ' ko  '});
var newUser2 = new User({email: 'dorianwojda@googlemail.com'});

newUser1.save().then((doc) => {
  console.log(doc);
}, (err) => {
  console.log(err);
});

newUser2.save().then((doc) => {
  console.log(doc);
}, (err) => {
  console.log(err);
});

// ---

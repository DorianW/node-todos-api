const mongoose = require('mongoose');

// Lets active first levery party promise solution
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ToDoApp');

module.exports = {mongoose};

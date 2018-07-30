const mongoose = require('mongoose');

// Lets active first levery party promise solution
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ToDoApp');

module.exports = {mongoose};

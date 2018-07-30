require('./../config/config');

const mongoose = require('mongoose');

// Lets active first levery party promise solution
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};

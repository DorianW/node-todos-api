
const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var theID = '5b59e90ac587dc451e12a757';

if (!ObjectID.isValid(theID)) {
  console.log('The ID is not valide');
}


/*

Todo.removeOneAndRemove({}).then()

*/

/*

Todo.findByIdAndRemove(ID).then()

*/
Todo.findByIdAndRemove('5b5b526ad765c12a744af18f').then((todo) => {
  console.log(todo);
})

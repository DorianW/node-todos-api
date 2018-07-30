const expect = require('expect');
const request = require('supertest');
const {mongoose} = require('./../db/mongoose');

const {app} = require('./../server');
const Todo = mongoose.model('Todo');
const {ObjectID} = require('mongodb');

const idForTesting = new ObjectID();

const todos = [{
  text: 'First test todo',
  _id: idForTesting
}, {
  text: 'Second test todo',
  _id: new ObjectID()
}]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
});

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';
    request(app)
    .post('/todos')
    .send({text})
    .expect(200)
    .expect((response) => {
      expect(response.body.text).toBe(text)
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.find({text:'Test todo text'}).then((todos) => {
        expect(todos.length).toBe(1);
        expect(todos[0].text).toBe(text);
        done();
      }).catch((e) => done(e));
    })
  });

  it('should not create todo with invalide input', (done) => {
    request(app)
    .post('/todos')
    .send()
    .expect(400)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.find().then((todos) => {
        expect(todos.length).toBe(2);
        done();
      }).catch((e) => done(e));
    })
  })
});


describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
    .get('/todos')
    .expect(200)
    .expect((res) => {
      expect(res.body.todos.length).toBe(2);
    })
    .end(done);
  });
});

describe('GET /todos/:id', () => {
  it('should return todo document with proper ID', (done) => {
    request(app)
    .get(`/todos/${idForTesting.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(idForTesting.toHexString());
      expect(res.body.todo.text).toBe(todos[0].text);
    })
    .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    //by ID
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return 400 for non-object id', (done) => {
    //by ID todos/123
    request(app)
    .get('/todos/123')
    .expect(400)
    .end(done);
  });
});

describe('DELETE /todos/:id', () => {
  it('should delete todo document with proper ID', (done) => {
    request(app)
    .delete(`/todos/${idForTesting.toHexString()}`)
    .expect(200)
    .expect((res) => {
      expect(res.body.todo._id).toBe(idForTesting.toHexString());
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      Todo.findById(idForTesting.toHexString()).then((todo) => {
        expect(todo).toBeFalsy();
        done();
      }).catch((e) => done(e));
    });
  });

  it('should return 404 if todo not found', (done) => {
    //by ID
    request(app)
    .get(`/todos/${new ObjectID().toHexString()}`)
    .expect(404)
    .end(done);
  });

  it('should return 400 for non-object id', (done) => {
    //by ID todos/123
    request(app)
    .get('/todos/123')
    .expect(400)
    .end(done);
  });
});

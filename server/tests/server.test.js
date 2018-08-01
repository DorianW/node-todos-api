const expect = require('expect');
const request = require('supertest');
const _ = require('lodash');

const {mongoose} = require('./../db/mongoose');
const {app} = require('./../server');

const Todo = mongoose.model('Todo');
const User = mongoose.model('User');
const {ObjectID} = require('mongodb');

const {todos, populateTodos, idForTesting, idForTesting2, populateUsers, users, userOneId, userTwoId} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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

describe('PATCH /todos', () => {
  it('should update the todos', (done) => {
    var text = "Updated by unit test";
    //get ID of first item, make patch request and send data to update text and set completed to true
    //check if 200 and custom expect, check text and completed is true and completed at is a number
    request(app)
    .patch(`/todos/${idForTesting.toHexString()}`)
    .send({
      text,
      completed: true
    })
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.findById(idForTesting.toHexString()).then((todo) => {
        expect(todo.completed).toBe(true);
        expect(typeof todo.completedAt).toBe('number');
        done();
      }).catch((e) => done(e));
    });
  });

  it('should clear completedAt when todo is not completed', (done) => {
    var text = "Updated by unit test";
    //get second id of id set completed to false
    //200
    //completed to false
    //completedAt null
    request(app)
    .patch(`/todos/${idForTesting2.toHexString()}`)
    .send({
      text,
      completed: false
    })
    .expect(200)
    .end((err, res) => {
      if (err) {
        return done(err);
      }
      Todo.findById(idForTesting.toHexString()).then((todo) => {
        expect(todo.completed).toBe(false);
        expect(todo.completedAt).toBe(null);
        done();
      }).catch((e) => done(e));
    });
  });
});

describe('GET /users/me', () => {
  it('should return user when authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString());
        expect(res.body.email).toBe(users[0].email);
      }).end(done);
  });

  it('should return 401 when user not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({});
      }).end(done);
  });
});

describe('POST /users', () => {
  it('should create user', (done) => {
    var email = '76tzcgvbugfdtc@domain.com';
    var password = '67tczvu7f6tzv';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((res) => {
        expect(res.headers['x-auth']).toBeTruthy();
        expect(res.body._id).toBeTruthy();
        expect(res.body.email).toBe(email);
      }).end((err) => {
        if (err) {
          return done(err);
        }
        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((err) => done(err));
      });
  });

  it('should return valideation erros if request invalid', (done) => {
    //send invalide email and invalide password
    var email = '76tzcgvbugfdtc';
    var password = 'a';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create user if email already in use', (done) => {
    //send used email
    var email = users[0].email;
    var password = 'abc123456';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password
    })
    .expect(200)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeTruthy();
    })
    .end((err, res) => {
      if (err) {
        return done(err);
      }

      User.findById(users[1]._id).then((user) => {
        expect(_.pick(user.tokens[0],['access', 'token'])).toMatchObject({
          access: 'auth',
          token: res.headers['x-auth']
        });
        done();
      }).catch((err) => done(err));
    });
  });

  it('should reject invalid login of user', (done) => {
    request(app)
    .post('/users/login')
    .send({
      email: users[1].email,
      password: users[1].password + 'bla'
    })
    .expect(401)
    .expect((res) => {
      expect(res.headers['x-auth']).toBeFalsy();
    })
    .end(done);
  });
});

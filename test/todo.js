let mongoose = require("mongoose");
let Todo = require('../models/todo');

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');

process.env.NODE_ENV = 'test'
let app = require('../app');

let should = chai.should();

chai.use(chaiHttp);

describe('Todos APP', () => {
    //const todo = {name: 'something else'}

    
    before((done) => {
        Todo.deleteMany({}, (err) => {
           done();
        });
    });
    
    describe("GET /todo", () => {
        it('Get all todos', (done) => {
            chai.request(app)
                .get('/api/todo')
                .end((err, response) => {
                    response.should.have.status(200);
                    response.body.should.be.a('array');
                done();
                })
        })
    });

    describe("POST api/todo", () => {
        
        const todo = {
            'name': 'Create Mocha'
        }
       
        it('It should POST a new todo', (done) => {
            chai.request(app)                
                .post('/api/todo')
                .send(todo)
                .end((err, response) => {
                    response.should.have.status(201);
                    response.body.should.be.a('object');
                    response.body.should.have.property('name').eq(todo.name);
                    response.body.should.have.property('completed').eq(false);
                done();
            });
        });

        it('it should not POST a todo without name field', (done) => {
            const todo = {
                'names': 'Create Mocha tests'
            }
            chai.request(app)
                .post('/api/todo')
                .send(todo)
                .end((err, res) => {
                    res.should.have.status(400);
                    res.body.should.have.property('message');
                done();
            });
        });
    
        it('It should not POST a new todo as same one alraedy exists', (done) => {
            chai.request(app)                
                .post('/api/todo')
                .send(todo)
                .end((err, response) => {
                    response.should.have.status(403);
                    response.body.should.be.a('object');
                    response.body.should.have.property('message').eq('todo already exists');
                done();
            });
        });
    })

    describe('PUT /todos/:id/done', async () => {

        it('It should UPTDATE todo status to "done"', (done) => {
            const todo = new Todo({name:'Push to github', completed: false});
            todo.save((err, todo) => {
                chai.request(app)                
                    .put(`/api/todo/${todo.id}/done`)
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.have.property('completed').eq(true);
                    done();
                  });
            });
        });

        it('It should not UPTDATE todo status to "done", as it was already "done"', (done) => {
            const todo = new Todo({name:'Commit changes', completed: true});
            todo.save((err, todo) => {
                chai.request(app)                
                    .put(`/api/todo/${todo.id}/done`)
                    .end((err, response) => {
                        response.should.have.status(403);
                        response.body.should.have.property('message').eq('todo already completed');
                    done();
                  });
            });
        });
    });
    
    describe('PUT /todos/:id/undone', () => {

        it('It should UPTDATE todo status to "undone"', (done) => {
            todo = new Todo({name:'Start project', completed: true});
            todo.save((err, todo) => {
                chai.request(app)                
                    .put(`/api/todo/${todo.id}/undone`)
                    .end((err, response) => {
                        response.should.have.status(200);
                        response.body.should.have.property('completed').eq(false);
                    done();
                  });
            });
        });

        it('It should not UPTDATE todo status to "undone", as it was already "undone"', (done) => {
            const todo = new Todo({name:'Do task 1', description: 'till 5 pm', completed: false});
            todo.save((err, todo) => {
                chai.request(app)                
                    .put(`/api/todo/${todo.id}/undone`)
                    .end((err, response) => {
                        response.should.have.status(403);
                        response.body.should.have.property('message').eq('todo already is undone');
                    done();
                  });
            });
        });
    });

    describe('/DELETE/:id todo', () => {
        it('it should DELETE a todo given the id', (done) => {
            const todo = new Todo({name:'Delete dependencies', completed: false});
            todo.save((err, todo) => {
                chai.request(app)
                .delete('/api/todo/' + todo.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('message').eq(`todo with id ${todo.id} deleted`);
                done();
                });
            });
        });
    });
})

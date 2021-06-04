const express = require('express');
const router = express.Router();

const Todo = require('../models/todo');

const {todoValidator, idValidator} = require('../middlewares/validators');


router.get('/', async (req, res, next) => {
    try{
        res.status(200).json(await Todo.find().lean());
    } catch(error){
        next(error)
    }
    
});

router.post('/',  todoValidator,  async (req, res, next) => {
    try{
        const exists = await Todo.findOne({ name: req.body.name } ).lean();
        
        if(exists){
            res.status(403).json({'message':'todo already exists'})
        } else{
            const data = req.body;
            const todo = new Todo(data);
            const savedTodo = await todo.save();
            res.status(201).send(savedTodo);
        }

    } catch(error){
        next(error)
    }
});

router.delete('/:id', idValidator, async (req, res, next) => {
    try{
        await Todo.deleteOne({_id: req.id});
        res.status(200).json({message:`todo with id ${req.id} deleted`})
        
    } catch (error){
        next(error);
    }
})


router.put('/:id/done', idValidator, async (req, res, next) => {
    try{
        doc = await Todo.findById(req.id).exec();
        if(doc.completed){
            res.status(403).send({message: 'todo already completed'});
        } else{
            doc.completed = true;
            await doc.save();
            res.status(200).send(doc);
        }
    } catch(error){
        next(error);
    }
});

router.put('/:id/undone', idValidator, async (req, res, next) => {
    try{
        doc = await Todo.findById(req.id).exec();
        if(!doc.completed){
            res.status(403).json({'message': 'todo already is undone'});
        } else{
            doc.completed = false;
            await doc.save();
            res.status(200).send(doc);
        }
    } catch(error){
        next(error);
    }
});

module.exports = router;


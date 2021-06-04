const joi = require('joi')

const Todo = require('../models/todo')

const ObjectId = require('mongoose').Types.ObjectId;


const validation = joi.object({
    name: joi.string().required().min(2).max(200),
    description: joi.string().min(2).max(700),
    completed: joi.boolean().default(false)
})

module.exports.todoValidator = async (req, res, next) => {
	const todo = {
		name: req.body.name,
		description: req.body.description,
		completed: req.body.completed
	};

	const { error } = validation.validate(todo);
	if (error) {
		res.status(400);
		res.json({"message":error.message});
	} else {
		next();
	}
};

module.exports.idValidator = async (req, res, next) => {
    
    const id = req.params.id;
    if(ObjectId.isValid(id)){
        const idExists = await Todo.findById(id);
        if(idExists){
            req.id = id;
            next();
        } else {
            res.status(400).json({message: "id not found."})
        }
    } else{
        res.status(400).json({message: "incorrect id"})
    }
    //console.log(id);
    
}
const mongoose = require('mongoose')
const {Schema} = mongoose

const TodoSchema = new Schema({
    name: { type: String, min: 2, max: 200},
    description: { type: String, min: 2, max: 700},
    completed: {type: Boolean, default: false}
});

module.exports = mongoose.model('Todo', TodoSchema);

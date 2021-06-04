const todoRoute = require('./todo.route');

const express = require('express');
const router = express.Router();

router.use('/todo', todoRoute);

module.exports = router;
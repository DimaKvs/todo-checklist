const express = require('express')
const mongoose = require('mongoose')
const app = express()

const env = process.env.NODE_ENV || 'dev'
const _config = require('./_config.json')[env];

const {database, dbConfig} = _config

const api = require('./routes');

const PORT = 4040;



mongoose
    .connect(database, dbConfig)
    .then(() => {
        console.log('Database connected');
    })
    .catch( e => {
        console.log(e);
    });


app.use(express.json())

app.use('/api', api)

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
  });

app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
        error: {
          status: err.status || 500,
          message: err.message || 'Internal Server Error',
        },
      });
})

app.listen(PORT, () => {
    console.log(`App is running on port ${PORT}`);
})

module.exports = app;
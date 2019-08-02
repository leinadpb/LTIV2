const mongoose = require('mongoose');
const envs = require('../../environments');

console.log(envs.CONNECTION_STRING);
const db = envs.CONNECTION_STRING;

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => {
    console.log(err);
    console.log('MongoDB Not Connected');
  });
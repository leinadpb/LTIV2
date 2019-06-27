const mongoose = require('mongoose');

console.log(process.env.CONNECTION_STRING);
const db = process.env.CONNECTION_STRING;

mongoose
  .connect(db)
  .then(() => {
    console.log('MongoDB Connected');
  })
  .catch(err => {
    console.log(err);
    console.log('MongoDB Not Connected');
  });
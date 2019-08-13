const mongoose = require('mongoose');

let envs = process.env;
try {
  envs = require('../../environments.js');
} catch (ex) {
  console.log('Please, create environments.js file (with all needed environments variables) in the root project before deploying to production: ', ex);
}
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
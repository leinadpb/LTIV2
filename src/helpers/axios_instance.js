const axios = require('axios');
const settings = require('../settings');

const getAuthToken = async () => {
  let envs = process.env;
  try {
    envs = require('../../environments.js');
  } catch(err) {
    console.log('Please, create environments.js file at the root project with all environments variables.')
  }
  try {
    let res = await axios.post('/auth/signin', {
      email: envs.ADMIN_EMAIL,
      password: envs.ADMIN_PASSWORD
    });
    return res.headers['authorization'];
  } catch(ex) {
    console.log('Error when authenticating: ');
    console.log(ex);
    return '';
  }
}

const init = async () => {
  return new Promise(async (resolve, reject) => {
    // Configure axios defaults
    axios.defaults.baseURL = settings.API.baseURL;
    axios.defaults.headers.common['Authorization'] = `Bearer ${await getAuthToken()}`;
    resolve(axios);
  })
}

module.exports = {
  init: () => init()
};
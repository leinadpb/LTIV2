const ActiveDirectory = require('activedirectory');

require('dotenv').config();

console.log(process.env.ANGELO_PASSWORD);

const CURRENT_LOGGED_IN_USER = '1066359';

const config = { url: 'lab.intec',
               baseDN: 'dc=lab,dc=intec',
               username: 'angelo.paredes@intecadm',
               password: process.env.ANGELO_PASSWORD }

const ad = new ActiveDirectory(config);
ad.findUser(CURRENT_LOGGED_IN_USER, function(err, user) {
  if (err) {
    console.log('ERROR: ' +JSON.stringify(err));
    return;
  }
 
  if (!user) {
    console.log('User: ' + sAMAccountName + ' not found.')
    return null;
  } else {
    return JSON.stringify(user);
  }
});
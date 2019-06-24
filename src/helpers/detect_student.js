const ActiveDirectory = require('activedirectory');

require('dotenv').config();

console.log('Credentials for AD are: ', process.env.AD_USER, process.env.AD_PASSWORD);

const CURRENT_LOGGED_IN_USER = '1066359';

const config = { url: 'ldap://lab.intec',
               baseDN: 'dc=lab,dc=intec',
               username: process.env.AD_USER,
               password: process.env.AD_PASSWORD }

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
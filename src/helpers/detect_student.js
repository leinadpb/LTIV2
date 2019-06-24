const ActiveDirectory = require('activedirectory');

require('dotenv').config();

// process.env.AD_USER.substr(0, process.env.AD_USER.indexOf('@'));
const CURRENT_LOGGED_IN_USER = "1066359";
console.log('username: ', CURRENT_LOGGED_IN_USER);

console.log('Credentials for AD are: ', process.env.AD_USER, process.env.AD_PASSWORD);

const config = { url: 'ldap://lab.intec',
               baseDN: 'dc=lab,dc=intec',
               username: process.env.AD_USER,
               password: process.env.AD_PASSWORD,
               attributes: {
                  user: [ 'name', 'mail', 'userPrinicipalName' ],
                  group: [ 'objectCategory' ]
                } 
              }

const ad = new ActiveDirectory(config);
ad.findUser(CURRENT_LOGGED_IN_USER, function(err, user) {
  if (err) {
    console.log('ERROR: ' +JSON.stringify(err));
    return;
  }
 
  if (!user) {
    console.log('User: ' + CURRENT_LOGGED_IN_USER + ' not found.')
    return null;
  } else {
    return JSON.stringify(user);
  }
});
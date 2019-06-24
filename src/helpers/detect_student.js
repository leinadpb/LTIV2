const ActiveDirectory = require('activedirectory');
const os = require('os');
const path = require('path');

require('dotenv').config();

console.log('>>>>> WINDOW USER LOGGED IN:');
console.log('Domain: ', process.env.USERDOMAIN);
console.log('username: ', process.env.USERNAME);
console.log('username', process.env['USERPROFILE']);
console.log('hostname:', os.hostname());
console.log('User info', JSON.stringify(os.userInfo()));
console.log('>>>>> WINDOW USER LOGGED IN END >>>>>');

// process.env.AD_USER.substr(0, process.env.AD_USER.indexOf('@'));
const CURRENT_LOGGED_IN_USER = "1066359@intec";
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
ad.findUser('userPrincipalName=1066359@intec', function(err, user) {
  if (err) {
    console.log('ERROR: ' +JSON.stringify(err));
    return;
  }
 
  console.log('user obj: ', user);
  console.log('err obj: ', err);
  if (!user) {
    console.log('User: ' + CURRENT_LOGGED_IN_USER + ' not found.');
    return null;
  } else {
    return JSON.stringify(user);
  }
});
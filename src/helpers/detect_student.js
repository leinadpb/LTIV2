const ActiveDirectory = require('activedirectory');

const CURRENT_LOGGED_IN_USER = '1066359';

const config = { url: 'ldap://dc.domain.com',
               baseDN: 'dc=domain,dc=com',
               username: 'username@domain.com',
               password: 'password' }

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
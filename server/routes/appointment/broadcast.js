const Smooch = require('smooch-core');

const KEY_ID = 'app_59330a7bf770584b002fefdf';
const SECRET = '6Tp2pImZuQf4WygwLuws7bFR';

const smooch = new Smooch({
    keyId: KEY_ID,
    secret: SECRET,
    scope: 'app'
});

var applicationID = ["80bb65113a4d36313b66cc23", "b6e0a6f50804a20a392ba5bc"];

for (var x = 0; x < applicationID.length; x++) {
   smooch.appUsers.sendMessage(applicationID[x], {
       type: 'text',
       text: 'CSE 112',
       role: 'appMaker'
   })
   .then((response) => {
       console.log('API RESPONSE:\n', response);
       res.end();
   })
   .catch((err) => {
       console.log('API ERROR:\n', err);
       res.end();
   });  
}
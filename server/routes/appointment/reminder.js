var twilio = require('twilio');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var accountSid = 'AC1c5b31df151858e5ac2783fd9b57f741'; // Your Account SID from www.twilio.com/console
var authToken = '43a3bb1edda559ccdee876cc1707652c';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

httpGet(); 

function httpGet()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", 'http://localhost:4941/api/appointments/company/592b7f918c67ae7b76ad14b6', false ); // false for synchronous request
    xmlHttp.send( null );
    
    var parsed = JSON.parse(xmlHttp.responseText)[0];
    client.messages.create({
        body: 'Emissary Reminder - appointment for ' +  parsed.first_name + ' ' + parsed.last_name + ' is confirmed for ' + parsed.date,
        to: '6507872903',
        from: '6507275615'
    })
    .then(console.log("Message sent."));
}

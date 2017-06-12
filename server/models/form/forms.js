var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var encrypt = require('mongoose-encryption');

var forms = new mongoose.Schema({
  form : {type: Object},
});

var encKey = process.env.ENC_KEY_PATIENT_FORM || "5eNeIqic3hPw5LH1QhetW+938egawC6tGbJG2OYgGW8=";
var sigKey = process.env.SIG_KEY_PATIENT_FORM || "9WXlnC2CxAZ3ZzQbsai9wKcymwDVYVp7v7nJ+ATjftTVqaFkxE1rjq6IEwbtPGuf6ZP0+65J1gYygsB4Nwg0VQ==";

//submittedForm.plugin(encrypt, {encryptionKey: encKey, signingKey: sigKey});

module.exports = mongoose.model('forms', forms);

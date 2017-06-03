'use strict';

var express = require('express');
var router = express.Router();
var bodyparser = require('body-parser');
var nodemailer = require("nodemailer");

var exports = module.exports;
exports.template = {};

// create reusable transporter object from company email
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'pv.emissary@gmail.com',
        pass: 'asdfqwerty'
    }
});


// sendEmail: Send email to employees when visitorList is checked in.
exports.sendEmail = function(patientName, employees, done) {
  if(employees === null || (employees.length <= 0)) {
    if(done) return done();
  }
  var len = employees.length;
  var callback = function(i) {
    return function(error, info){
      if(error){
        console.log(error);
        console.log("Error occurred sending email");
        //res.json({message: "Error occurred sending email"});
      }else{
        console.log("Email was sent.");
        //res.json({message : "Email was sent." });
      }
      if(done && len-1 === i) return done();
    };
  };
  // iterate through all employees
  if(employees === null || (employees.length <= 0))
    if(done) return done();
  for (var index = 0; index < employees.length; index++) {
    // create the email object that will be sent
    var mailOptions = {
      from: "Robo Betty <testcse112@gmail.com>", // sender address
      to: employees[index].email, // list of receivers
      subject: "Patient " + patientName + " is ready", // Subject line
      text: "Your visitorList " + patientName + " is here.", // plaintext body
      html: "<b>Your visitorList " + patientName + " is here.</b>" // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, callback(index));
  }
};

// sendEmail: Send email to employees when visitorList is checked in.
exports.notifyAppointment = function(data) {
  console.log('NOTIFY_NEW_APPOINTMENT');
  console.log(data);
  console.log(data.first_name);
  console.log(data.last_name);
  console.log(data.company_id);
  console.log(data.date);
  console.log(data.email);

  //html = 'Hello <b>' + data.first_name + ' ' + data.last_name + '</b>,</ br></ br>You have successfully scheduled an appointment for <b>' + data.company_id + ' </b> on <b>' + data.date + '</b>.</ br> Please make sure this date is correct.</ br></ br>-Peter @ Emissary';
  html = data.first_name + data.last_name + data.company_id + data.date + data.email;
  html = JSON.stringify(html);
  console.log(html);
  var mailOptions = {
    from: 'Peter@Emissary <pv.emissary@gmail.com>', // sender address
    to: data.email, // receiver
    subject: 'Successful appointment creation', // Subject line
//    text: html.replace(/<(?:.|\n)*?>/gm, ''), // plaintext body
    /** html body */
    html: html
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if(error) {
      return console.log(error);
    } else {
      console.log('Message %s sent: %s', info.messageId, info.response);
    }
  });
};

'use strict';

/* This module is meant to house all of the API
 * routes that pertain to forms
 */
var express = require('express');
var router = express.Router();
var SubmittedForm = require('../../models/form/SubmittedForm');
var Forms = require('../../models/form/forms');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var TemplateForm = require('../../models/form/FormTemplate');

/********** FORM TEMPLATE ROUTES **********/
module.exports.template = {};

module.exports.template.findByCompanyId =  function(req, res) {
  TemplateForm.find({'company_id' : new ObjectId(req.params.id)}, function(err, template) {
    if(err)
      res.status(400).json({error: "There was an error finding the template form."});
    else{
      res.status(200).json(template);
    }
  });
};
module.exports.template.findByTemplateId =  function(req, res) {
  TemplateForm.findOne({'_id' : new ObjectId(req.params.template_id)}, function(err, template) {
    if(err)
      res.status(400).json({error: "There was an error finding the template form."});
    else{


      var retObj = {}
      retObj["title"] = template.name;
      retObj["properties"] = {};
      retObj["fields"] = {};
      var obj = template.format;
      var i = 0;
      for(var i = 0; i < obj.length ; i++){
        retObj["properties"][obj[i].name] = {}
        retObj["properties"][obj[i].name]["title"] = obj[i].label;
        retObj["properties"][obj[i].name]["required"] = obj[i].required;

        if(obj[i].type == "text"){
          retObj["properties"][obj[i].name]["type"] = "string";
        }
        else if(obj[i].type == "email") {
          retObj["properties"][obj[i].name]["format"] = "email";
        }
        else if(obj[i].type == "tel") {
          retObj["properties"][obj[i].name]["format"] = "phone";
        }
        else if(obj[i].type == "date") {
          retObj["properties"][obj[i].name]["format"] = "date";
          retObj["fields"][obj[i].name] = {
            "helper":"DD/MM/YYYY"
          };
        }
        else if(obj[i].type == "number") {
          retObj["properties"][obj[i].name]["type"] = "number";
        }
      }
      res.status(200).json(retObj);
    }
  });
};

module.exports.template.findByAdminId = function(req,res){
  TemplateForm.findOne({'_admin_id' : req.params.adminid}, function(err, template) {
    if(err)
      res.status(400).json({error: "There was an error finding the template form."});
    else
      res.status(200).json(template);
  });
};

module.exports.template.sendByAdminId = function(req,res){
  TemplateForm.findOne({'_admin_id' : req.params.adminid}, function(err, template) {
    if(err)
      res.status(400).json({error: "There was an error finding the template form."});
    else if(!template){//if doesn't exist
      createWithAdminId(req,res);
    }
    else{
      updateWithAdminId(req,res);
    }
  });
};

function createWithAdminId(req,res){
  var newTemplate = new TemplateForm();
  newTemplate._admin_id = req.params.adminid;
  newTemplate.template = req.body.template;

  newTemplate.save(function(err, template) {
    if(err)
        return res.status(400).json(err);
    else
        return res.status(200).json(template);
  });
}

function updateWithAdminId(req,res){
  var update = {template: req.body.template};

  TemplateForm.findOneAndUpdate({_admin_id: req.params.adminid}, update,
    function(err, template) {
        if(err)
          return res.status(400).json({error: "There was an error updating a template."});
        else
          return res.status(200).json(template);
    });
}

module.exports.template.create =  function(req, res) {
  
  //make sure all parameters are there
  if(!("name" in req.body) || !("company_id" in req.body) || !("format" in req.body) ){
    res.status(400).json({error: "Body must contain keys: name: company_id, and format"});
    return;
  }

  var format = JSON.parse(req.body.format); //request body
  var to_store = [format.length]; //will store the object
  //set up the format for storing
  if(format.length < 1){
    res.status(400).json({error: "You must have at least one element in your format."});
    return;
  }
  
  for (var i=0; i<format.length; i++) {
    var required_val;
    var label_val;
    var type_val;
    var name_val = format[i].name;
    //set required
    if("required" in format[i]){
      required_val = format[i].required;
    }else{
      required_val = false;
    }

    //set label
    label_val = format[i].label;

    //set type
    if(format[i].type == 'text'){
      if(format[i].subtype != 'text' && format[i].subtype != 'email' && format[i].subtype != 'tel'){
        res.status(400).json({error: "We only support text, email, and tel subtypes of text as of now"});
        return;
      }
      type_val = format[i].subtype
    }else if(format[i].type == 'date' || format[i].type == 'number'){
      type_val = format[i].type;
    }else{
      res.status(400).json({error: "We only support text(text, email, tel), date, and number types as of now"});
      return;
    }

    to_store[i] = {
      type: type_val,
      label: label_val,
      required: required_val,
      name: name_val
    }
  }
 
  //set up full object for storing
  var storing_object = {
    company_id : new ObjectId(req.body.company_id),
    name: req.body.name,
    format: to_store
  }

  
   var newTemplate = new TemplateForm();
   newTemplate.company_id = new mongoose.Types.ObjectId(storing_object.company_id);
   newTemplate.format = storing_object.format;
   newTemplate.name = req.body.name;

   newTemplate.save(function(err, template) {
    if(err)
        res.status(400).json(err);
    else
      res.status(200).json(template);
  });
};


/* Accept PUT request at /form/template */
module.exports.template.update =  function(req, res) {
    var update = {template: req.body.template};
    var options = {new: true};

    TemplateForm.findOneAndUpdate({_id: req.body.template_id}, update, options,
      function(err, template) {
          if(err)
            res.status(400).json({error: "There was an error updating a template."});
          else
            res.status(200).json(template);
      });
};

/* accept DELETE request at /form/template/:template_id */
module.exports.template.delete =  function (req, res) {
    /* Get id param from request */
    var templateID = req.params.template_id;

    if(!templateID) {
      res.status(400).json({error: 'need a template id'});
      return;
    }

    TemplateForm.findOneAndRemove({_id: templateID}, function(err, result) {
      if(err) {
        res.status(400).json({error: 'There was problem removing the form template'});
        return;
      }
      res.status(200).json(result);
    });
};

/********** PATIENT FORM ROUTES **********/
module.exports.submitted_form = {};

module.exports.submitted_form.findById = function(req, res) {
  SubmittedForm.findOne({ '_id': req.params.form_id }, function (err, submittedForm) {
    if (err) {
      res.status(400).json({error: "An error occured while finding visitorList form"});
      return;
    }
    res.status(200).json(submittedForm);
  });
};

module.exports.submitted_form.create = function(req, res) {
  var form = new SubmittedForm();
  form.form = req.body.form;
  form._admin_id = req.body._admin_id;
  form.firstName = req.body.firstName;
  form.lastName = req.body.lastName;
  form.patientEmail = req.body.patientEmail;
  form.date = new Date();
  form.save(function(err, savedForm){
    if (err){
      res.status(400).json({error: "An error occured while saving the submitted form"});
    }
    res.status(200).json(savedForm);
  });
};

module.exports.submitted_form.findByPatientInfo = function(req, res) {
  var query = {},
    firstName = req.query.firstName,
    lastName = req.query.lastName,
    patientEmail = req.query.patientEmail;


  if(!((firstName && lastName) || patientEmail)) {
    res.status(400).json({error: "You must specify either both first and last name or email"});
    return;
  }
  if(firstName) query.firstName = firstName;
  if(lastName) query.lastName = lastName;
  if(patientEmail) query.patientEmail = patientEmail;


  if(req.query.mostRecent == "true") {
    SubmittedForm.findOne(query).sort('-date').exec(function (err, submittedForm) {
      if (err) {
        res.status(400).json({error: "An error occured while finding visitorList form"});
        return;
      }
      res.status(200).json(submittedForm);
    });
  }
  else {
      SubmittedForm.findOne(query, function(err, submittedForms) {
      if (err) {
        res.status(400).json({error: "An error occured while finding visitorList forms"});
        return;
      }
      res.status(200).json(submittedForms);
    });
  }
};

/********** GENERIC FORM ROUTES **********/
module.exports.forms = {};


module.exports.forms.create = function(req, res) {
  var to_save = {};
  var i = 1;
  for (var key in req.body){
    var title = req.body[key].title;
    var ts_value = "";
    var type_val;
    if (title in to_save){
      title = title + "("+i+")";
      i++;
    }
    if("value" in req.body[key]){
      ts_value = req.body[key]["value"];
    }
    if("format" in req.body[key]){
      type_val = req.body[key]["format"];
    }else{
      type_val = req.body[key]["type"];
    }
    to_save[title] = {
      required: req.body[key]["required"],
      type: type_val,
      value: ts_value
    }
  }

  var form = new Forms();
  form.form = to_save;
  form.save(function(err, savedForm){
    if (err){
      res.status(400).json({error: "An error occured while saving the submitted form"});
    }
    res.status(200).json(savedForm);
  });
};
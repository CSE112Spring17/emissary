'use strict';

var express = require('express');
var controller = require('./form.controller');

var router = express.Router();

var bodyparser = require('body-parser');
var urlparser = bodyparser.urlencoded({extended: false});

//for sure use
router.get('/template/company/:id', controller.template.findByCompanyId);
router.get('/template/:template_id', controller.template.findByTemplateId);
router.delete('/template/:template_id', controller.template.delete);
router.post('/template', controller.template.create);
router.post('/store', controller.forms.create);

//don't think we use
router.get('/template/:adminid',controller.template.findByAdminId);
router.post('/template/:adminid',controller.template.sendByAdminId);
router.put('/template', controller.template.update);


router.get('/visitorList/:form_id', controller.submitted_form.findById);
router.get('/visitorList', controller.submitted_form.findByPatientInfo);
router.post('/visitorList', controller.submitted_form.create);

module.exports = router;
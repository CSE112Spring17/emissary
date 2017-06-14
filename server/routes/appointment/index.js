'use strict';

var express = require('express');
var controller = require('./appointment.controller');

var router = express.Router();

router.post('/', 			controller.template.create);
router.get('/:id', 			controller.template.get);
router.get('/stats/:id', 	controller.template.getStats);
router.get('/company/:id', 	controller.template.getAll);
router.get('/company/history/:id', 	controller.template.getHistory);
router.get('/company/today/:id', 	controller.template.getToday);
router.get('/all/:id', 							controller.template.getAllAppointments);
router.get('/lookup/:id', 						controller.template.lookupProviderName);
router.get('/lookup/:id/:firstName/:lastName', 	controller.template.findAppointments)
router.put('/:id',          controller.template.update);
router.delete('/:id',       controller.template.delete);
router.post('/cancelled',          controller.template.updateCancelled);

module.exports = router;
'use strict';

var express = require('express');
var controller = require('./appointment.controller');

var router = express.Router();

router.post('/', 			controller.template.create);
router.get('/:id', 			controller.template.get);
router.get('/company/:id', 	controller.template.getAll);
router.get('/company/today/:id', 	controller.template.getToday);
router.put('/:id',          controller.template.update);
router.delete('/:id',       controller.template.delete);
router.post('/cancelled',          controller.template.updateCancelled);

module.exports = router;
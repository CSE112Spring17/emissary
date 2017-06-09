/* Require mongoose to interact with mongoDB */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/**
 * This will be the Schema for the Form Template Documents.
 **/
var formTemplate = new mongoose.Schema({
	company_id: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
	format: [],
	name: String
});

module.exports = mongoose.model('FormTemplate', formTemplate);

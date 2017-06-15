'use strict';

/*This module is meant to house the functions
 * used by the authorization (auth) API. The
 * actual API is set up in index.js

 Functions:
 authSignup()
 authLogin()
 authResetCredentials()
 */


/* need this to enable cross origin resource sharing.If disabled, we might
 * not need this later. This is just to get the example to work
 * when front end is served from a something other than our app server.
 */
var Appointment = require('../../models/Appointment');
var VisitorList = require('../../models/VisitorList');
var Email = require('../../notification/email');

/****** Company TEMPLATE ROUTES ******/
module.exports.template = {};

module.exports.template.create = function(req, res) {
    var appointment = new Appointment();
    var param = req.body;

    //require provided info
    appointment.first_name = param.first_name;
    appointment.last_name = param.last_name;
    appointment.phone_number = param.phone_number;
    appointment.date = param.date;
    appointment.company_id = param.company_id;
    appointment.provider_name = param.provider_name;

    Appointment.find(
        {
            company_id:param.company_id,
            date:param.date
        }, function(err, appointments){
            if(err) return res.status(400).json({error: "Unable to find any matching company records."});
            if(appointments.length==0) {
                appointment.save(function (err, a) {
                    if (err) {
                      return res.status(400).json({error: "Unable to save appointment entry. Please try again."});
                    }
                    else {
                        Email.notifyAppointment(param.first_name,
                                                param.last_name,
                                                param.company_id,
                                                param.date,
                                                param.email);
                        return res.status(200).json(a);
                    }
                });
            }else{
                return res.status(400).json({error: "An appointment with those properties already exists."});
            }
        });
};

module.exports.template.getAll = function(req, res) {
    Appointment.find({company_id: req.params.id}).sort([['date', 'descending']]).exec(function (err,result){
      if(err) return res.status(400).json({error: "Could Not Save"});
      return res.status(200).json(result);
    });
};

module.exports.template.getHistory = function(req, res) {
  var query =
  {
    company_id: req.params.id,
    status: {$exists: true}
  };
  Appointment.find(query).sort([['date', 'descending']]).exec(function (err,result){
    if(err) return res.status(400).json({error: "Could Not Save"});
    return res.status(200).json(result);
  });
};

module.exports.template.getToday = function(req, res) {
  var start = new Date();
  start.setHours(0, 0, 0, 0);
  var query =
    {
      company_id: req.params.id,
      date: {$gte:start},
      status: {$exists: false}
    };
  Appointment.find(query, function(err, result){
    if(err){
      return res.status(400).json(err);
    }
    return res.status(200).json(result);
  });
};

module.exports.template.getAllAppointments = function(req, res) {
    Appointment.find({}, function(err, result){        
            if(err){
                return res.status(400).json("err");
            }
            return res.status(200).json(result);
        });
};

module.exports.template.get = function(req, res) {
    Appointment.findOne({_id: req.params.id}, function(err, a) {
        if(err || !a)
            return res.status(400).send({error: "Could Not Find"});
        return res.status(200).json(a);
    });
};

module.exports.template.lookupProviderName = function(req, res) {
    //Thinking this should be findAll           
    Appointment.findOne({provider_name: req.params.id}, function(err, a) {
        if(err || !a)
            return res.status(400).send({error: "Could Not Find"});
        return res.status(200).json(a);
    });
};

module.exports.template.findAppointments = function(req, res) {
    Appointment.find({company_id: req.params.id, first_name: req.params.firstName, last_name: req.params.lastName}, function(err, a) {
        if(err || !a)
            return res.status(400).send({error: "Could not find appointments matching your name and company information."});
        return res.status(200).json(a);
    });
};

module.exports.template.update = function(req, res){
    
    Appointment.findOne({_id: req.params.id}, function (err, a) {
        if(err || !a)
            return res.status(401).json({error: "Could Not Find"});

        if (req.body.first_name !== undefined)
            a.first_name = req.body.first_name;

        if (req.body.last_name !== undefined)
            a.last_name = req.body.last_name;

        if (req.body.phone_number !== undefined)
            a.phone_number  = req.body.phone_number ;

        if (req.body.date!== undefined)
            a.date = req.body.date;
        if (req.body.provider_name!== undefined)
            a.provider_name = req.body.provider_name;
        //TODO check if the date is taken already
        a.save(function(err) {
            if(err) {
                return res.status(400).json({error: "Could Not Save"});
            }
            return res.status(200).json(a);
        });
    });
};

module.exports.template.updateCancelled = function(req, res){
  Appointment.findOne({_id: req.body.id}, function (err, a) {
    if(err || !a)
    {
      console.log(req);
      return res.status(401).json({error: "Could Not Find"});
    }
    a.status = "Cancelled";
    //TODO check if the date is taken already
    a.save(function(err) {
      if(err) {
        return res.status(400).json({error: "Could Not Save"});
      }
      console.log("Cancellation confirmed");
      return res.status(200).json(a);
    });
  });
};

module.exports.template.delete = function(req, res){
    Appointment.findById(req.params.id, function(err, a) {
        if(err)
            res.status(400).json({error: "Could Not Find"});
        a.remove(function(err) {
            if(err) {
                res.status(400).json({error: "Could Not Save"});
            } else {
                return res.status(200).json(a);
            }
        });
    });
};

module.exports.template.markNoShow = function(){
  console.log("INSIDE mark NOSHOW");
  var time = new Date();
  time.setMinutes(time.getMinutes() - 5);
  var query =
  {
    status: {$exists: false},
    date: {$lte:time},
  };
  Appointment.find(query, function(err, result){
    if(err){
      return res.status(400).json(err);
    }
    result.forEach(function(element){
      element.status = "No Show";
      element.save(function (err){
        if (err){
          return res.status(400).json(err);
        }
      });
    });
  });
};

module.exports.template.getStats = function(req, res){

  var data = [];

  Appointment.find({company_id: req.params.id,status: 'No Show'}, function(err, results) {
    if(err)
      res.status(400).json({error: "Could Not Find"});
    data.push({status: 'no show',count: results.length});
    Appointment.find({company_id: req.params.id,status: 'Show'}, function(err, results) {
      if(err)
        res.status(400).json({error: "Could Not Find"});
      data.push({status: 'show',count: results.length});
      Appointment.find({company_id: req.params.id,status: 'Cancelled'}, function(err, results) {
        if(err)
          res.status(400).json({error: "Could Not Find"});
        data.push({status: 'cancelled',count: results.length});
        VisitorList.findOne(
          {company_id: req.params.id},
          function(err, list) {
            if (err)
              return callback({error: "an error occured while finding"}, null);
            if (list == null) {
              list = new VisitorList();
              list.visitors = [];
              list.company_id = req.params.id;
              list.walk_ins = 0;
              list.save();
            }

            data.push({status: 'walk-ins', count: list.walk_ins});
            console.log("Pi Chart Return Json ",data);
            return res.status(200).json(data);
          });
      });
    });
  });
};

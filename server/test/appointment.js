var request = require('supertest');
var config = require('../config/config');
var Appointment = require('../models/Appointment');
var Company = require('../models/Company');

describe('Appointment Test', function() {
    var url = "localhost:" + config.port;
    var token;
    var currAppointment;
    var currCompany;

    // old appointment info
    var first_name = "test";
    var last_name = "test";
    var phone_number="1234567890";
    var date=String(new Date());
    var provider_name = "test test";

    //new appointment info
    var new_first_name = "test1";
    var new_last_name = "test1";;
    var new_phone_number="1231267890";
    var new_date="2016-03-23T18:25:43.511Z";
    var new_provider_name = "test1 test1";

    //company info
    var email = "new@test.edu";
    var credit_card_number="1231231241251";
    var name = "test";
    var expiration_date="6/17";
    var phone_number="1234567890";

    var userID = null;


    before(function(done) {
      this.timeout(10000);
      //setup company
        var company = new Company();
        company.email = email;
        company.credit_card_number = credit_card_number;
        company.name = name;
        company.expiration_date = expiration_date;
        company.phone_number = phone_number;
        company.paid_time=new Date();

        company.save(function(err, c){
            currCompany=c;
            request(url)
                .post('/api/appointments')
                .send(
                    {
                        first_name: first_name,
                        last_name: last_name,
                        phone_number: phone_number,
                        date: date,
                        company_id: currCompany._id,
                        provider_name: provider_name
                    }
                )
                .expect(200)
                .end(function(err,res){
                    res.body.should.have.property('_id');
                    currAppointment=res.body;
                    done();
                });
        });
    });


    it("should not create the appointment", function(done) {
      this.timeout(8000);
      request(url)
            .post('/api/appointments')
            .send(
                {
                    first_name: new_first_name,
                    last_name: new_last_name,
                    phone_number: new_phone_number,
                    date: new_date,
                    company_id: currCompany._id,
                    provider_name: new_provider_name
                }
            )
            .expect(400)
            .end(function(err,res){
                res.should.have.property('error');
                done();
            });
    });

    it("should get appointment", function(done) {
        request(url)
            .get('/api/appointments/'+currAppointment._id)
            .expect(200)
            .end(function(err,res){
                res.body.should.have.property('_id');
                done();
            });
    });

    it("should not get appointment", function(done) {
        request(url)
            .get('/api/appointments/'+0)
            .expect(400)
            .end(function(err,res){
                res.body.should.have.property('error');
                done();
            });
    });

    it('should properly fetch all contents', function(done){
        request(url)
            .get('/api/appointments/company/' + currCompany._id)
            .expect(200)
            .end(function(err,res){
                if (err) throw (err);
                res.body[0].should.have.property('company_id').and.be.equal(String(currCompany._id));
                res.body[0].should.have.property('phone_number').and.be.equal(String(currCompany.phone_number));
                res.body[0].should.have.property('first_name').and.be.equal(String(first_name));
                done();
            });
    });

    it("should get all appointments", function(done) {
        request(url)
            .get('/api/appointments/company/'+currCompany._id)
            .expect(200)
            .end(function(err,res){
                res.body.should.be.an.instanceof(Array);
                res.body[0].should.have.property('company_id').and.be.equal(String(currCompany._id));
                res.body[0].should.have.property('first_name').and.be.equal(String(first_name));
                res.body[0].should.have.property('last_name').and.be.equal(String(last_name));
                res.body[0].should.have.property('phone_number').and.be.equal(String(phone_number));

                res.body[1].should.have.property('company_id').and.be.equal(String(currCompany._id));
                res.body[1].should.have.property('first_name').and.be.equal(String(new_first_name));
                res.body[1].should.have.property('last_name').and.be.equal(String(new_last_name));
                res.body[1].should.have.property('phone_number').and.be.equal(String(new_phone_number));
                done();
            });
    });

    it("should get today's appointments", function(done){
        request(url)
            .get('/api/appointments/company/today/'+currCompany._id)
            .expect(200)
            .end(function(err,res){
                res.body.should.be.an.instanceof(Array);
                res.body[0].should.have.property('company_id').and.be.equal(String(currCompany._id));
                res.body[0].should.have.property('first_name').and.be.equal(String(first_name));
                res.body[0].should.have.property('last_name').and.be.equal(String(last_name));
                res.body[0].should.have.property('date');

                var datestr =  date;
                datestr = datestr.substring(4,15);
                var datelist = datestr.split(" ");

                var resdatestr = res.body[0].date;
                resdatestr = resdatestr.substring(0,10);
                var resdatelist = resdatestr.split("-");
                
                datelist[1].should.equal(resdatelist[2]);
                datelist[2].should.equal(resdatelist[0]);
                done();
            });
    });

    it('testing appointment no shows', function(done){
        request(url)
            .get('/api/appointments/company/' + currCompany._id)
            .expect(200)
            .end(function(err,res){
                if (err) throw (err);
                res.body[0].should.not.have.property('status');
                done();
            });
    });

    it('should update appointment', function(done) {
        request(url)
            .put('/api/appointments/'+currAppointment._id)
            .send(
                {
                    first_name: new_first_name,
                    last_name: new_last_name,
                    phone_number: new_phone_number,
                    date: new_date,
                    provider_name: new_provider_name
                }
            )
            .expect(200)
            .end(function(err,res){
                if(err)
                    throw(err);
                res.body.should.have.property('first_name');
                res.body.first_name.should.equal(new_first_name);
                res.body.should.have.property('last_name');
                res.body.last_name.should.equal(new_last_name);
                res.body.should.have.property('phone_number');
                res.body.phone_number.should.equal(new_phone_number);
                res.body.should.have.property('date');
                res.body.date.should.equal(new_date);
                res.body.should.have.property('provider_name');
                res.body.provider_name.should.equal(new_provider_name);
                done();
            });
    });

    it("should cancel the appointment", function(done){
        request(url)
            .post('/api/appointments/cancelled')
            .send(
                {
                    id : currAppointment._id
                }
            )
            .expect(200)
            .end(function(err,res){
                if (err) throw(err);
                res.body.should.have.property('status').and.be.equal("Cancelled");
                done();
            });
    });

    it("should delete appointment", function(done) {
        request(url)
            .delete('/api/appointments/'+currAppointment._id)
            .expect(200)
            .end(function(err,res){
                res.body.should.have.property('_id');
                Appointment.find({_id:currAppointment._id}, function(err, _){
                    should.exist(err);
                    done();
                });
            });
    });

    after(function(done) {
        Company.remove({email:email}, function(err, c){
            done();
        });
    });
});

var request = require('supertest');

var config = require('../config/config');
var should = require('chai').should();

// Wrapper that creates admin user to allow api calls
var ConfigureAuth = require('./ConfigureAuth');

var employee_email = "newjt@tomcruise.com";

describe("Employee", function() {
        var url = "localhost:" + config.port;

        var credentials;  // variable to hold all the need authentication variables.

        // before function is called at the very beginning of the 'Forms' test suite,
        // no tests are run until the done() callback is called.
        before(function(done) {
            // setupAdmin will create and admin and log you in, give it a callback that will give you
            // the credentials you need. Make sure to call done() inside ConfigureAuth's callback!
            ConfigureAuth.setupAdmin(function(cred) {
                credentials = cred;
                done();
            });
        });

        var templateFormId = null;


        describe("Employee Testing", function() {

            // TEST POST
            describe('POST /api/employees', function(){
                it('should save submitted employee', function(done){
                    request(url)
                        .post('/api/employees')
                        .query({email: credentials.email, token: credentials.token})
                        .send({
                            company_id: credentials.admin._id,
                            first_name: "John",
                            last_name: "Smith",
                            email: employee_email,
                            phone_number: "123456789",
                            role: "c_admin",
                            password: "test"
                        })
                        .end(function(err, res){
                            if(err)
                                throw(err);
                            res.body.should.have.property('first_name').and.be.equal("John");
                            res.body.should.have.property('email').and.be.equal(employee_email);
                            res.body.should.not.have.property('password');
                            returnedId = res.body._id;
                            done();
                        });
                });
            });
            describe('Login', function(){
                it('Should login with employee data', function(done){
                        request(url)
                        .post('/api/employees/login')
                            .send(
                                {
                                    email:employee_email,
                                    password: "test"
                                }
                            )
                            .end(function(err, res){
                                if(err) throw (err);
                                res.body.should.have.property('_id');
                                res.body.should.not.have.property('password');
                                done();
                            });
                });
                it('Should not login with employee data', function(done){
                    request(url)
                        .post('/api/employees/login')
                        .send(
                            {
                                email:employee_email,
                                password: "incorrect"
                            }
                        )
                        .end(function(err, res){
                            if(err) throw (err);
                            res.body.should.have.property('error');

                            done();
                        });
                });

                 describe('Check employee data bug fix', function(){
                    var newphonenum = "1990981889";
                    var newpassword = "newpassword";
                    it('Change email and phone number & hope you dont lose your account', function(done){
                        request(url)
                            .put('/api/employees/' + returnedId)
                            .query({email: credentials.email})
                            .send({
                                _admin_id: credentials.admin._id,
                                email: "newemail@gmail.com",
                                phone_number: newphonenum
                            })
                            .end(function(err, res){
                                if(err) throw(err);
                                res.body.should.have.property('email').and.be.equal("newemail@gmail.com");
                                res.body.should.have.property('phone_number').and.be.equal(newphonenum);
                                //must call done
                                done();
                            });
                    });

                    it("Can you still login?", function(done){
                        request(url)
                            .put('/api/employees/' + returnedId)
                            .query({email: credentials.email})
                            .send({
                                email: "newemail2@gmail.com",
                                password: newpassword
                            })
                            .end(function(err, res){
                                if(err) throw(err);
                                res.body.should.not.have.property('password').and.be.equal(newpassword);
                                res.body.should.have.property('email').and.be.equal("newemail2@gmail.com");
                                done();
                            });
                    });
                });

                it('Should update the employee data', function(done){
                    request(url)
                        .put('/api/employees/' + returnedId)
                        .query({email: credentials.email, token: credentials.token})
                        .send({
                            _admin_id: credentials.admin._id,
                            password: "new_password"
                        })
                        .end(function(err, res){
                            if(err)
                                throw(err);

                            res.body.should.have.property('email');
                            res.body.should.have.property('phone_number');
                            res.body.should.not.have.property('password');
                            done();
                        });
                });
                it('Should login with new password', function(done){
                    request(url)
                        .post('/api/employees/login')
                        .send(
                            {
                                email:employee_email,
                                password: "new_password"
                            }
                        )
                        .end(function(err, res){
                            if(err) throw (err);
                            res.body.should.have.property('email');
                            res.body.should.have.property('phone_number');
                            res.body.should.not.have.property('password');
                            done();
                        });
                });
            });

            // TEST PUT
            describe('PUT /api/employee/:id', function(){
                it('Should update the employee data', function(done){
                    request(url)
                        .put('/api/employees/' + returnedId)
                        .query({email: credentials.email, token: credentials.token})
                        .send({
                            _admin_id: credentials.admin._id,
                            email: "updated_email@tomcruise.com",
                            phone_number: "987654321"
                        })
                        .end(function(err, res){
                            if(err)
                                throw(err);

                            res.body.should.have.property('email').and.be.equal("updated_email@tomcruise.com");
                            res.body.should.have.property('phone_number').and.be.equal("987654321");
                            res.body.should.not.have.property('password');
                            done();
                        });
                });
            });

            // TEST GET ALL EMPLOYEES
            describe('GET /api/employees/company/:id', function(){
                it("should return all employees", function(done){

                    request(url)
                        .get('/api/employees/company/'+credentials.admin._id)
                        .send({
                            _admin_id: credentials.admin._id
                        })
                        .end(function(err, res){

                            res.body.should.be.instanceof(Object);
                            //res.body.should.not.be.empty;
                            res.body.should.not.be.empty();
                            //res.body.should.exist;
                            should.exist(res.body);
                            res.body.should.have.length.of(1);
                            res.body.should.be.an.instanceof(Array);
                            res.body[0].should.not.have.property('password');
                            done();
                        });
                });
            });

            describe('Employee should be in the database', function(){
                it("check employee in system", function(done){
                    request(url)
                        .get('/api/employees/' + returnedId)
                        .query({email: credentials.email})
                        .end(function(err, res){
                       
                            res.body.should.have.property('_id').and.be.equal(returnedId);
                            res.body.should.have.property('first_name').and.be.equal("John");
                            res.body.should.not.have.property('password');
                            res.body.should.have.property('last_name').and.be.equal("Smith");
                            res.body.should.have.property('phone_number').and.be.equal("987654321");
                            //make sure we don't lose access rights
                            res.body.should.have.property('role').and.be.equal("c_admin");
                            done();
                        });
                });
            });


            // TEST GET A SPECIFIC EMPLOYEE
            describe('GET /api/employees/:id', function(){
                it("should return a specific employee", function(done){
                    request(url)
                        .get('/api/employees/' + returnedId)
                        .query({email: credentials.email, token: credentials.token})
                        .end(function(err, res){

                            res.body.should.have.property('_id');
                            res.body.should.have.property('email');
                            res.body.should.have.property('first_name');
                            res.body.should.have.property('last_name');
                            res.body.should.have.property('phone_number');
                            res.body.should.not.have.property('password');
                            res.body.should.be.instanceof(Object);

                            res.body._id.should.equal(returnedId);
                            done();
                        });
                });
            });

            // TEST DELETE
            describe('DELETE /api/employees/:id', function(){
                it('Should delete the employee data', function(done){
                    request(url)
                        .delete('/api/employees/' + returnedId)
                        .query({email: credentials.email, token: credentials.token})
                        .end(function(err, res){
                            res.body.should.have.property('_id');
                            res.body.should.not.have.property('password');
                            done();
                        });
                });
            });
        });


        after(function(done) {
            ConfigureAuth.cleanupAuth(credentials.email, done);
        });
    }
);
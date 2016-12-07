'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Swachtaproject = mongoose.model('Swachtaproject'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  swachtaproject;

/**
 * Swachtaproject routes tests
 */
describe('Swachtaproject CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Swachtaproject
    user.save(function () {
      swachtaproject = {
        name: 'Swachtaproject name'
      };

      done();
    });
  });

  it('should be able to save a Swachtaproject if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Swachtaproject
        agent.post('/api/swachtaprojects')
          .send(swachtaproject)
          .expect(200)
          .end(function (swachtaprojectSaveErr, swachtaprojectSaveRes) {
            // Handle Swachtaproject save error
            if (swachtaprojectSaveErr) {
              return done(swachtaprojectSaveErr);
            }

            // Get a list of Swachtaprojects
            agent.get('/api/swachtaprojects')
              .end(function (swachtaprojectsGetErr, swachtaprojectsGetRes) {
                // Handle Swachtaprojects save error
                if (swachtaprojectsGetErr) {
                  return done(swachtaprojectsGetErr);
                }

                // Get Swachtaprojects list
                var swachtaprojects = swachtaprojectsGetRes.body;

                // Set assertions
                (swachtaprojects[0].user._id).should.equal(userId);
                (swachtaprojects[0].name).should.match('Swachtaproject name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Swachtaproject if not logged in', function (done) {
    agent.post('/api/swachtaprojects')
      .send(swachtaproject)
      .expect(403)
      .end(function (swachtaprojectSaveErr, swachtaprojectSaveRes) {
        // Call the assertion callback
        done(swachtaprojectSaveErr);
      });
  });

  it('should not be able to save an Swachtaproject if no name is provided', function (done) {
    // Invalidate name field
    swachtaproject.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Swachtaproject
        agent.post('/api/swachtaprojects')
          .send(swachtaproject)
          .expect(400)
          .end(function (swachtaprojectSaveErr, swachtaprojectSaveRes) {
            // Set message assertion
            (swachtaprojectSaveRes.body.message).should.match('Please fill Swachtaproject name');

            // Handle Swachtaproject save error
            done(swachtaprojectSaveErr);
          });
      });
  });

  it('should be able to update an Swachtaproject if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Swachtaproject
        agent.post('/api/swachtaprojects')
          .send(swachtaproject)
          .expect(200)
          .end(function (swachtaprojectSaveErr, swachtaprojectSaveRes) {
            // Handle Swachtaproject save error
            if (swachtaprojectSaveErr) {
              return done(swachtaprojectSaveErr);
            }

            // Update Swachtaproject name
            swachtaproject.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Swachtaproject
            agent.put('/api/swachtaprojects/' + swachtaprojectSaveRes.body._id)
              .send(swachtaproject)
              .expect(200)
              .end(function (swachtaprojectUpdateErr, swachtaprojectUpdateRes) {
                // Handle Swachtaproject update error
                if (swachtaprojectUpdateErr) {
                  return done(swachtaprojectUpdateErr);
                }

                // Set assertions
                (swachtaprojectUpdateRes.body._id).should.equal(swachtaprojectSaveRes.body._id);
                (swachtaprojectUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Swachtaprojects if not signed in', function (done) {
    // Create new Swachtaproject model instance
    var swachtaprojectObj = new Swachtaproject(swachtaproject);

    // Save the swachtaproject
    swachtaprojectObj.save(function () {
      // Request Swachtaprojects
      request(app).get('/api/swachtaprojects')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Swachtaproject if not signed in', function (done) {
    // Create new Swachtaproject model instance
    var swachtaprojectObj = new Swachtaproject(swachtaproject);

    // Save the Swachtaproject
    swachtaprojectObj.save(function () {
      request(app).get('/api/swachtaprojects/' + swachtaprojectObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', swachtaproject.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Swachtaproject with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/swachtaprojects/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Swachtaproject is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Swachtaproject which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Swachtaproject
    request(app).get('/api/swachtaprojects/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Swachtaproject with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Swachtaproject if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Swachtaproject
        agent.post('/api/swachtaprojects')
          .send(swachtaproject)
          .expect(200)
          .end(function (swachtaprojectSaveErr, swachtaprojectSaveRes) {
            // Handle Swachtaproject save error
            if (swachtaprojectSaveErr) {
              return done(swachtaprojectSaveErr);
            }

            // Delete an existing Swachtaproject
            agent.delete('/api/swachtaprojects/' + swachtaprojectSaveRes.body._id)
              .send(swachtaproject)
              .expect(200)
              .end(function (swachtaprojectDeleteErr, swachtaprojectDeleteRes) {
                // Handle swachtaproject error error
                if (swachtaprojectDeleteErr) {
                  return done(swachtaprojectDeleteErr);
                }

                // Set assertions
                (swachtaprojectDeleteRes.body._id).should.equal(swachtaprojectSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Swachtaproject if not signed in', function (done) {
    // Set Swachtaproject user
    swachtaproject.user = user;

    // Create new Swachtaproject model instance
    var swachtaprojectObj = new Swachtaproject(swachtaproject);

    // Save the Swachtaproject
    swachtaprojectObj.save(function () {
      // Try deleting Swachtaproject
      request(app).delete('/api/swachtaprojects/' + swachtaprojectObj._id)
        .expect(403)
        .end(function (swachtaprojectDeleteErr, swachtaprojectDeleteRes) {
          // Set message assertion
          (swachtaprojectDeleteRes.body.message).should.match('User is not authorized');

          // Handle Swachtaproject error error
          done(swachtaprojectDeleteErr);
        });

    });
  });

  it('should be able to get a single Swachtaproject that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Swachtaproject
          agent.post('/api/swachtaprojects')
            .send(swachtaproject)
            .expect(200)
            .end(function (swachtaprojectSaveErr, swachtaprojectSaveRes) {
              // Handle Swachtaproject save error
              if (swachtaprojectSaveErr) {
                return done(swachtaprojectSaveErr);
              }

              // Set assertions on new Swachtaproject
              (swachtaprojectSaveRes.body.name).should.equal(swachtaproject.name);
              should.exist(swachtaprojectSaveRes.body.user);
              should.equal(swachtaprojectSaveRes.body.user._id, orphanId);

              // force the Swachtaproject to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Swachtaproject
                    agent.get('/api/swachtaprojects/' + swachtaprojectSaveRes.body._id)
                      .expect(200)
                      .end(function (swachtaprojectInfoErr, swachtaprojectInfoRes) {
                        // Handle Swachtaproject error
                        if (swachtaprojectInfoErr) {
                          return done(swachtaprojectInfoErr);
                        }

                        // Set assertions
                        (swachtaprojectInfoRes.body._id).should.equal(swachtaprojectSaveRes.body._id);
                        (swachtaprojectInfoRes.body.name).should.equal(swachtaproject.name);
                        should.equal(swachtaprojectInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Swachtaproject.remove().exec(done);
    });
  });
});

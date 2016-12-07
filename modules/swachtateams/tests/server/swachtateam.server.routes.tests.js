'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Swachtateam = mongoose.model('Swachtateam'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  swachtateam;

/**
 * Swachtateam routes tests
 */
describe('Swachtateam CRUD tests', function () {

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

    // Save a user to the test db and create new Swachtateam
    user.save(function () {
      swachtateam = {
        name: 'Swachtateam name'
      };

      done();
    });
  });

  it('should be able to save a Swachtateam if logged in', function (done) {
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

        // Save a new Swachtateam
        agent.post('/api/swachtateams')
          .send(swachtateam)
          .expect(200)
          .end(function (swachtateamSaveErr, swachtateamSaveRes) {
            // Handle Swachtateam save error
            if (swachtateamSaveErr) {
              return done(swachtateamSaveErr);
            }

            // Get a list of Swachtateams
            agent.get('/api/swachtateams')
              .end(function (swachtateamsGetErr, swachtateamsGetRes) {
                // Handle Swachtateams save error
                if (swachtateamsGetErr) {
                  return done(swachtateamsGetErr);
                }

                // Get Swachtateams list
                var swachtateams = swachtateamsGetRes.body;

                // Set assertions
                (swachtateams[0].user._id).should.equal(userId);
                (swachtateams[0].name).should.match('Swachtateam name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Swachtateam if not logged in', function (done) {
    agent.post('/api/swachtateams')
      .send(swachtateam)
      .expect(403)
      .end(function (swachtateamSaveErr, swachtateamSaveRes) {
        // Call the assertion callback
        done(swachtateamSaveErr);
      });
  });

  it('should not be able to save an Swachtateam if no name is provided', function (done) {
    // Invalidate name field
    swachtateam.name = '';

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

        // Save a new Swachtateam
        agent.post('/api/swachtateams')
          .send(swachtateam)
          .expect(400)
          .end(function (swachtateamSaveErr, swachtateamSaveRes) {
            // Set message assertion
            (swachtateamSaveRes.body.message).should.match('Please fill Swachtateam name');

            // Handle Swachtateam save error
            done(swachtateamSaveErr);
          });
      });
  });

  it('should be able to update an Swachtateam if signed in', function (done) {
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

        // Save a new Swachtateam
        agent.post('/api/swachtateams')
          .send(swachtateam)
          .expect(200)
          .end(function (swachtateamSaveErr, swachtateamSaveRes) {
            // Handle Swachtateam save error
            if (swachtateamSaveErr) {
              return done(swachtateamSaveErr);
            }

            // Update Swachtateam name
            swachtateam.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Swachtateam
            agent.put('/api/swachtateams/' + swachtateamSaveRes.body._id)
              .send(swachtateam)
              .expect(200)
              .end(function (swachtateamUpdateErr, swachtateamUpdateRes) {
                // Handle Swachtateam update error
                if (swachtateamUpdateErr) {
                  return done(swachtateamUpdateErr);
                }

                // Set assertions
                (swachtateamUpdateRes.body._id).should.equal(swachtateamSaveRes.body._id);
                (swachtateamUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Swachtateams if not signed in', function (done) {
    // Create new Swachtateam model instance
    var swachtateamObj = new Swachtateam(swachtateam);

    // Save the swachtateam
    swachtateamObj.save(function () {
      // Request Swachtateams
      request(app).get('/api/swachtateams')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Swachtateam if not signed in', function (done) {
    // Create new Swachtateam model instance
    var swachtateamObj = new Swachtateam(swachtateam);

    // Save the Swachtateam
    swachtateamObj.save(function () {
      request(app).get('/api/swachtateams/' + swachtateamObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', swachtateam.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Swachtateam with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/swachtateams/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Swachtateam is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Swachtateam which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Swachtateam
    request(app).get('/api/swachtateams/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Swachtateam with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Swachtateam if signed in', function (done) {
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

        // Save a new Swachtateam
        agent.post('/api/swachtateams')
          .send(swachtateam)
          .expect(200)
          .end(function (swachtateamSaveErr, swachtateamSaveRes) {
            // Handle Swachtateam save error
            if (swachtateamSaveErr) {
              return done(swachtateamSaveErr);
            }

            // Delete an existing Swachtateam
            agent.delete('/api/swachtateams/' + swachtateamSaveRes.body._id)
              .send(swachtateam)
              .expect(200)
              .end(function (swachtateamDeleteErr, swachtateamDeleteRes) {
                // Handle swachtateam error error
                if (swachtateamDeleteErr) {
                  return done(swachtateamDeleteErr);
                }

                // Set assertions
                (swachtateamDeleteRes.body._id).should.equal(swachtateamSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Swachtateam if not signed in', function (done) {
    // Set Swachtateam user
    swachtateam.user = user;

    // Create new Swachtateam model instance
    var swachtateamObj = new Swachtateam(swachtateam);

    // Save the Swachtateam
    swachtateamObj.save(function () {
      // Try deleting Swachtateam
      request(app).delete('/api/swachtateams/' + swachtateamObj._id)
        .expect(403)
        .end(function (swachtateamDeleteErr, swachtateamDeleteRes) {
          // Set message assertion
          (swachtateamDeleteRes.body.message).should.match('User is not authorized');

          // Handle Swachtateam error error
          done(swachtateamDeleteErr);
        });

    });
  });

  it('should be able to get a single Swachtateam that has an orphaned user reference', function (done) {
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

          // Save a new Swachtateam
          agent.post('/api/swachtateams')
            .send(swachtateam)
            .expect(200)
            .end(function (swachtateamSaveErr, swachtateamSaveRes) {
              // Handle Swachtateam save error
              if (swachtateamSaveErr) {
                return done(swachtateamSaveErr);
              }

              // Set assertions on new Swachtateam
              (swachtateamSaveRes.body.name).should.equal(swachtateam.name);
              should.exist(swachtateamSaveRes.body.user);
              should.equal(swachtateamSaveRes.body.user._id, orphanId);

              // force the Swachtateam to have an orphaned user reference
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

                    // Get the Swachtateam
                    agent.get('/api/swachtateams/' + swachtateamSaveRes.body._id)
                      .expect(200)
                      .end(function (swachtateamInfoErr, swachtateamInfoRes) {
                        // Handle Swachtateam error
                        if (swachtateamInfoErr) {
                          return done(swachtateamInfoErr);
                        }

                        // Set assertions
                        (swachtateamInfoRes.body._id).should.equal(swachtateamSaveRes.body._id);
                        (swachtateamInfoRes.body.name).should.equal(swachtateam.name);
                        should.equal(swachtateamInfoRes.body.user, undefined);

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
      Swachtateam.remove().exec(done);
    });
  });
});

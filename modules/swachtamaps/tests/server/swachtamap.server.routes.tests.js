'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Swachtamap = mongoose.model('Swachtamap'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  swachtamap;

/**
 * Swachtamap routes tests
 */
describe('Swachtamap CRUD tests', function () {

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

    // Save a user to the test db and create new Swachtamap
    user.save(function () {
      swachtamap = {
        name: 'Swachtamap name'
      };

      done();
    });
  });

  it('should be able to save a Swachtamap if logged in', function (done) {
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

        // Save a new Swachtamap
        agent.post('/api/swachtamaps')
          .send(swachtamap)
          .expect(200)
          .end(function (swachtamapSaveErr, swachtamapSaveRes) {
            // Handle Swachtamap save error
            if (swachtamapSaveErr) {
              return done(swachtamapSaveErr);
            }

            // Get a list of Swachtamaps
            agent.get('/api/swachtamaps')
              .end(function (swachtamapsGetErr, swachtamapsGetRes) {
                // Handle Swachtamaps save error
                if (swachtamapsGetErr) {
                  return done(swachtamapsGetErr);
                }

                // Get Swachtamaps list
                var swachtamaps = swachtamapsGetRes.body;

                // Set assertions
                (swachtamaps[0].user._id).should.equal(userId);
                (swachtamaps[0].name).should.match('Swachtamap name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Swachtamap if not logged in', function (done) {
    agent.post('/api/swachtamaps')
      .send(swachtamap)
      .expect(403)
      .end(function (swachtamapSaveErr, swachtamapSaveRes) {
        // Call the assertion callback
        done(swachtamapSaveErr);
      });
  });

  it('should not be able to save an Swachtamap if no name is provided', function (done) {
    // Invalidate name field
    swachtamap.name = '';

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

        // Save a new Swachtamap
        agent.post('/api/swachtamaps')
          .send(swachtamap)
          .expect(400)
          .end(function (swachtamapSaveErr, swachtamapSaveRes) {
            // Set message assertion
            (swachtamapSaveRes.body.message).should.match('Please fill Swachtamap name');

            // Handle Swachtamap save error
            done(swachtamapSaveErr);
          });
      });
  });

  it('should be able to update an Swachtamap if signed in', function (done) {
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

        // Save a new Swachtamap
        agent.post('/api/swachtamaps')
          .send(swachtamap)
          .expect(200)
          .end(function (swachtamapSaveErr, swachtamapSaveRes) {
            // Handle Swachtamap save error
            if (swachtamapSaveErr) {
              return done(swachtamapSaveErr);
            }

            // Update Swachtamap name
            swachtamap.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Swachtamap
            agent.put('/api/swachtamaps/' + swachtamapSaveRes.body._id)
              .send(swachtamap)
              .expect(200)
              .end(function (swachtamapUpdateErr, swachtamapUpdateRes) {
                // Handle Swachtamap update error
                if (swachtamapUpdateErr) {
                  return done(swachtamapUpdateErr);
                }

                // Set assertions
                (swachtamapUpdateRes.body._id).should.equal(swachtamapSaveRes.body._id);
                (swachtamapUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Swachtamaps if not signed in', function (done) {
    // Create new Swachtamap model instance
    var swachtamapObj = new Swachtamap(swachtamap);

    // Save the swachtamap
    swachtamapObj.save(function () {
      // Request Swachtamaps
      request(app).get('/api/swachtamaps')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Swachtamap if not signed in', function (done) {
    // Create new Swachtamap model instance
    var swachtamapObj = new Swachtamap(swachtamap);

    // Save the Swachtamap
    swachtamapObj.save(function () {
      request(app).get('/api/swachtamaps/' + swachtamapObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', swachtamap.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Swachtamap with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/swachtamaps/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Swachtamap is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Swachtamap which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Swachtamap
    request(app).get('/api/swachtamaps/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Swachtamap with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Swachtamap if signed in', function (done) {
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

        // Save a new Swachtamap
        agent.post('/api/swachtamaps')
          .send(swachtamap)
          .expect(200)
          .end(function (swachtamapSaveErr, swachtamapSaveRes) {
            // Handle Swachtamap save error
            if (swachtamapSaveErr) {
              return done(swachtamapSaveErr);
            }

            // Delete an existing Swachtamap
            agent.delete('/api/swachtamaps/' + swachtamapSaveRes.body._id)
              .send(swachtamap)
              .expect(200)
              .end(function (swachtamapDeleteErr, swachtamapDeleteRes) {
                // Handle swachtamap error error
                if (swachtamapDeleteErr) {
                  return done(swachtamapDeleteErr);
                }

                // Set assertions
                (swachtamapDeleteRes.body._id).should.equal(swachtamapSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Swachtamap if not signed in', function (done) {
    // Set Swachtamap user
    swachtamap.user = user;

    // Create new Swachtamap model instance
    var swachtamapObj = new Swachtamap(swachtamap);

    // Save the Swachtamap
    swachtamapObj.save(function () {
      // Try deleting Swachtamap
      request(app).delete('/api/swachtamaps/' + swachtamapObj._id)
        .expect(403)
        .end(function (swachtamapDeleteErr, swachtamapDeleteRes) {
          // Set message assertion
          (swachtamapDeleteRes.body.message).should.match('User is not authorized');

          // Handle Swachtamap error error
          done(swachtamapDeleteErr);
        });

    });
  });

  it('should be able to get a single Swachtamap that has an orphaned user reference', function (done) {
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

          // Save a new Swachtamap
          agent.post('/api/swachtamaps')
            .send(swachtamap)
            .expect(200)
            .end(function (swachtamapSaveErr, swachtamapSaveRes) {
              // Handle Swachtamap save error
              if (swachtamapSaveErr) {
                return done(swachtamapSaveErr);
              }

              // Set assertions on new Swachtamap
              (swachtamapSaveRes.body.name).should.equal(swachtamap.name);
              should.exist(swachtamapSaveRes.body.user);
              should.equal(swachtamapSaveRes.body.user._id, orphanId);

              // force the Swachtamap to have an orphaned user reference
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

                    // Get the Swachtamap
                    agent.get('/api/swachtamaps/' + swachtamapSaveRes.body._id)
                      .expect(200)
                      .end(function (swachtamapInfoErr, swachtamapInfoRes) {
                        // Handle Swachtamap error
                        if (swachtamapInfoErr) {
                          return done(swachtamapInfoErr);
                        }

                        // Set assertions
                        (swachtamapInfoRes.body._id).should.equal(swachtamapSaveRes.body._id);
                        (swachtamapInfoRes.body.name).should.equal(swachtamap.name);
                        should.equal(swachtamapInfoRes.body.user, undefined);

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
      Swachtamap.remove().exec(done);
    });
  });
});

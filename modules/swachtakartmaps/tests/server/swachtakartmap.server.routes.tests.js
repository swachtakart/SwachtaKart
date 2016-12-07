'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Swachtakartmap = mongoose.model('Swachtakartmap'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  swachtakartmap;

/**
 * Swachtakartmap routes tests
 */
describe('Swachtakartmap CRUD tests', function () {

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

    // Save a user to the test db and create new Swachtakartmap
    user.save(function () {
      swachtakartmap = {
        name: 'Swachtakartmap name'
      };

      done();
    });
  });

  it('should be able to save a Swachtakartmap if logged in', function (done) {
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

        // Save a new Swachtakartmap
        agent.post('/api/swachtakartmaps')
          .send(swachtakartmap)
          .expect(200)
          .end(function (swachtakartmapSaveErr, swachtakartmapSaveRes) {
            // Handle Swachtakartmap save error
            if (swachtakartmapSaveErr) {
              return done(swachtakartmapSaveErr);
            }

            // Get a list of Swachtakartmaps
            agent.get('/api/swachtakartmaps')
              .end(function (swachtakartmapsGetErr, swachtakartmapsGetRes) {
                // Handle Swachtakartmaps save error
                if (swachtakartmapsGetErr) {
                  return done(swachtakartmapsGetErr);
                }

                // Get Swachtakartmaps list
                var swachtakartmaps = swachtakartmapsGetRes.body;

                // Set assertions
                (swachtakartmaps[0].user._id).should.equal(userId);
                (swachtakartmaps[0].name).should.match('Swachtakartmap name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Swachtakartmap if not logged in', function (done) {
    agent.post('/api/swachtakartmaps')
      .send(swachtakartmap)
      .expect(403)
      .end(function (swachtakartmapSaveErr, swachtakartmapSaveRes) {
        // Call the assertion callback
        done(swachtakartmapSaveErr);
      });
  });

  it('should not be able to save an Swachtakartmap if no name is provided', function (done) {
    // Invalidate name field
    swachtakartmap.name = '';

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

        // Save a new Swachtakartmap
        agent.post('/api/swachtakartmaps')
          .send(swachtakartmap)
          .expect(400)
          .end(function (swachtakartmapSaveErr, swachtakartmapSaveRes) {
            // Set message assertion
            (swachtakartmapSaveRes.body.message).should.match('Please fill Swachtakartmap name');

            // Handle Swachtakartmap save error
            done(swachtakartmapSaveErr);
          });
      });
  });

  it('should be able to update an Swachtakartmap if signed in', function (done) {
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

        // Save a new Swachtakartmap
        agent.post('/api/swachtakartmaps')
          .send(swachtakartmap)
          .expect(200)
          .end(function (swachtakartmapSaveErr, swachtakartmapSaveRes) {
            // Handle Swachtakartmap save error
            if (swachtakartmapSaveErr) {
              return done(swachtakartmapSaveErr);
            }

            // Update Swachtakartmap name
            swachtakartmap.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Swachtakartmap
            agent.put('/api/swachtakartmaps/' + swachtakartmapSaveRes.body._id)
              .send(swachtakartmap)
              .expect(200)
              .end(function (swachtakartmapUpdateErr, swachtakartmapUpdateRes) {
                // Handle Swachtakartmap update error
                if (swachtakartmapUpdateErr) {
                  return done(swachtakartmapUpdateErr);
                }

                // Set assertions
                (swachtakartmapUpdateRes.body._id).should.equal(swachtakartmapSaveRes.body._id);
                (swachtakartmapUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Swachtakartmaps if not signed in', function (done) {
    // Create new Swachtakartmap model instance
    var swachtakartmapObj = new Swachtakartmap(swachtakartmap);

    // Save the swachtakartmap
    swachtakartmapObj.save(function () {
      // Request Swachtakartmaps
      request(app).get('/api/swachtakartmaps')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Swachtakartmap if not signed in', function (done) {
    // Create new Swachtakartmap model instance
    var swachtakartmapObj = new Swachtakartmap(swachtakartmap);

    // Save the Swachtakartmap
    swachtakartmapObj.save(function () {
      request(app).get('/api/swachtakartmaps/' + swachtakartmapObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', swachtakartmap.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Swachtakartmap with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/swachtakartmaps/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Swachtakartmap is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Swachtakartmap which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Swachtakartmap
    request(app).get('/api/swachtakartmaps/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Swachtakartmap with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Swachtakartmap if signed in', function (done) {
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

        // Save a new Swachtakartmap
        agent.post('/api/swachtakartmaps')
          .send(swachtakartmap)
          .expect(200)
          .end(function (swachtakartmapSaveErr, swachtakartmapSaveRes) {
            // Handle Swachtakartmap save error
            if (swachtakartmapSaveErr) {
              return done(swachtakartmapSaveErr);
            }

            // Delete an existing Swachtakartmap
            agent.delete('/api/swachtakartmaps/' + swachtakartmapSaveRes.body._id)
              .send(swachtakartmap)
              .expect(200)
              .end(function (swachtakartmapDeleteErr, swachtakartmapDeleteRes) {
                // Handle swachtakartmap error error
                if (swachtakartmapDeleteErr) {
                  return done(swachtakartmapDeleteErr);
                }

                // Set assertions
                (swachtakartmapDeleteRes.body._id).should.equal(swachtakartmapSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Swachtakartmap if not signed in', function (done) {
    // Set Swachtakartmap user
    swachtakartmap.user = user;

    // Create new Swachtakartmap model instance
    var swachtakartmapObj = new Swachtakartmap(swachtakartmap);

    // Save the Swachtakartmap
    swachtakartmapObj.save(function () {
      // Try deleting Swachtakartmap
      request(app).delete('/api/swachtakartmaps/' + swachtakartmapObj._id)
        .expect(403)
        .end(function (swachtakartmapDeleteErr, swachtakartmapDeleteRes) {
          // Set message assertion
          (swachtakartmapDeleteRes.body.message).should.match('User is not authorized');

          // Handle Swachtakartmap error error
          done(swachtakartmapDeleteErr);
        });

    });
  });

  it('should be able to get a single Swachtakartmap that has an orphaned user reference', function (done) {
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

          // Save a new Swachtakartmap
          agent.post('/api/swachtakartmaps')
            .send(swachtakartmap)
            .expect(200)
            .end(function (swachtakartmapSaveErr, swachtakartmapSaveRes) {
              // Handle Swachtakartmap save error
              if (swachtakartmapSaveErr) {
                return done(swachtakartmapSaveErr);
              }

              // Set assertions on new Swachtakartmap
              (swachtakartmapSaveRes.body.name).should.equal(swachtakartmap.name);
              should.exist(swachtakartmapSaveRes.body.user);
              should.equal(swachtakartmapSaveRes.body.user._id, orphanId);

              // force the Swachtakartmap to have an orphaned user reference
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

                    // Get the Swachtakartmap
                    agent.get('/api/swachtakartmaps/' + swachtakartmapSaveRes.body._id)
                      .expect(200)
                      .end(function (swachtakartmapInfoErr, swachtakartmapInfoRes) {
                        // Handle Swachtakartmap error
                        if (swachtakartmapInfoErr) {
                          return done(swachtakartmapInfoErr);
                        }

                        // Set assertions
                        (swachtakartmapInfoRes.body._id).should.equal(swachtakartmapSaveRes.body._id);
                        (swachtakartmapInfoRes.body.name).should.equal(swachtakartmap.name);
                        should.equal(swachtakartmapInfoRes.body.user, undefined);

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
      Swachtakartmap.remove().exec(done);
    });
  });
});

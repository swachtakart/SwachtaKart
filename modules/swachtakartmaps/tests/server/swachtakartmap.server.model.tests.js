'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Swachtakartmap = mongoose.model('Swachtakartmap');

/**
 * Globals
 */
var user,
  swachtakartmap;

/**
 * Unit tests
 */
describe('Swachtakartmap Model Unit Tests:', function() {
  beforeEach(function(done) {
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: 'username',
      password: 'password'
    });

    user.save(function() {
      swachtakartmap = new Swachtakartmap({
        name: 'Swachtakartmap Name',
        user: user
      });

      done();
    });
  });

  describe('Method Save', function() {
    it('should be able to save without problems', function(done) {
      this.timeout(0);
      return swachtakartmap.save(function(err) {
        should.not.exist(err);
        done();
      });
    });

    it('should be able to show an error when try to save without name', function(done) {
      swachtakartmap.name = '';

      return swachtakartmap.save(function(err) {
        should.exist(err);
        done();
      });
    });
  });

  afterEach(function(done) {
    Swachtakartmap.remove().exec(function() {
      User.remove().exec(function() {
        done();
      });
    });
  });
});

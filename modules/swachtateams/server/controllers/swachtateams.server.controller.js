'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Swachtateam = mongoose.model('Swachtateam'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Swachtateam
 */
exports.create = function(req, res) {
  var swachtateam = new Swachtateam(req.body);
  swachtateam.user = req.user;

  swachtateam.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtateam);
    }
  });
};

/**
 * Show the current Swachtateam
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var swachtateam = req.swachtateam ? req.swachtateam.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  swachtateam.isCurrentUserOwner = req.user && swachtateam.user && swachtateam.user._id.toString() === req.user._id.toString();

  res.jsonp(swachtateam);
};

/**
 * Update a Swachtateam
 */
exports.update = function(req, res) {
  var swachtateam = req.swachtateam;

  swachtateam = _.extend(swachtateam, req.body);

  swachtateam.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtateam);
    }
  });
};

/**
 * Delete an Swachtateam
 */
exports.delete = function(req, res) {
  var swachtateam = req.swachtateam;

  swachtateam.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtateam);
    }
  });
};

/**
 * List of Swachtateams
 */
exports.list = function(req, res) {
  Swachtateam.find().sort('-created').populate('user', 'displayName').exec(function(err, swachtateams) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtateams);
    }
  });
};

/**
 * Swachtateam middleware
 */
exports.swachtateamByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Swachtateam is invalid'
    });
  }

  Swachtateam.findById(id).populate('user', 'displayName').exec(function (err, swachtateam) {
    if (err) {
      return next(err);
    } else if (!swachtateam) {
      return res.status(404).send({
        message: 'No Swachtateam with that identifier has been found'
      });
    }
    req.swachtateam = swachtateam;
    next();
  });
};

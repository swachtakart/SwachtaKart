'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Swachtaproject = mongoose.model('Swachtaproject'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Swachtaproject
 */
exports.create = function(req, res) {
  var swachtaproject = new Swachtaproject(req.body);
  swachtaproject.user = req.user;

  swachtaproject.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtaproject);
    }
  });
};

/**
 * Show the current Swachtaproject
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var swachtaproject = req.swachtaproject ? req.swachtaproject.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  swachtaproject.isCurrentUserOwner = req.user && swachtaproject.user && swachtaproject.user._id.toString() === req.user._id.toString();

  res.jsonp(swachtaproject);
};

/**
 * Update a Swachtaproject
 */
exports.update = function(req, res) {
  var swachtaproject = req.swachtaproject;

  swachtaproject = _.extend(swachtaproject, req.body);

  swachtaproject.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtaproject);
    }
  });
};

/**
 * Delete an Swachtaproject
 */
exports.delete = function(req, res) {
  var swachtaproject = req.swachtaproject;

  swachtaproject.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtaproject);
    }
  });
};

/**
 * List of Swachtaprojects
 */
exports.list = function(req, res) {
  Swachtaproject.find().sort('-created').populate('user', 'displayName').exec(function(err, swachtaprojects) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtaprojects);
    }
  });
};

/**
 * Swachtaproject middleware
 */
exports.swachtaprojectByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Swachtaproject is invalid'
    });
  }

  Swachtaproject.findById(id).populate('user', 'displayName').exec(function (err, swachtaproject) {
    if (err) {
      return next(err);
    } else if (!swachtaproject) {
      return res.status(404).send({
        message: 'No Swachtaproject with that identifier has been found'
      });
    }
    req.swachtaproject = swachtaproject;
    next();
  });
};

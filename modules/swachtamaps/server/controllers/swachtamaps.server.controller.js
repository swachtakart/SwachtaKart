'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Swachtamap = mongoose.model('Swachtamap'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Swachtamap
 */
exports.create = function(req, res) {
  var swachtamap = new Swachtamap(req.body);
  swachtamap.user = req.user;

  swachtamap.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtamap);
    }
  });
};

/**
 * Show the current Swachtamap
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var swachtamap = req.swachtamap ? req.swachtamap.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  swachtamap.isCurrentUserOwner = req.user && swachtamap.user && swachtamap.user._id.toString() === req.user._id.toString();

  res.jsonp(swachtamap);
};

/**
 * Update a Swachtamap
 */
exports.update = function(req, res) {
  var swachtamap = req.swachtamap;

  swachtamap = _.extend(swachtamap, req.body);

  swachtamap.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtamap);
    }
  });
};

/**
 * Delete an Swachtamap
 */
exports.delete = function(req, res) {
  var swachtamap = req.swachtamap;

  swachtamap.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtamap);
    }
  });
};

/**
 * List of Swachtamaps
 */
exports.list = function(req, res) {
  Swachtamap.find().sort('-created').populate('user', 'displayName').exec(function(err, swachtamaps) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtamaps);
    }
  });
};

/**
 * Swachtamap middleware
 */
exports.swachtamapByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Swachtamap is invalid'
    });
  }

  Swachtamap.findById(id).populate('user', 'displayName').exec(function (err, swachtamap) {
    if (err) {
      return next(err);
    } else if (!swachtamap) {
      return res.status(404).send({
        message: 'No Swachtamap with that identifier has been found'
      });
    }
    req.swachtamap = swachtamap;
    next();
  });
};

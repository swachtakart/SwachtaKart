'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Swachtakartmap = mongoose.model('Swachtakartmap'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Swachtakartmap
 */
exports.create = function(req, res) {
  var swachtakartmap = new Swachtakartmap(req.body);
  swachtakartmap.user = req.user;

  swachtakartmap.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtakartmap);
    }
  });
};

/**
 * Show the current Swachtakartmap
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var swachtakartmap = req.swachtakartmap ? req.swachtakartmap.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  swachtakartmap.isCurrentUserOwner = req.user && swachtakartmap.user && swachtakartmap.user._id.toString() === req.user._id.toString();

  res.jsonp(swachtakartmap);
};

/**
 * Update a Swachtakartmap
 */
exports.update = function(req, res) {
  var swachtakartmap = req.swachtakartmap;

  swachtakartmap = _.extend(swachtakartmap, req.body);

  swachtakartmap.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtakartmap);
    }
  });
};

/**
 * Delete an Swachtakartmap
 */
exports.delete = function(req, res) {
  var swachtakartmap = req.swachtakartmap;

  swachtakartmap.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtakartmap);
    }
  });
};

/**
 * List of Swachtakartmaps
 */
exports.list = function(req, res) {
  Swachtakartmap.find().sort('-created').populate('user', 'displayName').exec(function(err, swachtakartmaps) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(swachtakartmaps);
    }
  });
};

/**
 * Swachtakartmap middleware
 */
exports.swachtakartmapByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Swachtakartmap is invalid'
    });
  }

  Swachtakartmap.findById(id).populate('user', 'displayName').exec(function (err, swachtakartmap) {
    if (err) {
      return next(err);
    } else if (!swachtakartmap) {
      return res.status(404).send({
        message: 'No Swachtakartmap with that identifier has been found'
      });
    }
    req.swachtakartmap = swachtakartmap;
    next();
  });
};

'use strict';

/**
 * Module dependencies
 */
var swachtamapsPolicy = require('../policies/swachtamaps.server.policy'),
  swachtamaps = require('../controllers/swachtamaps.server.controller');

module.exports = function(app) {
  // Swachtamaps Routes
  app.route('/api/swachtamaps').all(swachtamapsPolicy.isAllowed)
    .get(swachtamaps.list)
    .post(swachtamaps.create);

  app.route('/api/swachtamaps/:swachtamapId').all(swachtamapsPolicy.isAllowed)
    .get(swachtamaps.read)
    .put(swachtamaps.update)
    .delete(swachtamaps.delete);

  // Finish by binding the Swachtamap middleware
  app.param('swachtamapId', swachtamaps.swachtamapByID);
};

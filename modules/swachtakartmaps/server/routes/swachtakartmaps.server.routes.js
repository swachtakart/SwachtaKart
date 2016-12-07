'use strict';

/**
 * Module dependencies
 */
var swachtakartmapsPolicy = require('../policies/swachtakartmaps.server.policy'),
  swachtakartmaps = require('../controllers/swachtakartmaps.server.controller');

module.exports = function(app) {
  // Swachtakartmaps Routes
  app.route('/api/swachtakartmaps').all(swachtakartmapsPolicy.isAllowed)
    .get(swachtakartmaps.list)
    .post(swachtakartmaps.create);

  app.route('/api/swachtakartmaps/:swachtakartmapId').all(swachtakartmapsPolicy.isAllowed)
    .get(swachtakartmaps.read)
    .put(swachtakartmaps.update)
    .delete(swachtakartmaps.delete);

  // Finish by binding the Swachtakartmap middleware
  app.param('swachtakartmapId', swachtakartmaps.swachtakartmapByID);
};

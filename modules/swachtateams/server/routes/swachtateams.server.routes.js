'use strict';

/**
 * Module dependencies
 */
var swachtateamsPolicy = require('../policies/swachtateams.server.policy'),
  swachtateams = require('../controllers/swachtateams.server.controller');

module.exports = function(app) {
  // Swachtateams Routes
  app.route('/api/swachtateams').all(swachtateamsPolicy.isAllowed)
    .get(swachtateams.list)
    .post(swachtateams.create);

  app.route('/api/swachtateams/:swachtateamId').all(swachtateamsPolicy.isAllowed)
    .get(swachtateams.read)
    .put(swachtateams.update)
    .delete(swachtateams.delete);

  // Finish by binding the Swachtateam middleware
  app.param('swachtateamId', swachtateams.swachtateamByID);
};

'use strict';

/**
 * Module dependencies
 */
var swachtaprojectsPolicy = require('../policies/swachtaprojects.server.policy'),
  swachtaprojects = require('../controllers/swachtaprojects.server.controller');

module.exports = function(app) {
  // Swachtaprojects Routes
  app.route('/api/swachtaprojects').all(swachtaprojectsPolicy.isAllowed)
    .get(swachtaprojects.list)
    .post(swachtaprojects.create);

  app.route('/api/swachtaprojects/:swachtaprojectId').all(swachtaprojectsPolicy.isAllowed)
    .get(swachtaprojects.read)
    .put(swachtaprojects.update)
    .delete(swachtaprojects.delete);

  // Finish by binding the Swachtaproject middleware
  app.param('swachtaprojectId', swachtaprojects.swachtaprojectByID);
};

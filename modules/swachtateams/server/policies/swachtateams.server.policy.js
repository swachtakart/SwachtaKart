'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Swachtateams Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/swachtateams',
      permissions: '*'
    }, {
      resources: '/api/swachtateams/:swachtateamId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/swachtateams',
      permissions: ['get', 'post']
    }, {
      resources: '/api/swachtateams/:swachtateamId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/swachtateams',
      permissions: ['get']
    }, {
      resources: '/api/swachtateams/:swachtateamId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Swachtateams Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Swachtateam is being processed and the current user created it then allow any manipulation
  if (req.swachtateam && req.user && req.swachtateam.user && req.swachtateam.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};

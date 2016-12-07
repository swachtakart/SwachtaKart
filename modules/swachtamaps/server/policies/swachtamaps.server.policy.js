'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Swachtamaps Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/swachtamaps',
      permissions: '*'
    }, {
      resources: '/api/swachtamaps/:swachtamapId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/swachtamaps',
      permissions: ['get', 'post']
    }, {
      resources: '/api/swachtamaps/:swachtamapId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/swachtamaps',
      permissions: ['get']
    }, {
      resources: '/api/swachtamaps/:swachtamapId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Swachtamaps Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Swachtamap is being processed and the current user created it then allow any manipulation
  if (req.swachtamap && req.user && req.swachtamap.user && req.swachtamap.user.id === req.user.id) {
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

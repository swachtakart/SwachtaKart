// Swachtateams service used to communicate Swachtateams REST endpoints
(function () {
  'use strict';

  angular
    .module('swachtateams')
    .factory('SwachtateamsService', SwachtateamsService);

  SwachtateamsService.$inject = ['$resource'];

  function SwachtateamsService($resource) {
    return $resource('api/swachtateams/:swachtateamId', {
      swachtateamId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

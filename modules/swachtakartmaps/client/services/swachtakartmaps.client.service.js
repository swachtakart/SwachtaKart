// Swachtakartmaps service used to communicate Swachtakartmaps REST endpoints
(function () {
  'use strict';

  angular
    .module('swachtakartmaps')
    .factory('SwachtakartmapsService', SwachtakartmapsService);

  SwachtakartmapsService.$inject = ['$resource'];

  function SwachtakartmapsService($resource) {
    return $resource('api/swachtakartmaps/:swachtakartmapId', {
      swachtakartmapId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

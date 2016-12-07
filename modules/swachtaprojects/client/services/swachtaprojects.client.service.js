// Swachtaprojects service used to communicate Swachtaprojects REST endpoints
(function () {
  'use strict';

  angular
    .module('swachtaprojects')
    .factory('SwachtaprojectsService', SwachtaprojectsService);

  SwachtaprojectsService.$inject = ['$resource'];

  function SwachtaprojectsService($resource) {
    return $resource('api/swachtaprojects/:swachtaprojectId', {
      swachtaprojectId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

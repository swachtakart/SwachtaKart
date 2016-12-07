// Swachtamaps service used to communicate Swachtamaps REST endpoints
(function () {
  'use strict';

  angular
    .module('swachtamaps')
    .factory('SwachtamapsService', SwachtamapsService);

  SwachtamapsService.$inject = ['$resource'];

  function SwachtamapsService($resource) {
    return $resource('api/swachtamaps/:swachtamapId', {
      swachtamapId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());

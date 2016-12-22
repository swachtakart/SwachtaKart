(function () {
  'use strict';

  // Swachtamaps controller
  angular
    .module('swachtamaps')
    .controller('SwachtamapsController', SwachtamapsController);

  SwachtamapsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'swachtamapResolve','NgMap'];

  function SwachtamapsController ($scope, $state, $window, Authentication, swachtamap,NgMap) {
    var vm = this;

    vm.authentication = Authentication;
    vm.swachtamap = swachtamap;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $scope.positions = [{
    lat: 43.07493,
    lng: -89.381388},
    {
    lat: 33.07493,
    lng: -69.381388},
    {
    lat: 53.07493,
    lng: -79.381388},
    {
    lat: 63.07493,
    lng: -99.381388}
  ];

    NgMap.getMap().then(function(map) {
  //Map Initialize Options
    });
    // Remove existing Swachtamap
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.swachtamap.$remove($state.go('swachtamaps.list'));
      }
    }

    // Save Swachtamap
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.swachtamapForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.swachtamap._id) {
        vm.swachtamap.$update(successCallback, errorCallback);
      } else {
        vm.swachtamap.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('swachtamaps.view', {
          swachtamapId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

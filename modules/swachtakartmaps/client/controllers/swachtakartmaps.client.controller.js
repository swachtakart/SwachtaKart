(function () {
  'use strict';

  // Swachtakartmaps controller
  angular
    .module('swachtakartmaps',['ngMap'])
    .controller('SwachtakartmapsController', SwachtakartmapsController);

  SwachtakartmapsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'swachtakartmapResolve'];

  function SwachtakartmapsController ($scope, $state, $window, Authentication, swachtakartmap) {
    var vm = this;

    vm.authentication = Authentication;
    vm.swachtakartmap = swachtakartmap;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    $scope.googleMapsUrl='https://maps.googleapis.com/maps/api/js?key=AIzaSyB0CzPIm1aCazt8xpoFcMmGiqgAwnEoBJQ';

    // Remove existing Swachtakartmap
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.swachtakartmap.$remove($state.go('swachtakartmaps.list'));
      }
    }

    // Save Swachtakartmap
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.swachtakartmapForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.swachtakartmap._id) {
        vm.swachtakartmap.$update(successCallback, errorCallback);
      } else {
        vm.swachtakartmap.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('swachtakartmaps.view', {
          swachtakartmapId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

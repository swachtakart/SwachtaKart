(function () {
  'use strict';

  // Swachtamaps controller
  angular
    .module('swachtamaps')
    .controller('SwachtamapsController', SwachtamapsController);

  SwachtamapsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'swachtamapResolve'];

  function SwachtamapsController ($scope, $state, $window, Authentication, swachtamap) {
    var vm = this;

    vm.authentication = Authentication;
    vm.swachtamap = swachtamap;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

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

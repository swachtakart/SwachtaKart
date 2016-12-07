(function () {
  'use strict';

  // Swachtaprojects controller
  angular
    .module('swachtaprojects')
    .controller('SwachtaprojectsController', SwachtaprojectsController);

  SwachtaprojectsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'swachtaprojectResolve'];

  function SwachtaprojectsController ($scope, $state, $window, Authentication, swachtaproject) {
    var vm = this;

    vm.authentication = Authentication;
    vm.swachtaproject = swachtaproject;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Swachtaproject
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.swachtaproject.$remove($state.go('swachtaprojects.list'));
      }
    }

    // Save Swachtaproject
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.swachtaprojectForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.swachtaproject._id) {
        vm.swachtaproject.$update(successCallback, errorCallback);
      } else {
        vm.swachtaproject.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('swachtaprojects.view', {
          swachtaprojectId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

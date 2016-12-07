(function () {
  'use strict';

  // Swachtateams controller
  angular
    .module('swachtateams')
    .controller('SwachtateamsController', SwachtateamsController);

  SwachtateamsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'swachtateamResolve','$document'];

  function SwachtateamsController ($scope, $state, $window, Authentication, swachtateam,$modal,$document) {
    var vm = this;

    vm.authentication = Authentication;
    vm.swachtateam = swachtateam;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.animationsEnabled = true;

    vm.items = ['item1', 'item2', 'item3']

    vm.open = function (size, parentSelector) {
    //  alert("Inside Open Modal");
    var parentElem = parentSelector ? 
      angular.element($document[0].querySelector('.modal-demo ' + parentSelector)) : undefined;
    var modalInstance = $modal.open({
      animation: vm.animationsEnabled,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'directives/SwachtaModalContent.html',
      controller: 'SwachtateamsController',
      controllerAs: 'vm',
      size: size,
      appendTo: parentElem,
      resolve: {
        items: function () {
          return vm.items;
        }
      }
    });
    modalInstance.result.then(function (selectedItem) {
      vm.selected = selectedItem;
    }, function () {
    //  $log.info('Modal dismissed at: ' + new Date());
    });
  };

    function openModal() {
      alert("Into Modal");
     // angular.element(#addMemberModal).trigger();
    }

    // Remove existing Swachtateam
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.swachtateam.$remove($state.go('swachtateams.list'));
      }
    }

    // Save Swachtateam
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.swachtateamForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.swachtateam._id) {
        vm.swachtateam.$update(successCallback, errorCallback);
      } else {
        vm.swachtateam.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('swachtateams.view', {
          swachtateamId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());

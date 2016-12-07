(function () {
  'use strict';

  angular
    .module('swachtakartmaps')
    .controller('SwachtakartmapsListController', SwachtakartmapsListController);

  SwachtakartmapsListController.$inject = ['SwachtakartmapsService'];

  function SwachtakartmapsListController(SwachtakartmapsService) {
    var vm = this;

    vm.swachtakartmaps = SwachtakartmapsService.query();
  }
}());

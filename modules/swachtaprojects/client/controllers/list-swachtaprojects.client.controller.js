(function () {
  'use strict';

  angular
    .module('swachtaprojects')
    .controller('SwachtaprojectsListController', SwachtaprojectsListController);

  SwachtaprojectsListController.$inject = ['SwachtaprojectsService'];

  function SwachtaprojectsListController(SwachtaprojectsService) {
    var vm = this;

    vm.swachtaprojects = SwachtaprojectsService.query();
  }
}());

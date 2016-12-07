(function () {
  'use strict';

  angular
    .module('swachtamaps')
    .controller('SwachtamapsListController', SwachtamapsListController);

  SwachtamapsListController.$inject = ['SwachtamapsService'];

  function SwachtamapsListController(SwachtamapsService) {
    var vm = this;

    vm.swachtamaps = SwachtamapsService.query();
  }
}());

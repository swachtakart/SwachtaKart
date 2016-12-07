(function () {
  'use strict';

  angular
    .module('swachtateams')
    .controller('SwachtateamsListController', SwachtateamsListController);

  SwachtateamsListController.$inject = ['SwachtateamsService'];

  function SwachtateamsListController(SwachtateamsService) {
    var vm = this;

    vm.swachtateams = SwachtateamsService.query();
  }
}());

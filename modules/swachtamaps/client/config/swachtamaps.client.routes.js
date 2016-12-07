(function () {
  'use strict';

  angular
    .module('swachtamaps')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('swachtamaps', {
        abstract: true,
        url: '/swachtamaps',
        template: '<ui-view/>'
      })
      .state('swachtamaps.list', {
        url: '',
        templateUrl: 'modules/swachtamaps/client/views/list-swachtamaps.client.view.html',
        controller: 'SwachtamapsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Swachtamaps List'
        }
      })
      .state('swachtamaps.create', {
        url: '/create',
        templateUrl: 'modules/swachtamaps/client/views/form-swachtamap.client.view.html',
        controller: 'SwachtamapsController',
        controllerAs: 'vm',
        resolve: {
          swachtamapResolve: newSwachtamap
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Swachtamaps Create'
        }
      })
      .state('swachtamaps.edit', {
        url: '/:swachtamapId/edit',
        templateUrl: 'modules/swachtamaps/client/views/form-swachtamap.client.view.html',
        controller: 'SwachtamapsController',
        controllerAs: 'vm',
        resolve: {
          swachtamapResolve: getSwachtamap
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Swachtamap {{ swachtamapResolve.name }}'
        }
      })
      .state('swachtamaps.view', {
        url: '/:swachtamapId',
        templateUrl: 'modules/swachtamaps/client/views/view-swachtamap.client.view.html',
        controller: 'SwachtamapsController',
        controllerAs: 'vm',
        resolve: {
          swachtamapResolve: getSwachtamap
        },
        data: {
          pageTitle: 'Swachtamap {{ swachtamapResolve.name }}'
        }
      });
  }

  getSwachtamap.$inject = ['$stateParams', 'SwachtamapsService'];

  function getSwachtamap($stateParams, SwachtamapsService) {
    return SwachtamapsService.get({
      swachtamapId: $stateParams.swachtamapId
    }).$promise;
  }

  newSwachtamap.$inject = ['SwachtamapsService'];

  function newSwachtamap(SwachtamapsService) {
    return new SwachtamapsService();
  }
}());

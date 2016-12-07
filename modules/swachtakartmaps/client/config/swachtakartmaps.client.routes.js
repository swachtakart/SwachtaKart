(function () {
  'use strict';

  angular
    .module('swachtakartmaps')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('swachtakartmaps', {
        abstract: true,
        url: '/swachtakartmaps',
        template: '<ui-view/>'
      })
      .state('swachtakartmaps.list', {
        url: '',
        templateUrl: 'modules/swachtakartmaps/client/views/list-swachtakartmaps.client.view.html',
        controller: 'SwachtakartmapsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Swachtakartmaps List'
        }
      })
      .state('swachtakartmaps.create', {
        url: '/create',
        templateUrl: 'modules/swachtakartmaps/client/views/form-swachtakartmap.client.view.html',
        controller: 'SwachtakartmapsController',
        controllerAs: 'vm',
        resolve: {
          swachtakartmapResolve: newSwachtakartmap
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Swachtakartmaps Create'
        }
      })
      .state('swachtakartmaps.edit', {
        url: '/:swachtakartmapId/edit',
        templateUrl: 'modules/swachtakartmaps/client/views/form-swachtakartmap.client.view.html',
        controller: 'SwachtakartmapsController',
        controllerAs: 'vm',
        resolve: {
          swachtakartmapResolve: getSwachtakartmap
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Swachtakartmap {{ swachtakartmapResolve.name }}'
        }
      })
      .state('swachtakartmaps.view', {
        url: '/:swachtakartmapId',
        templateUrl: 'modules/swachtakartmaps/client/views/view-swachtakartmap.client.view.html',
        controller: 'SwachtakartmapsController',
        controllerAs: 'vm',
        resolve: {
          swachtakartmapResolve: getSwachtakartmap
        },
        data: {
          pageTitle: 'Swachtakartmap {{ swachtakartmapResolve.name }}'
        }
      });
  }

  getSwachtakartmap.$inject = ['$stateParams', 'SwachtakartmapsService'];

  function getSwachtakartmap($stateParams, SwachtakartmapsService) {
    return SwachtakartmapsService.get({
      swachtakartmapId: $stateParams.swachtakartmapId
    }).$promise;
  }

  newSwachtakartmap.$inject = ['SwachtakartmapsService'];

  function newSwachtakartmap(SwachtakartmapsService) {
    return new SwachtakartmapsService();
  }
}());

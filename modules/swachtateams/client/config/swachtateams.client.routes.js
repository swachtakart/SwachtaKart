(function () {
  'use strict';

  angular
    .module('swachtateams')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('swachtateams', {
        abstract: true,
        url: '/swachtateams',
        template: '<ui-view/>'
      })
      .state('swachtateams.list', {
        url: '',
        templateUrl: 'modules/swachtateams/client/views/list-swachtateams.client.view.html',
        controller: 'SwachtateamsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Swachtateams List'
        }
      })
      .state('swachtateams.create', {
        url: '/create',
        templateUrl: 'modules/swachtateams/client/views/form-swachtateam.client.view.html',
        controller: 'SwachtateamsController',
        controllerAs: 'vm',
        resolve: {
          swachtateamResolve: newSwachtateam
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Swachtateams Create'
        }
      })
      .state('swachtateams.edit', {
        url: '/:swachtateamId/edit',
        templateUrl: 'modules/swachtateams/client/views/form-swachtateam.client.view.html',
        controller: 'SwachtateamsController',
        controllerAs: 'vm',
        resolve: {
          swachtateamResolve: getSwachtateam
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Swachtateam {{ swachtateamResolve.name }}'
        }
      })
      .state('swachtateams.view', {
        url: '/:swachtateamId',
        templateUrl: 'modules/swachtateams/client/views/view-swachtateam.client.view.html',
        controller: 'SwachtateamsController',
        controllerAs: 'vm',
        resolve: {
          swachtateamResolve: getSwachtateam
        },
        data: {
          pageTitle: 'Swachtateam {{ swachtateamResolve.name }}'
        }
      });
  }

  getSwachtateam.$inject = ['$stateParams', 'SwachtateamsService'];

  function getSwachtateam($stateParams, SwachtateamsService) {
    return SwachtateamsService.get({
      swachtateamId: $stateParams.swachtateamId
    }).$promise;
  }

  newSwachtateam.$inject = ['SwachtateamsService'];

  function newSwachtateam(SwachtateamsService) {
    return new SwachtateamsService();
  }
}());

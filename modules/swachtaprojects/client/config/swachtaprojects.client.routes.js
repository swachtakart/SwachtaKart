(function () {
  'use strict';

  angular
    .module('swachtaprojects')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('swachtaprojects', {
        abstract: true,
        url: '/swachtaprojects',
        template: '<ui-view/>'
      })
      .state('swachtaprojects.list', {
        url: '',
        templateUrl: 'modules/swachtaprojects/client/views/list-swachtaprojects.client.view.html',
        controller: 'SwachtaprojectsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Swachtaprojects List'
        }
      })
      .state('swachtaprojects.create', {
        url: '/create',
        templateUrl: 'modules/swachtaprojects/client/views/form-swachtaproject.client.view.html',
        controller: 'SwachtaprojectsController',
        controllerAs: 'vm',
        resolve: {
          swachtaprojectResolve: newSwachtaproject
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Swachtaprojects Create'
        }
      })
      .state('swachtaprojects.edit', {
        url: '/:swachtaprojectId/edit',
        templateUrl: 'modules/swachtaprojects/client/views/form-swachtaproject.client.view.html',
        controller: 'SwachtaprojectsController',
        controllerAs: 'vm',
        resolve: {
          swachtaprojectResolve: getSwachtaproject
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Swachtaproject {{ swachtaprojectResolve.name }}'
        }
      })
      .state('swachtaprojects.view', {
        url: '/:swachtaprojectId',
        templateUrl: 'modules/swachtaprojects/client/views/view-swachtaproject.client.view.html',
        controller: 'SwachtaprojectsController',
        controllerAs: 'vm',
        resolve: {
          swachtaprojectResolve: getSwachtaproject
        },
        data: {
          pageTitle: 'Swachtaproject {{ swachtaprojectResolve.name }}'
        }
      });
  }

  getSwachtaproject.$inject = ['$stateParams', 'SwachtaprojectsService'];

  function getSwachtaproject($stateParams, SwachtaprojectsService) {
    return SwachtaprojectsService.get({
      swachtaprojectId: $stateParams.swachtaprojectId
    }).$promise;
  }

  newSwachtaproject.$inject = ['SwachtaprojectsService'];

  function newSwachtaproject(SwachtaprojectsService) {
    return new SwachtaprojectsService();
  }
}());

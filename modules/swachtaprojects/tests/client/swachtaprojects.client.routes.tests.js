(function () {
  'use strict';

  describe('Swachtaprojects Route Tests', function () {
    // Initialize global variables
    var $scope,
      SwachtaprojectsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SwachtaprojectsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SwachtaprojectsService = _SwachtaprojectsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('swachtaprojects');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/swachtaprojects');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SwachtaprojectsController,
          mockSwachtaproject;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('swachtaprojects.view');
          $templateCache.put('modules/swachtaprojects/client/views/view-swachtaproject.client.view.html', '');

          // create mock Swachtaproject
          mockSwachtaproject = new SwachtaprojectsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Swachtaproject Name'
          });

          // Initialize Controller
          SwachtaprojectsController = $controller('SwachtaprojectsController as vm', {
            $scope: $scope,
            swachtaprojectResolve: mockSwachtaproject
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:swachtaprojectId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.swachtaprojectResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            swachtaprojectId: 1
          })).toEqual('/swachtaprojects/1');
        }));

        it('should attach an Swachtaproject to the controller scope', function () {
          expect($scope.vm.swachtaproject._id).toBe(mockSwachtaproject._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/swachtaprojects/client/views/view-swachtaproject.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SwachtaprojectsController,
          mockSwachtaproject;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('swachtaprojects.create');
          $templateCache.put('modules/swachtaprojects/client/views/form-swachtaproject.client.view.html', '');

          // create mock Swachtaproject
          mockSwachtaproject = new SwachtaprojectsService();

          // Initialize Controller
          SwachtaprojectsController = $controller('SwachtaprojectsController as vm', {
            $scope: $scope,
            swachtaprojectResolve: mockSwachtaproject
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.swachtaprojectResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/swachtaprojects/create');
        }));

        it('should attach an Swachtaproject to the controller scope', function () {
          expect($scope.vm.swachtaproject._id).toBe(mockSwachtaproject._id);
          expect($scope.vm.swachtaproject._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/swachtaprojects/client/views/form-swachtaproject.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SwachtaprojectsController,
          mockSwachtaproject;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('swachtaprojects.edit');
          $templateCache.put('modules/swachtaprojects/client/views/form-swachtaproject.client.view.html', '');

          // create mock Swachtaproject
          mockSwachtaproject = new SwachtaprojectsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Swachtaproject Name'
          });

          // Initialize Controller
          SwachtaprojectsController = $controller('SwachtaprojectsController as vm', {
            $scope: $scope,
            swachtaprojectResolve: mockSwachtaproject
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:swachtaprojectId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.swachtaprojectResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            swachtaprojectId: 1
          })).toEqual('/swachtaprojects/1/edit');
        }));

        it('should attach an Swachtaproject to the controller scope', function () {
          expect($scope.vm.swachtaproject._id).toBe(mockSwachtaproject._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/swachtaprojects/client/views/form-swachtaproject.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

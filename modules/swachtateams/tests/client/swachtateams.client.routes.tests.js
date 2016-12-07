(function () {
  'use strict';

  describe('Swachtateams Route Tests', function () {
    // Initialize global variables
    var $scope,
      SwachtateamsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SwachtateamsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SwachtateamsService = _SwachtateamsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('swachtateams');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/swachtateams');
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
          SwachtateamsController,
          mockSwachtateam;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('swachtateams.view');
          $templateCache.put('modules/swachtateams/client/views/view-swachtateam.client.view.html', '');

          // create mock Swachtateam
          mockSwachtateam = new SwachtateamsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Swachtateam Name'
          });

          // Initialize Controller
          SwachtateamsController = $controller('SwachtateamsController as vm', {
            $scope: $scope,
            swachtateamResolve: mockSwachtateam
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:swachtateamId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.swachtateamResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            swachtateamId: 1
          })).toEqual('/swachtateams/1');
        }));

        it('should attach an Swachtateam to the controller scope', function () {
          expect($scope.vm.swachtateam._id).toBe(mockSwachtateam._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/swachtateams/client/views/view-swachtateam.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SwachtateamsController,
          mockSwachtateam;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('swachtateams.create');
          $templateCache.put('modules/swachtateams/client/views/form-swachtateam.client.view.html', '');

          // create mock Swachtateam
          mockSwachtateam = new SwachtateamsService();

          // Initialize Controller
          SwachtateamsController = $controller('SwachtateamsController as vm', {
            $scope: $scope,
            swachtateamResolve: mockSwachtateam
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.swachtateamResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/swachtateams/create');
        }));

        it('should attach an Swachtateam to the controller scope', function () {
          expect($scope.vm.swachtateam._id).toBe(mockSwachtateam._id);
          expect($scope.vm.swachtateam._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/swachtateams/client/views/form-swachtateam.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SwachtateamsController,
          mockSwachtateam;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('swachtateams.edit');
          $templateCache.put('modules/swachtateams/client/views/form-swachtateam.client.view.html', '');

          // create mock Swachtateam
          mockSwachtateam = new SwachtateamsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Swachtateam Name'
          });

          // Initialize Controller
          SwachtateamsController = $controller('SwachtateamsController as vm', {
            $scope: $scope,
            swachtateamResolve: mockSwachtateam
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:swachtateamId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.swachtateamResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            swachtateamId: 1
          })).toEqual('/swachtateams/1/edit');
        }));

        it('should attach an Swachtateam to the controller scope', function () {
          expect($scope.vm.swachtateam._id).toBe(mockSwachtateam._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/swachtateams/client/views/form-swachtateam.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

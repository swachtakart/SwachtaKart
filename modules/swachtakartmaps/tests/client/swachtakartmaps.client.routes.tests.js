(function () {
  'use strict';

  describe('Swachtakartmaps Route Tests', function () {
    // Initialize global variables
    var $scope,
      SwachtakartmapsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SwachtakartmapsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SwachtakartmapsService = _SwachtakartmapsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('swachtakartmaps');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/swachtakartmaps');
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
          SwachtakartmapsController,
          mockSwachtakartmap;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('swachtakartmaps.view');
          $templateCache.put('modules/swachtakartmaps/client/views/view-swachtakartmap.client.view.html', '');

          // create mock Swachtakartmap
          mockSwachtakartmap = new SwachtakartmapsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Swachtakartmap Name'
          });

          // Initialize Controller
          SwachtakartmapsController = $controller('SwachtakartmapsController as vm', {
            $scope: $scope,
            swachtakartmapResolve: mockSwachtakartmap
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:swachtakartmapId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.swachtakartmapResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            swachtakartmapId: 1
          })).toEqual('/swachtakartmaps/1');
        }));

        it('should attach an Swachtakartmap to the controller scope', function () {
          expect($scope.vm.swachtakartmap._id).toBe(mockSwachtakartmap._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/swachtakartmaps/client/views/view-swachtakartmap.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SwachtakartmapsController,
          mockSwachtakartmap;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('swachtakartmaps.create');
          $templateCache.put('modules/swachtakartmaps/client/views/form-swachtakartmap.client.view.html', '');

          // create mock Swachtakartmap
          mockSwachtakartmap = new SwachtakartmapsService();

          // Initialize Controller
          SwachtakartmapsController = $controller('SwachtakartmapsController as vm', {
            $scope: $scope,
            swachtakartmapResolve: mockSwachtakartmap
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.swachtakartmapResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/swachtakartmaps/create');
        }));

        it('should attach an Swachtakartmap to the controller scope', function () {
          expect($scope.vm.swachtakartmap._id).toBe(mockSwachtakartmap._id);
          expect($scope.vm.swachtakartmap._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/swachtakartmaps/client/views/form-swachtakartmap.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SwachtakartmapsController,
          mockSwachtakartmap;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('swachtakartmaps.edit');
          $templateCache.put('modules/swachtakartmaps/client/views/form-swachtakartmap.client.view.html', '');

          // create mock Swachtakartmap
          mockSwachtakartmap = new SwachtakartmapsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Swachtakartmap Name'
          });

          // Initialize Controller
          SwachtakartmapsController = $controller('SwachtakartmapsController as vm', {
            $scope: $scope,
            swachtakartmapResolve: mockSwachtakartmap
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:swachtakartmapId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.swachtakartmapResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            swachtakartmapId: 1
          })).toEqual('/swachtakartmaps/1/edit');
        }));

        it('should attach an Swachtakartmap to the controller scope', function () {
          expect($scope.vm.swachtakartmap._id).toBe(mockSwachtakartmap._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/swachtakartmaps/client/views/form-swachtakartmap.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());

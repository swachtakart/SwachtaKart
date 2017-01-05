(function () {
  'use strict';

  // Swachtamaps controller
  angular
    .module('swachtamaps')
    .controller('SwachtamapsController', SwachtamapsController);

  SwachtamapsController.$inject = ['$scope', '$state', '$window', 'Authentication', 'swachtamapResolve', 'NgMap'];

  function SwachtamapsController($scope, $state, $window, Authentication, swachtamap, NgMap) {
    var vm = this;

    vm.authentication = Authentication;
    vm.swachtamap = swachtamap;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    // Adds a marker to the map.

    // google.maps.event.addListener(angular.element('#swachtaMap'), 'click', function (event) {

    //   addMarker(event.latLng, angular.element('#swachtaMap'));
    // });
    //  $scope.addMarker = function (event) {
    // Add the marker at the clicked location, and add the next-available label
    // from the array of alphabetical characters.
    // var location = event.LatLng.lat();
    // var lat = location.lat();
    // var lng = location.lng();
    //  alert("LOcation :" + location);
    // var marker = new google.maps.Marker({
    //   position: location,
    //   label: "labels[labelIndex++ % labels.length]",
    //   map: map
    // });
    //   }
    $scope.mapInit = function () {
      var latlngbounds = new google.maps.LatLngBounds();
      // alert("LatLng Bounds :"+latlngbounds);
      google.maps.event.addListener(angular.element('#swachtaMap'), 'click', function (e) {
        alert("Latitude: " + e.latLng.lat() + "\r\nLongitude: " + e.latLng.lng());
      });
    }



    $scope.positions = [{
      lat: 43.07493,
      lng: -89.381388
    },
    {
      lat: 33.07493,
      lng: -69.381388
    },
    {
      lat: 53.07493,
      lng: -79.381388
    },
    {
      lat: 63.07493,
      lng: -99.381388
    }
    ];

    $scope.cities = [
      { id: 1, name: 'Oslo', pos: [59.923043, 10.752839] },
      { id: 2, name: 'Stockholm', pos: [59.339025, 18.065818] },
      { id: 3, name: 'Copenhagen', pos: [55.675507, 12.574227] },
      { id: 4, name: 'Berlin', pos: [52.521248, 13.399038] },
      { id: 5, name: 'Paris', pos: [48.856127, 2.346525] }
    ];


    $scope.showAddressBar = true;

    $scope.addOnMap = function () {
      if (showAddressBar) {
        showAddressBar = false;
      } else {
        showAddressBar = true;
      }
    }
    $scope.selectionsChanged = function () {
      $scope.selectedCities = [];
      $scope.selectedValues.forEach(function (cid) {
        var city = $scope.cities.filter(function (c) {
          if (c.id == parseInt(cid))
            return c;
        })[0];
        $scope.selectedCities.push(city);
      });

      $scope.zoomToIncludeMarkers();
    };

    $scope.zoomToIncludeMarkers = function (cities) {
      var bounds = new google.maps.LatLngBounds();
      cities.forEach(function (c) {
        var latLng = new google.maps.LatLng(c.pos[0], c.pos[1]);
        bounds.extend(latLng);
      });
      $scope.map.fitBounds(bounds);
      if (cities.length == 1) {
        $scope.map.setZoom(5);
      }
    };

    $scope.mapOptions = [{ mapType: "Add Air Pollution" },
    { mapType: "Add Water Pollution" }, { mapType: "Add Land Pollution" }, { mapType: "Add Thought Pollution" },
    { mapType: "Add Trees" }];

    var marker = null;
    NgMap.getMap().then(function (map) {
      
      $scope.showCustomMarker = function (evt) {
        // map.customMarkers.foo.setVisible(true);
        // map.customMarkers.foo.setPosition(this.getPosition());
      };
      $scope.closeCustomMarker = function (evt) {
        map.style.display = 'none';
      };
    });

    // NgMap.getMap().then(function (eventMap) {

    //   // alert("Inside intialize");
    //   // swachtamapInstance = eventMap;
    //   // var maps = new google.maps.Map(swachtamapInstance, {
    //   //   zoom: 13,
    //   //   center: { lat: 59.325, lng: 18.070 }
    //   // });

    //   // marker = new google.maps.Marker({
    //   //   map: swachtamapInstance,
    //   //   draggable: true,
    //   //   animation: google.maps.Animation.DROP,
    //   //   position: { lat: 59.327, lng: 18.067 }
    //   // });
    //   // marker.addListener('click', toggleBounce);
    // });

    var options = {
      enableHighAccuracy: true
    };

  
    function toggleBounce() {
      if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
      } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    }
    // Remove existing Swachtamap
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.swachtamap.$remove($state.go('swachtamaps.list'));
      }
    }

    // Save Swachtamap
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.swachtamapForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.swachtamap._id) {
        vm.swachtamap.$update(successCallback, errorCallback);
      } else {
        vm.swachtamap.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('swachtamaps.view', {
          swachtamapId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
} ());

angular.module('tripod')
  .directive('map', ['uiGmapIsReady', 'uiGmapGoogleMapApi', function(uiGmapIsReady, uiGmapGoogleMapApi) {
    return {
      restrict: 'EA',
      template: '<ui-gmap-google-map pan="true" control="map.control" center="map.center" zoom="map.zoom" options="map.options">' +
        '<ui-gmap-marker idKey="map.markerId" coords="map.marker"></ui-gmap-marker></ui-gmap-google-map>',
      scope: {
        address: '=',
        coordinate: '=',
        markerId: '='
      },
      link: function($scope, $element, $attrs) {

        // map defaults
        $scope.map = {
          center: {
            latitude: 35.681382,
            longitude: 139.76608399999998
          },
          zoom: 12,
          markerId: '123',
          marker: {},
          control: {},
          options: {
            scrollwheel: false,
            zoomControlOptions: {
              position: google.maps.ControlPosition.RIGHT_BOTTOM
            }
          }
        };

        // over ride map coord with user info
        if ($scope.coordinate) {
          $scope.map.marker = angular.copy($scope.coordinate);
          $scope.map.markerId = $scope.markerId;
        }

        // refresh the map or it won't be correctly displayed
        // TODO: If I move the map center above, map won't displayed. This is awkward! I need to know why!
        uiGmapIsReady.promise().then(function(maps) {

          // over ride map coord with user info
          if ($scope.coordinate) {
            $scope.map.center = angular.copy($scope.coordinate);
            $scope.map.zoom = 16;
          }

          $scope.map.control.refresh($scope.map.center);
        });

        // address geocoding
        $scope.$watch('address', function(newValue, oldValue, scope) {

          // do nothing if address unchanged
          if (newValue == oldValue) return;

          // clear the coordinate if the address is empty
          if (!newValue) {
            $scope.coordinate = {};
            return;
          }

          uiGmapGoogleMapApi.then(function(maps) {

            var geocoder = new maps.Geocoder();

            geocoder.geocode({
              'address': newValue
            }, function(results, status) {

              if (!results || !results.length) return;

              var newCoord = {
                latitude: results[0].geometry.location.lat(),
                longitude: results[0].geometry.location.lng()
              };

              $scope.$apply(function() {
                // update model
                $scope.coordinate = angular.copy(newCoord);
                // update map center
                $scope.map.center = angular.copy(newCoord);
                // update map marker
                $scope.map.marker = angular.copy(newCoord);
                // zoom in
                $scope.map.zoom = 16;
              });
            });
          });
        });

      }
    };
  }]);

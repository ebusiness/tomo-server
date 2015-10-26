angular.module('tripod')
  .filter('nationality', ['CountryValue', function(CountryValue) {
    return function(value) {
      var country = _.findWhere(CountryValue, {
        code: angular.uppercase(value)
      });

      return country ? country.name : ''
    };
  }]);
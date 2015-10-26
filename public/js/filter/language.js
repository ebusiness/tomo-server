angular.module('tripod')
  .filter('language', ['LanguageValue', function(LanguageValue) {
    return function(value) {
      var language = _.findWhere(LanguageValue, {
        code: angular.uppercase(value)
      });

      return language ? language.name : ''
    };
  }]);
angular.module('tomo', ['ngRoute', 'ngResource', 'ngMessages', 'ngAnimate', 'ngMaterial', 'http-auth-interceptor', 'angularFileUpload'])
  .config(['$routeProvider', '$mdIconProvider', '$mdThemingProvider', function($routeProvider, $mdIconProvider, $mdThemingProvider) {

    $routeProvider
      .when('/', {
        templateUrl: '/admin/template/home.html',
        // controller: 'HomeController',
        // controllerAs: 'ctrl'
      })
      .when('/login', {
        templateUrl: '/template/user/login.html',
        controller: 'LoginController',
        controllerAs: 'ctrl'
      })
      .when('/signup', {
        templateUrl: '/template/user/signup.html',
        controller: 'SignUpController',
        controllerAs: 'ctrl'
      })
      .when('/profile', {
        templateUrl: '/template/user/profile/show.html',
        controller: 'ProfileController',
        controllerAs: 'ctrl',
        resolve: {
          user: ['SessionService', function(SessionService) {
            return SessionService.session();
          }]
        }
      })
      .when('/profile-edit', {
        templateUrl: '/template/user/profile/edit.html',
        controller: 'ProfileEditController',
        controllerAs: 'ctrl',
        resolve: {
          user: ['SessionService', function(SessionService) {
            return SessionService.session();
          }]
        }
      })
      .when('/jobs/:id', {
        templateUrl: '/template/user/job/show.html',
        controller: 'JobController',
        controllerAs: 'ctrl',
        resolve: {
          job: ['$route', 'JobService', function($route, JobService) {
            return JobService.get({
              id: $route.current.params.id
            }).$promise;
          }]
        }
      })
      .when('/jobs/:id/comments', {
        templateUrl: '/template/user/job/comments.html',
        controller: 'JobCommentsController',
        controllerAs: 'ctrl',
        resolve: {
          comments: ['$route', 'JobService', function($route, JobService) {
            return JobService.getComments({
              id: $route.current.params.id
            }).$promise;
          }]
        }
      })
      .when('/companies/:id', {
        templateUrl: '/template/user/comp/show.html',
        controller: 'CompanyController',
        controllerAs: 'ctrl',
        resolve: {
          company: ['$route', 'CompanyService', function($route, CompanyService) {
            return CompanyService.get({
              id: $route.current.params.id
            }).$promise;
          }]
        }
      })
      .otherwise({
        redirectTo: '/'
      });

    $mdIconProvider
      .iconSet('action', '/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg')
      .iconSet('content', '/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-content.svg')
      .iconSet('editor', '/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-editor.svg')
      .iconSet('navigation', '/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-navigation.svg')
      .iconSet('maps', '/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-maps.svg')
      .iconSet('communication', '/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-communication.svg')
      .iconSet('social', '/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-social.svg');

    $mdThemingProvider.theme('default')
      .primaryPalette('teal')
      .accentPalette('pink');

  }]);
// .run(['$http', '$templateCache', function($http, $templateCache) {
//   $http.get('/bower_components/material-design-icons/sprites/svg-sprite/svg-sprite-action.svg', {
//     cache: $templateCache
//   });
// }]);

// bootstrap application manually
angular.bootstrap(document, ['tomo']);
